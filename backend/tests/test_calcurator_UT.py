"""calc_serviceの単体テストを行うモジュール"""

import pytest
from backend.services.calc_service import calc_rpn, to_RPN


def test_opening_parenthesis_missing_throws_ValueError():
    """開き括弧が不足しているときにValueErrorを投げるか検証する"""
    invalid_formula = "1+2)"
    with pytest.raises(ValueError):
        to_RPN(invalid_formula)


def test_closing_parenthesis_missing_throws_ValueError():
    """閉じ括弧が不足しているときにValueErrorを投げるか検証する"""
    invalid_formula = "(1+2"
    with pytest.raises(ValueError):
        to_RPN(invalid_formula)


def test_parenthesis_incorrect_order_throws_ValueError():
    """括弧の順番が不正なときにValueErrorを投げるか検証する"""
    invalid_formula = ")1+2("
    with pytest.raises(ValueError):
        to_RPN(invalid_formula)


def test_calc_rpn_zero_division_error():
    """ゼロ除算が起きた場合にエラーを投げるか検証する"""
    rpn = ["5", "0", "/"]
    with pytest.raises(ZeroDivisionError):
        calc_rpn(rpn)


def test_to_RPN_raises_on_invalid_symbol_throws_ValueError():
    """使用不可能な記号を使ったときに例外を投げるか検証する"""
    invalid_formula = "5?3"
    with pytest.raises(ValueError):
        to_RPN(invalid_formula)
