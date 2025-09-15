

from fastapi.routing import APIRouter

from backend.schemas.calc_formula_schema import CalcRequest


router = APIRouter(prefix="/calc", tags=["calculator"])

@router.get("/")
def show_calculator():
    return {"hoge": "hoge"}



@router.post("/")
def show_calculator(request: CalcRequest):

    return {"received": request.formula}
