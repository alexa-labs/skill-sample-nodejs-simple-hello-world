**[Alexaスキル内課金ワークショップ](../README.md)**

# 課題５ スキルの認定と公開
<img src="https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/quiz-game/header._TTH_.png" />

スキルが完成したら、[Alexaスキルストア](http://www.amazon.co.jp/skills) に公開して、家族やお友達、さらには世界中の人々にも使ってもらいたいものです。スキル公開には公開申請をしてAlexaチームの審査をパスする必要があります。

課題５では、公開申請までに必要なステップを体験します。実際の公開申請はご自分のアイデアで作ったオリジナルのスキルで行ってくださいね :smile:

課題５をクリアすると、公開審査に必要な情報を準備することができるようになります。

## 課題の手順

1. Alexa開発者コンソールで、シンプルハローワールドスキルのプロジェクトが開いていることを確認します。

1. 上部のメニューから **公開** タブを開きます。

1. 画面上のガイダンスに従って各フィールドを順に記入します。

    > (？) マークにマウスカーソルをあてると、そのフィールドのヘルプがポップアップ表示されます。 **アスタリスクのついたフィールドは必須です。** 審査を無事通過させるため、時間をとって正確に記入してください。

    - **スキルの説明**

      魅力的で簡潔な説明文を入力してください。 説明文はユーザにあなたのスキルの魅力を伝えるためのものです。 最大限に活用しましょう。 これらの説明文は [Alexaアプリ](http://alexa.amazon.co.jp/spa/index.html#skills) と[Alexaスキルストア](http://www.amazon.co.jp/skills) のスキル一覧ページに表示されます。

    - **サンプルフレーズ**

      ユーザーがスキルに話しかけるときに最も使われそうなフレーズを3つ入力します。

      **サンプルフレーズ** には、サンプル発話と完全に一致するものを入力してください。 ここを間違えてしまったことで審査が通らなかったという例がよくあります。以下にサンプルフレーズを書くときに考慮すべき事項を記載しておきます。

       | サンプルフレーズを入力する際に考慮すべき事項 |
       | ----------------------------------------- |
       | サンプルフレーズは [ユーザーによるカスタムスキルの呼び出し](https://developer.amazon.com/ja/docs/custom-skills/understanding-how-users-invoke-custom-skills.html) に書かれているルールに沿っていること。 |
       | サンプルフレーズは対話モデルで定義した **サンプル発話** に基づいたものであること。 |
       | 1番目のサンプルフレーズは **ウェイクワードと呼び出し名** を含んでいること。 |
       | サンプルフレーズは **適切な応答を返す** ものであること。 |

      > ユーザーがスキルに話しかけるときに、最も使いそうなフレーズを3つ選んでください。 どのフレーズも正常に動作し、素晴らしいユーザー体験を提供するようにしてください。

    - **スキルアイコン**

        スキルのアイコンは **108x108** ピクセルと **512x512** ピクセルの2通りのサイズを用意する必要があります。

        > 自分が権利を保有するオリジナルのアイコンを作成してください。商標やコピーライトを侵害しないようにしてください。
  
      アイコンを作成するソフトウェアをお持ちでない場合は、以下のような無料ソフトから選ぶと良いでしょう。

       * [Alexa Skill Icon Builder](https://developer.amazon.com/docs/tools/icon-builder.html)
       * [GIMP](https://www.gimp.org/) (Windows/Mac/Linux)
       * [Paint.NET](http://www.getpaint.net/index.html) (Windows)
       * [Inkscape](http://inkscape.org) (Windows/Mac/Linux)
       * [Iconion](http://iconion.com/) (Windows/Mac)

      各サイズのブランクのアイコンを様々なフォーマットでご用意しました。よろしければお使いください。

        *  [PSD](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/general/icon-templates/psd.zip)
        *  [PNG](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/general/icon-templates/png.zip)
        *  [GIF](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/general/icon-templates/gif.zip)
        *  [PDF](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/general/icon-templates/pdf.zip)
        *  [JPG](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/general/icon-templates/jpg.zip)
        *  [SVG](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/general/icon-templates/svg.zip)
        *  [PDN](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/general/icon-templates/pdn.zip) - [Paint.NET](http://www.getpaint.net/index.html)用
        *  [XCF](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/general/icon-templates/xcf.zip) - [GIMP](https://www.gimp.org/)用

    - **カテゴリー** 
    
      スキルのカテゴリーとして最も適切なものを選んでください。

    - **キーワード** 
    
      ユーザーがスキルを探すときに使うであろうキーワードを全て入力します。

      > この項目は任意です。 [Alexaアプリ](http://alexa.amazon.co.jp)　での検索ではスキル名や説明文にある単語も検索対象となるため、入力を省略しても問題ありません。 スキルを探すときにユーザーに使って欲しい単語がある場合は、それらのキーワードを入力してください。 複数のキーワードはカンマで区切ってください。

    - **プライバシーポリシー URL** 

      必須項目ではありませんが、必要に応じて設定してください。

    - **利用規約 URL** 

      必須項目ではありませんが、必要に応じて設定してください。

1. 入力が完成したらページ下部の **保存して続行** ボタンをクリックし、**プライバシーとコンプライアンス** へ移動します。

1.  **プライバシーとコンプライアンス** の質問には、下記のガイダンスに従いながら答えてください。

    * **このスキルを使って何かを購入したり、実際にお金を支払うことができますか？**

      今回のシンプルハローワールドスキルのケースでは、**はい** を選択します。将来、あなたが作るスキルに適したオプションを選択してください。

    * **このスキルはユーザーの個人情報を収集しますか？** 
    
      シンプルハローワールドスキルでは、**いいえ** を選択します。 もし、ユーザーの個人情報、例えば氏名やメールアドレス、電話番号等を収集しているのであれば、この質問に**はい**と答えてください。
 
      > この質問に **はい**と答えた場合、プライバシーポリシーへのリンクを提供する必要があります。

    * **このスキルは13際未満の子供を対象としたものですか？** 
    
      スキルのデータはあなたが用意したデータでカスタマイズされているので、13際未満の子供を対象にしているかもしれません。カスタマイズする前の状態のプレミアムトリビアは特定の年齢層をターゲットとしたものではないので、**いいえ** を選択します。

      スキルが13際未満の子供向けかどうかを判断すには、以下の要素を考慮してみてください。

      * スキルのテーマ
      * 子供向けの内容が含まれているか
      * スキル内の言葉遣い
      * スキル内で利用されている音楽やその他おオーディオコンテンツ
      * スキルがどのように説明されマーケティングされるか
      * スキルの想定利用者層
            
    * **輸出コンプライアンス** 

      全ての項目に同意できるか確認してください。 同意する場合はボックスにチェックをつけてください。 Amazonがスキルを配布するためには、ここでの同意が必要です。

    * **テストの手順** 

      この欄は、あなたのスキルや、特殊だったり混乱しがちな機能を、審査チームに対して説明する機会となります。

      アマゾンが公開しているサンプルスキルをカスタマイズして作成した場合は、その旨を記載してください。
    
      記入例:
      ```
      これはプレミアムハローワールドスキルのサンプルをもとに作成しました。
      ```
      これによりテストチームがスキルの構造を理解しテスト時間を節約することができます。
      > 注意: 認定の詳細は [Alexaスキルを公開する](https://developer.amazon.com/ja/alexa-skills-kit/launch) をご参照ください。

    * **ベータテスト**

      詳しくは [Alexaスキルのベータテストを行う
](https://developer.amazon.com/ja/docs/custom-skills/skills-beta-testing-for-alexa-skills.html) をご参照ください。

      > 注意: ベータテストでは、ベータテスターはスキル内課金で決済しても、実際の支払いは発生しません。

1. **保存して続行** ボタンをクリックします。認定タブに移ります。

    - **検証**ページ

        **検証**のページでは、スキル公開申請に必要な入力のステップが不足している場合、その通知がなされます。通常はこのページには何も表示されませんが、もし表示されている場合は、戻って問題を修正してください。

    - **機能テスト**ページ

        **機能テスト** をクリックして画面を開き、**実行**ボタンをクリックします。スキルに対する機能テストが実行されます。 通常はこのページには何も表示されませんが、もし表示されている場合は、戻って問題を修正してください。

1. ここまで入力が完了したら、課題５は終了です。

    本来は、最後に**申請**をクリックして、**はい、審査を申請します**ボタンをクリックし**申請完了** となります。是非ご自身のスキルでここまでの手順を参考にやってみてください。

    * 実際にスキルを公開する際は、十分にテストをして完成度を高めてから申請をしてください。

    * **認定には数日かかります。** 審査が完了するまでしばらくお待ちください。

    *  [スキル開発者への特典](https://developer.amazon.com/ja/alexa-skills-kit/alexa-developer-skill-promotion?&sc_category=Owned&sc_channel=RD&sc_campaign=Evangelism2018&sc_publisher=github&sc_content=Survey&sc_detail=fact-nodejs-V2_GUI-6&sc_funnel=Convert&sc_country=WW&sc_medium=Owned_RD_Evangelism2018_github_Survey_fact-nodejs-V2_GUI-6_Convert_WW_beginnersdevs&sc_segment=beginnersdevs) 
    もございますので、ご参照ください。


