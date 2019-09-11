const Alexa = require('ask-sdk');
const skillName = 'シンプルハローワールド';

const ENGLISH_PACK_ID = "amzn1.adg.product.16fa7bee-3bdf-43bc-9bb8-324dc5c7958d"; // 英語パックのProductIdをコピペしてください。
const HELP_MESSAGE = "「こんにちは」と話しかけてください。英語の「こんにちは」を聞きたい時は、「英語で言って！」と言ってください。どうしますか？";

const LaunchRequestHandler = {
	canHandle(handlerInput) {
		return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
	},
	handle(handlerInput) {
		const speechText = `ようこそ${skillName}へ。${HELP_MESSAGE}`;

		return handlerInput.responseBuilder
			.speak(speechText)
			.reprompt(speechText)
			.withSimpleCard(skillName, speechText)
			.getResponse();
	},
};

const SayHelloHandler = {
	canHandle(handlerInput) {
		return (
			handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
			(handlerInput.requestEnvelope.request.intent.name === 'AMAZON.YesIntent' ||
				handlerInput.requestEnvelope.request.intent.name === 'SayHelloIntent'));
	},
	handle(handlerInput) {
		const locale = handlerInput.requestEnvelope.request.locale;
		const ms = handlerInput.serviceClientFactory.getMonetizationServiceClient();

		return ms.getInSkillProduct(locale, ENGLISH_PACK_ID).then(function (product) {
			console.log("PRODUCT=" + JSON.stringify(product));
			let speechText = "";
			const repromptText = "もっと聞きたいですか？";
			if (product.entitled === "NOT_ENTITLED") {
				// 英語パックを未購入 => 日本語で言う
				speechText = '<say-as interpret-as="interjection">こんにちは</say-as>';
			}
			else {
				// 英語パックを購入済 => 英語で言う
				speechText = '<voice name="Joanna"><lang xml:lang="en-US">Hello!</lang></voice>';
			}

			speechText += '<break time="1s"/>' + repromptText;
			return handlerInput.responseBuilder
				.speak(speechText)
				.reprompt(repromptText)
				.getResponse();
		});
	}
};

const NoIntentHandler = {
	canHandle(handlerInput) {
		return (
			handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
			handlerInput.requestEnvelope.request.intent.name === 'AMAZON.NoIntent'
		);
	},
	handle(handlerInput) {
		const speechText = '<say-as interpret-as="interjection">またね</say-as>';
		return handlerInput.responseBuilder
			.speak(speechText)
			.getResponse();
	}
};

// 「何が買える？」と聞かれた時の応答
const WhatCanIBuyIntentHandler = {
	canHandle(handlerInput) {
		// 課題３: ここを実装してください。
	},
	handle(handlerInput) {
		// 課題３: ここを実装してください。
	}
};

// 英語パックについて教えて。英語パックを購入。と言った場合。
const BuyEnglishPackIntentHandler = {
	canHandle(handlerInput) {
		return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
			handlerInput.requestEnvelope.request.intent.name === 'BuyEnglishPackIntent';
	},
	handle(handlerInput) {
		const locale = handlerInput.requestEnvelope.request.locale;
		const ms = handlerInput.serviceClientFactory.getMonetizationServiceClient();

		return ms.getInSkillProduct(locale, ENGLISH_PACK_ID).then(function (product) {
			// 商品情報を入手する

			if (product.entitled === "ENTITLED") {
				// 購入済
				const speechText = `既に${product.name} を購入しています。続けますか？`;
				const repromptText = `続けますか？`;
				return handlerInput.responseBuilder
					.speak(speechText)
					.reprompt(repromptText)
					.getResponse();
			}
			else {
				// 未購入 => 購入プロセスへ
				console.log('**** Send Buy Directive ****');
				return handlerInput.responseBuilder
					.addDirective({
						type: 'Connections.SendRequest',
						name: 'Buy',
						payload: {
							InSkillProduct: {
								productId: ENGLISH_PACK_ID
							}
						},
						token: 'correlationToken'
					})
					.getResponse();
			}
		});
	}
};

// 「英語で言って」と言われた場合。
// 明示的に「購入する」と言っていないのでUpsellにつなげる。
const SayEnglishHelloIntentHandler = {
	canHandle(handlerInput) {
		return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
			handlerInput.requestEnvelope.request.intent.name === 'SayEnglishHelloIntent';
	},
	handle(handlerInput) {
		const locale = handlerInput.requestEnvelope.request.locale;
		const ms = handlerInput.serviceClientFactory.getMonetizationServiceClient();

		return ms.getInSkillProduct(locale, ENGLISH_PACK_ID).then(function (product) {

			console.log("PRODUCT=" + JSON.stringify(product));

			let speechText = '';
			const repromptText = 'もっと聞きたいですか？';
			if (product.entitled === "ENTITLED") {
				// 購入済。新たに購入する必要はないので、そのまま英語で言う。
				speechText = `<voice name="Joanna"><lang xml:lang="en-US">Hello!</lang></voice>
							<break time="1s"/>${repromptText}`;
				return handlerInput.responseBuilder
					.speak(speechText)
					.reprompt(repromptText)
					.getResponse();
			}
			else {
				// 未購入の場合はアップセル
				speechText = `英語の「こんにちは」を聞くには、${product.name}が必要です。詳しく聞きたいですか？`;
				console.log('**** Send Upsell Directive ****');
				return handlerInput.responseBuilder
					.addDirective({
						type: 'Connections.SendRequest',
						name: 'Upsell',
						payload: {
							InSkillProduct: {
								productId: ENGLISH_PACK_ID
							},
							upsellMessage: speechText
						},
						token: 'correlationToken'
					})
					.getResponse();
			}
		});
	}
};


// 購入フロー Buy|Upsell からスキルに戻ってきた時の処理
const BuyResponseHandler = {
	canHandle(handlerInput) {
		return handlerInput.requestEnvelope.request.type === 'Connections.Response' &&
			(handlerInput.requestEnvelope.request.name === 'Buy' ||
				handlerInput.requestEnvelope.request.name === 'Upsell');
	},
	handle(handlerInput) {
		const locale = handlerInput.requestEnvelope.request.locale;
		const ms = handlerInput.serviceClientFactory.getMonetizationServiceClient();

		return ms.getInSkillProduct(locale, ENGLISH_PACK_ID).then(function (product) {

			if (handlerInput.requestEnvelope.request.status.code === '200') {

				let speechText = product.summary;
				const repromptText = '続けますか？';

				// 購入ステータスのチェック 
				switch (handlerInput.requestEnvelope.request.payload.purchaseResult) {
					case 'ACCEPTED':
						// 購入した
						speechText = product.summary + repromptText;
						break;
					case 'DECLINED':
						// 購入しなかった
						speechText = repromptText;
						break;
					case 'ALREADY_PURCHASED':
						// 既に購入済
						speechText = product.summary + repromptText;
						break;
					default:
						// その他のERROR
						speechText = `うまく行かなかったようですが、${product.name} にご興味をいただき、ありがとうございました。${repromptText}`;
						break;
				}
				// ユーザーに応答を返す
				return handlerInput.responseBuilder
					.speak(speechText)
					.reprompt(repromptText)
					.getResponse();
			}
			else {
				// リクエストのステータスコードが200でなかった場合、コネクションに何らかのエラーが発生 => スキル終了
				console.log(
					`Connections.Response indicated failure.error: + ${handlerInput.requestEnvelope.request.status.message} `
				);
				return handlerInput.responseBuilder
					.speak('何だかうまく行かないようです。後ほどもう一度試してみてください。')
					.getResponse();
			}
		});
	}
};

// 「英語パックを返品して」「英語パックをキャンセル」と言われた場合。
const RefundEnglishPackIntentHandler = {
	canHandle(handlerInput) {
		return (
			handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
			handlerInput.requestEnvelope.request.intent.name === 'RefundEnglishPackIntent'
		);
	},
	handle(handlerInput) {
		// 購入フロー(Cencel)を渡す。一旦セッションが終了する。
		console.log('**** Send Cancel Directive ****');
		return handlerInput.responseBuilder
			.addDirective({
				type: 'Connections.SendRequest',
				name: 'Cancel',
				payload: {
					InSkillProduct: {
						productId: ENGLISH_PACK_ID
					}
				},
				token: 'correlationToken'
			})
			.getResponse();
	}
};

// 購入フロー(Cancel)からスキルに戻ってきた時の処理。セッションが復活する。
const CancelProductResponseHandler = {
	canHandle(handlerInput) {
		return handlerInput.requestEnvelope.request.type === 'Connections.Response' &&
			handlerInput.requestEnvelope.request.name === 'Cancel';
	},
	handle(handlerInput) {
		const locale = handlerInput.requestEnvelope.request.locale;
		const ms = handlerInput.serviceClientFactory.getMonetizationServiceClient();

		return ms.getInSkillProduct(locale, ENGLISH_PACK_ID).then(function (product) {

			console.log(`PRODUCT = ${JSON.stringify(product)} `);

			if (handlerInput.requestEnvelope.request.status.code === '200') {

				let speechText = product.summary;
				const repromptText = '続けますか？';

				// ステータコードによって、Alexaのキャンセル応答の最後に付け加えるスピーチの内容を切り替える。
				// ここでは、いずれの場合でも同じスピーチを付け加えています。必要に応じて変更してください。
				switch (handlerInput.requestEnvelope.request.payload.purchaseResult) {
					case 'ACCEPTED':
						// 返品が受け付けられた
						speechText = product.summary + repromptText;
						break;
					case 'DECLINED':
						// 返品が拒否された
						speechText = repromptText;
						break;
					case 'ALREADY_PURCHASED':
						// 既に購入済
						speechText = product.summary + repromptText;
						break;
					default:
						// 何らかのエラー
						speechText = `キャンセル処理がうまく行かなかったようです。${repromptText}`;
						console.log(`Cancel process returned an error: ${handlerInput.requestEnvelope.request.status.message} `);
						break;
				}
				// ユーザーに応答を返す
				return handlerInput.responseBuilder
					.speak(speechText)
					.reprompt(repromptText)
					.getResponse();
			}
			// 何らかのエラーが発生 => スキル終了
			console.log(
				`Connections.Response indicated failure.error: ${handlerInput.requestEnvelope.request.status.message} `
			);
			return handlerInput.responseBuilder
				.speak('キャンセル処理中に何らかのエラーが起きました。後ほどお試しください。')
				.getResponse();
		});
	},
};

const HelpIntentHandler = {
	canHandle(handlerInput) {
		return handlerInput.requestEnvelope.request.type === 'IntentRequest'
			&& handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
	},
	handle(handlerInput) {
		return handlerInput.responseBuilder
			.speak(HELP_MESSAGE)
			.reprompt(HELP_MESSAGE)
			.withSimpleCard(skillName, HELP_MESSAGE)
			.getResponse();
	},
};

const CancelAndStopIntentHandler = {
	canHandle(handlerInput) {
		return handlerInput.requestEnvelope.request.type === 'IntentRequest'
			&& (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
				|| handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
	},
	handle(handlerInput) {
		const speechText = '<say-as interpret-as="interjection">バイバイ</say-as>';
		return handlerInput.responseBuilder
			.speak(speechText)
			.withSimpleCard(skillName, speechText)
			.getResponse();
	},
};

const SessionEndedRequestHandler = {
	canHandle(handlerInput) {
		return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
	},
	handle(handlerInput) {
		console.log(
			`Session ended with reason: ${handlerInput.requestEnvelope.request.reason} `
		);
		return handlerInput.responseBuilder.getResponse();
	},
};

const ErrorHandler = {
	canHandle() {
		return true;
	},
	handle(handlerInput, error) {
		console.log(
			`Error handled: ${error.message} `
		);
		return handlerInput.responseBuilder
			.speak('すみません。ちょっとよくわかりませんでした。もう一度言ってください。')
			.reprompt('すみません。もう一度お願いします。')
			.getResponse();
	},
};

// ************ インターセプター **************
const LogResponseInterceptor = {
	process(handlerInput) {
		console.log(
			`RESPONSE = ${JSON.stringify(handlerInput.responseBuilder.getResponse())} `
		);
	}
};

const LogRequestInterceptor = {
	process(handlerInput) {
		console.log(
			`REQUEST ENVELOPE = ${JSON.stringify(handlerInput.requestEnvelope)} `
		);
	}
};

// ************ Alexa Skill Builder **************
const skillBuilder = Alexa.SkillBuilders.standard();

exports.handler = skillBuilder
	.addRequestHandlers(
		LaunchRequestHandler,
		SayHelloHandler,
		NoIntentHandler,
		WhatCanIBuyIntentHandler,
		BuyEnglishPackIntentHandler,
		SayEnglishHelloIntentHandler,
		BuyResponseHandler,
		RefundEnglishPackIntentHandler,
		CancelProductResponseHandler,
		HelpIntentHandler,
		CancelAndStopIntentHandler,
		SessionEndedRequestHandler
	)
	.addErrorHandlers(ErrorHandler)
	.addRequestInterceptors(LogRequestInterceptor)
	.addResponseInterceptors(LogResponseInterceptor)
	.lambda();
