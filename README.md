
## fastAPI起動コマンド(開発環境)

uvicorn backend.main:app --reload

## APIドキュメントの参照（Swagger UI）

http://127.0.0.1:8000/docs


## クエリパラメータ基本

https://example.com/?keyword=AI&page=2
?: パラメータの開始
keyword=AI: 検索キーワード「AI」を指定するパラメータ
&: パラメータの区切り
page=2: 2ページ目を指定するパラメータ


## TODO

フロントエンドで、計算結果を丸めて表示する機能を実装すること。
