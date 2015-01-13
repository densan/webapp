Webapp Skeleton
===============

Web Application を開発する際のスケルトンです。

(電子計算機研究部ネットワークチーム 2014年度 冬課題)

課題
----
* `routes/message.js`
* `routes/home.js`
* `views/` 以下のファイル
* `public/` 以下のファイル

これらを編集・必要があれば作成して、テストケースを全て満たす文字列投稿サービスを開発してください。

`test/` 以下の既存のテストケースを改変する行為は禁じますが、テストケースを増やすことは許可します。

出来れば、 fork して自分のリポジトリに修正履歴を残してください。

導入
----
### クローン
```
git clone
```

または SourceTree からクローンしてください。

[参考](http://h2ham.net/sourcetree-ssh-port-setting "SourceTree（Git）で SSH ＆ポート指定でリポジトリを clone する方法 - HAM MEDIA MEMO")

### モジュール取得
```
npm i
```

で必要なモジュールを取得します。

起動方法
-------
### DB Server
```
mongod -f db/mongod.conf
```

### Web Server
```
npm start
```

テスト実行
---------
```
npm test
```

参考資料
-------
公式ドキュメントは大抵英語であることが多いですが、慣れてください。
分からない英文は [Google 翻訳](https://translate.google.co.jp/) を使って読んでいきます。

### MongoDB, mongoose
* [Mongoose - デベロッパーズガイド 日本語訳](http://muddy-dixon.appspot.com/ja/mongoosejs/index.html)
* [Mongoose 公式ドキュメント](http://mongoosejs.com/)

### JavaScript, Node.js
* [JavaScript ドキュメント | MDN](https://developer.mozilla.org/ja/docs/Web/JavaScript)
* [Node.js 公式 API ドキュメント](http://nodejs.jp/nodejs.org_ja/docs/v0.10/api/)

### Express
* [Express 公式ドキュメント](http://expressjs.com/4x/api.html)

### Passport (OAuth, OpenID)
* [Passport 公式ドキュメント](http://passportjs.org/guide/)

License
-------
[MIT](LICENSE)
