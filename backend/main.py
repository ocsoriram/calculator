import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from backend.routers import calc_router

load_dotenv()

app = FastAPI()
app.include_router(calc_router.router)


# 通信を許可するオリジンを設定
# 本番環境ではフロントをデプロイしたURLを追加する
origins = os.getenv("ALLOW_ORIGINS", "").split(",")


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # 許可するオリジン
    allow_credentials=True,  # Cookie認証を許可する
    allow_methods=["*"],  # 許可するHTTPメソッド
    allow_headers=["*"],  # 許可するHTTPヘッダー
)


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: str = None):
    return {"item_id": item_id, "q": q}
