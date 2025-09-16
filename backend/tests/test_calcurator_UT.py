

import pytest
from backend.services.calc_service import calc_rpn, to_RPN







def test_to_RPN_use_invalid_symbol():
  """使用不可能な記号を使ったときに例外を投げるか検証する
  """
  formula = "5?3"
  with pytest.raises(ValueError):
    to_RPN(formula)
