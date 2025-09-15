

from fastapi.routing import APIRouter


router = APIRouter(prefix="/calc", tags=["calculator"])

@router.get("/")
def show_calculator():
    return {"hoge": "hoge"}



@router.post("/{calcFormula}")
def show_calculator():

    return None
