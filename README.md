# Alexaスキル内課金ワークショップ 

**skill-sample-nodejs-simple-premium-hello-world**

このスキル（スキル名；シンプルハローワールド）は、Alexaスキル内課金ワークショップ用に開発されたサンプルスキルです。GitHub.comのAlexa公式ページにある、「プレミアムハローワールド」[skill-sample-nodejs-premium-hello-world](https://github.com/alexa/skill-sample-nodejs-premium-hello-world) をベースに、初心者にもコードを理解しやすいように作り変えています。

## ワークショップの目的

このスキルを通して、Alexaのスキル内課金の仕組みと実装方法の基本を学ぶことができます。

## ワークショップの学習目標

1. スキル内課金商品を定義し、スキルから購入できるよう登録することができるようになる。
1. ASK SDK for Node.js を使って、スキル内課金の実装に必要なインターフェースを実装できるようになる。
1. スキル内課金を実装したスキルをデプロイしテストできるようになる。
1. シンプルハローワールドスキルを応用し、自分でカスタマイズできるようになる。

## シンプルハローワールドスキルの概要

スキルの呼び出し名: **シンプルハローワールド**

このスキルに、「こんにちは」と話しかけると、日本語で「こんにちは」とAlexaが応答してくれます。
**買い切り型**のスキル内商品「英語パック」を購入すると、Amazon Pollyの音声を使った自然な英語の発音で「Hello!」と言ってくれます。

「英語パック」は、ユーザーがAlexaに「英語で言って」と依頼した場合(Upsell)と、「英語パックを購入」と言った場合(Buy)、Alexaの課金サービスの購入フローに進みユーザーに適した価格で購入することができます。

### 受講の条件
- JavaScriptまたはNode.jsのプログラミング経験があること。
- Alexaのシンプルなカスタムスキルを作成した経験があること。
- Amazonの開発者アカウントを登録していること。さらに、スキル内課金の機能をテストするには以下の条件が必須です。
    - Alexaアプリの設定で**音声ショッピングが有効**になっていること。
    - アカウントの登録住所が**日本国内の住所**になっていること。

### 利用しているAlexaの機能
- Alexa Skills Kit SDK for Node.js
- スキル内課金API
- SSMLを使った、Amazon Pollyボイス
- 日本語スピーチコン

# 課題

ワークショップでは、５つの課題に取り組みます。

:point_right: [課題1「シンプルハローワールド」のセットアップ](./instructions/1-setup-sample-skill.md)

:point_right: [課題2 スキルの動作確認とログの確認](./instructions/2-test.md)

:point_right: [課題3 **WhatCanIBuyIntentHandler**の実装](./instructions/3-adding-WhatCanIBuyIntent-handler.md)

:point_right: [課題4 サブスクリプション商品の追加](./instructions/4-adding-subscription-product.md)

:point_right: [課題5 スキルの認定と公開](./instructions/5-submit-for-certification.md)


