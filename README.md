
## fastAPI起動コマンド(開発環境)

```bash
uvicorn backend.main:app --reload
```

プロジェクトの方針として、絶対パスでimportをするため、USGIサーバはプロジェクトルートで起動すること。

## APIドキュメントの参照（Swagger UI）

http://127.0.0.1:8000/docs


## クエリパラメータ基本

https://example.com/?keyword=AI&page=2

?: パラメータの開始.  
keyword=AI: 検索キーワード「AI」を指定するパラメータ.  
&: パラメータの区切り.  
page=2: 2ページ目を指定するパラメータ.  


## TODO
### フロントエンド実装
- 計算結果を丸めて表示する機能を実装する。  
→backendからはfloatで渡されるため  
- ()の閉じ忘れをformエラーで返す。→補完機能？


### バックエンド実装
- 単項の負の数を扱えるようにする
- (-1)+2を負の数として解釈できるようにする
- 12 34 が通ってしまう。数値同士の間のスペースは通さないようにする
- testsディレクトリをunitとintegration　に分割する。
- pytest.iniをhttpかdevtoolsディレクトリに移動させる。(ファイル冒頭に pytestmark = [pytest.mark.unit]（UT）/pytestmark = [pytest.mark.integration]（IT）と付けるか、ディレクトリで分ける。)
