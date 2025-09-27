"""calc_serviceの単体テストを行うモジュール"""

import pytest
from backend.services.calc_service import *


def test_to_RPN_missing_opening_parenthesis_raises_value_error():
    """開き括弧が不足しているときにValueErrorを投げるか検証する"""
    invalid_formula = "1+2)"
    with pytest.raises(ValueError):
        to_RPN(invalid_formula)


def test_to_rpn_missing_close_parenthesis_raises_value_error():
    """閉じ括弧が不足しているときにValueErrorを投げるか検証する"""
    invalid_formula = "(1+2"
    with pytest.raises(ValueError):
        to_RPN(invalid_formula)


def test_to_rpn_missing_close_parenthesis_raises_value_error():
    """括弧の順番が不正なときにValueErrorを投げるか検証する"""
    invalid_formula = ")1+2("
    with pytest.raises(ValueError):
        to_RPN(invalid_formula)


def test_calc_rpn_zero_division_raises():
    """ゼロ除算が起きた場合にエラーを投げるか検証する"""
    rpn = ["5", "0", "/"]
    with pytest.raises(ZeroDivisionError):
        calc_rpn(rpn)


def test_to_RPN_invalid_symbol_raises_vale_error():
    """使用不可能な記号を使ったときに例外を投げるか検証する"""
    invalid_formula = "5?3"
    with pytest.raises(ValueError):
        to_RPN(invalid_formula)


def test_to_RPN_last_operator_raises_value_error():
    """中置記法の最後に演算子があるときに例外を投げるか検証する"""
    invalid_formula = "1.2+5-2.3+"
    with pytest.raises(ValueError):
        to_RPN(invalid_formula)


def test_to_RPN_consecutive_operators_raises_value_error():
    """演算子の直後に演算子があるときに例外を投げるか検証する"""
    invalid_formula = "1.23++2/34"
    with pytest.raises(ValueError):
        to_RPN(invalid_formula)
