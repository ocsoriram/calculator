from pydantic import BaseModel, Field

class CalcRequest(BaseModel):
  formula: str = Field (
    ...,                            # ... は Python の「Ellipsis（エリプシス）」という特別なオブジェクトで、ここでは 必須フィールドであることを示すために使われている
    pattern=r"^[0-9x÷+\-*/(). ]+$",
    min_length=1,
    max_length=100
  )
