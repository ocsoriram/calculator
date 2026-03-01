

from fastapi.routing import APIRouter
from backend.schemas.calc_formula_schema import CalcRequest
from backend.services.calc_service import to_RPN, calc_rpn




router = APIRouter(prefix="/calc", tags=["calculator"])

@router.get("/")
def show_calculator():
    return {"hoge": "hoge"}



@router.post("/")
def show_calculator(request: CalcRequest):

    rpn: list[str] = to_RPN(request.formula)
    result: float = calc_rpn(rpn)

    return {"result": result}
