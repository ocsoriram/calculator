from fastapi import FastAPI

from backend.router import calc_router

app = FastAPI()
app.include_router(calc_router.router)

@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: str = None):
    return {"item_id": item_id, "q": q}
