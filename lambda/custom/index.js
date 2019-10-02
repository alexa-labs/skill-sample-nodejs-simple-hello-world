const Alexa = require('ask-sdk');
const skillName = 'シンプルハローワールド';

const HELP_MESSAGE = "「こんにちは」と話しかけてください。英語で「こんにちは」を聞きたい場合は、「英語で言って！」と言ってください。どうしますか？";

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

		return ms.getInSkillProducts(locale, null, 'ENTITLED').then(function (res) {

			let speechText = "";
			const repromptText = "もっと聞きたいですか？";
			const products = res.inSkillProducts;

			console.log("PRODUCTS=" + JSON.stringify(products));

			if (products.length === 0) {
				// 英語パックもサブスクリプションも未購入 => 日本語で言う
				speechText = '<say-as interpret-as="interjection">こんにちは</say-as>';
			}
			else {
				// 英語パックかサブスクリプションのどちらか購入済 => 英語で言う
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
		return (handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
			handlerInput.requestEnvelope.request.intent.name === 'WhatCanIBuyIntent');
	},
	handle(handlerInput) {
		// スキル内課金で購入できる商品情報を入手する
		const locale = handlerInput.requestEnvelope.request.locale;
		const ms = handlerInput.serviceClientFactory.getMonetizationServiceClient();
		return ms.getInSkillProducts(locale, 'PURCHASABLE', 'NOT_ENTITLED').then(function (res) {

			// res にはスキルで提供する全てのISP商品のリストが含まれる
			// ここでは、JavaScriptのフィルターを使って、購入可能(PURCHASABLE)かつ未購入(NOT_ENTITLED)の商品のリストを抽出する
			const products = res.inSkillProducts;
			console.log("PRODUCTS=" + JSON.stringify(products));
			// 購入可能な商品を言う。
			if (products.length > 0) {
				// 一つ以上の商品を購入可能な場合、商品のリストを繋げて言う
				const speechText = `現在、購入できる商品は、${getSpeakableListOfProducts(products)} です。
							詳しく知りたい場合は、例えば「${products[0].name}について詳しく教えて。」と言ってください。
							このまま続けたい場合は、「こんにちは」と言ってください。どうしますか？`;
				const repromptOutput = 'すみません、もう一度言ってください。';
				return handlerInput.responseBuilder
					.speak(speechText)
					.reprompt(repromptOutput)
					.getResponse();
			}
			else {
				// すでに購入済か、購入できる商品がない場合
				speechText = '現在、購入できる商品はありません。続けますか？';
				repromptText = '続けますか？';
			}
			return handlerInput.responseBuilder
				.speak(speechText)
				.reprompt(repromptText)
				.getResponse();
		});
	}
};

// 購入可能な商品のリストを生成するヘルパー関数
function getSpeakableListOfProducts(products) {
	const productNameList = products.map(item => item.name);
	let speechText = productNameList.join('、または'); // 商品名を「または」で連結して一文を作成する。
	return speechText;
}

// 英語パックについて教えて。英語パックを購入。と言った場合。
const BuyEnglishPackIntentHandler = {
	canHandle(handlerInput) {
		return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
			handlerInput.requestEnvelope.request.intent.name === 'BuyEnglishPackIntent';
	},
	handle(handlerInput) {
		const locale = handlerInput.requestEnvelope.request.locale;
		const ms = handlerInput.serviceClientFactory.getMonetizationServiceClient();

		return ms.getInSkillProducts(locale).then(function (res) {
			// 商品情報を入手する
			let products = res.inSkillProducts.filter(
				record => record.entitled === 'ENTITLED'
			);

			console.log("PRODUCTS=" + JSON.stringify(products));

			if (products.length > 0) {
				// 購入済
				const speechText = `既に${products[0].name} を購入しています。続けますか？`;
				const repromptText = `続けますか？`;
				return handlerInput.responseBuilder
					.speak(speechText)
					.reprompt(repromptText)
					.getResponse();
			}
			else {
				// 未購入 => 購入プロセスへ
				// 「英語パック」のproductIdを入手
				products = res.inSkillProducts.filter(
					record => record.referenceName === 'English_Pack'
				);

				console.log('**** Send Buy Directive ****');
				return handlerInput.responseBuilder
					.addDirective({
						type: 'Connections.SendRequest',
						name: 'Buy',
						payload: {
							InSkillProduct: {
								productId: products[0].productId
							}
						},
						token: 'correlationToken'
					})
					.getResponse();
			}
		});
	}
};

// サブスクリプションついて教えて。サブスクリプションを購入。と言った場合。
const BuySubscriptionIntentHandler = {
	canHandle(handlerInput) {
		return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
			handlerInput.requestEnvelope.request.intent.name === 'BuySubscriptionIntent';
	},
	handle(handlerInput) {
		const locale = handlerInput.requestEnvelope.request.locale;
		const ms = handlerInput.serviceClientFactory.getMonetizationServiceClient();

		return ms.getInSkillProducts(locale).then(function (res) {
			// 商品情報を入手する
			const entitledProducts = res.inSkillProducts.filter(record => record.entitled == 'ENTITLED');

			console.log("PRODUCTS=" + JSON.stringify(entitledProducts));

			if (entitledProducts.length > 0) {
				// 購入済
				const speechText = `既に${entitledProducts[0].name} を購入しています。続けますか？`;
				const repromptText = `続けますか？`;
				return handlerInput.responseBuilder
					.speak(speechText)
					.reprompt(repromptText)
					.getResponse();
			}
			else {
				// 未購入 => 購入プロセスへ
				// 「サブスクリプション」の商品情報入手
				const subscriptionProducts = res.inSkillProducts.filter(
					record => record.referenceName === 'Subscription'
				);

				console.log('**** Send Buy Directive ****');
				return handlerInput.responseBuilder
					.addDirective({
						type: 'Connections.SendRequest',
						name: 'Buy',
						payload: {
							InSkillProduct: {
								productId: subscriptionProducts[0].productId
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

		return ms.getInSkillProducts(locale).then(function (res) {

			let products = res.inSkillProducts.filter(
				record => record.entitled === 'ENTITLED'
			);

			console.log("PRODUCTS=" + JSON.stringify(products));

			let repromptText = '';
			let speechText = '';

			if (products.length > 0 && products[0].entitled === "ENTITLED") {
				// 購入済。新たに購入する必要はないので、そのまま英語で言う。
				repromptText = 'もっと聞きたいですか？';
				speechText = `< voice name = "Joanna" > <lang xml: lang="en-US">Hello!</lang></voice >
					<break time="1s" />${ repromptText} `;
				return handlerInput.responseBuilder
					.speak(speechText)
					.reprompt(repromptText)
					.getResponse();
			}
			// 未購入の場合は購入可能な商品を調べ、購入を勧めるか、このまま続けるか選択してもらう。
			// 購入可能(PURCHASABLE)かつ未購入(NOT_ENTITLED)の商品のリストを抽出する
			products = res.inSkillProducts.filter(
				record => record.entitled === 'NOT_ENTITLED'
			);

			speechText = `英語で「こんにちは」を聞くには、${getSpeakableListOfProducts(products)} の購入が必要です。`;
			products.forEach(function (item) {
				speechText += `${item.name} を購入したい場合は、「${item.name} を購入」と言ってください。`
			});
			speechText += `このまま続けたい場合は、「こんにちは」と言ってください。どうしますか？`;
			repromptText = 'どうしますか？';
			return handlerInput.responseBuilder
				.speak(speechText)
				.reprompt(repromptText)
				.getResponse();
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
		const productId = handlerInput.requestEnvelope.request.payload.productId;

		return ms.getInSkillProduct(locale, productId).then(function (product) {

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
						speechText = `うまく行かなかったようですが、${product.name} にご興味をいただき、ありがとうございました。${repromptText} `;
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
		const locale = handlerInput.requestEnvelope.request.locale;
		const monetizationClient = handlerInput.serviceClientFactory.getMonetizationServiceClient();

		// 購入フロー(Cencel)を渡す。一旦セッションが終了する。
		return monetizationClient.getInSkillProducts(locale).then(function (res) {
			const products = res.inSkillProducts.filter(
				record => record.referenceName === 'English_Pack'
			);
			return handlerInput.responseBuilder
				.addDirective({
					type: 'Connections.SendRequest',
					name: 'Cancel',
					payload: {
						InSkillProduct: {
							productId: products[0].productId
						}
					},
					token: 'correlationToken'
				})
				.getResponse();
		});
	}
};

// 「サブスクリプションをキャンセルして」「サブスクリプションを解約したい」と言われた場合。
const CancelSubscriptionIntentHandler = {
	canHandle(handlerInput) {
		return (
			handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
			handlerInput.requestEnvelope.request.intent.name === 'CancelSubscriptionIntent'
		);
	},
	handle(handlerInput) {
		const locale = handlerInput.requestEnvelope.request.locale;
		const monetizationClient = handlerInput.serviceClientFactory.getMonetizationServiceClient();

		// 購入フロー(Cencel)を渡す。一旦セッションが終了する。
		return monetizationClient.getInSkillProducts(locale).then(function (res) {
			const products = res.inSkillProducts.filter(
				record => record.referenceName === 'Subscription'
			);
			return handlerInput.responseBuilder
				.addDirective({
					type: 'Connections.SendRequest',
					name: 'Cancel',
					payload: {
						InSkillProduct: {
							productId: products[0].productId
						}
					},
					token: 'correlationToken'
				})
				.getResponse();
		});
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
		const productId = handlerInput.requestEnvelope.request.payload.productId;
		let speechText = '';
		const repromptText = '続けますか？';

		return ms.getInSkillProduct(locale, productId).then(function (product) {

			console.log(`PRODUCTS = ${JSON.stringify(product)} `);

			if (handlerInput.requestEnvelope.request.status.code === '200') {
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
						speechText = `キャンセル処理がうまく行かなかったようです。${repromptText} `;
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
		BuySubscriptionIntentHandler,
		SayEnglishHelloIntentHandler,
		BuyResponseHandler,
		RefundEnglishPackIntentHandler,
		CancelSubscriptionIntentHandler,
		CancelProductResponseHandler,
		HelpIntentHandler,
		CancelAndStopIntentHandler,
		SessionEndedRequestHandler
	)
	.addErrorHandlers(ErrorHandler)
	.addRequestInterceptors(LogRequestInterceptor)
	.addResponseInterceptors(LogResponseInterceptor)
	.lambda();
