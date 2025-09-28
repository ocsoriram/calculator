"""calc_serviceの単体テストを行うモジュール"""

import pytest
from backend.services.calc_service import to_RPN, calc_rpn


@pytest.mark.parametrize("invalid_formula", ["1+2)", "(1+2"])
def test_to_RPN_missing_opening_parenthesis_raises_value_error(invalid_formula):
    """
    開き括弧が不足しているときにValueErrorを投げるか検証する
    閉じ括弧が不足しているときにValueErrorを投げるか検証する
    """

    # matchはre.searchなので()のエスケープが必要
    with pytest.raises(ValueError, match=r"\(\)の数が一致していません。"):
        to_RPN(invalid_formula)


def test_to_RPN_invalid_parenthesis_order_raises_value_error():
    """括弧の順番が不正なときにValueErrorを投げるか検証する"""
    invalid_formula = ")1+2("
    with pytest.raises(ValueError):
        to_RPN(invalid_formula)


def test_calc_RPN_zero_division_raises():
    """ゼロ除算が起きた場合にエラーを投げるか検証する"""
    rpn = ["5", "0", "/"]
    with pytest.raises(ZeroDivisionError, match="division by zero"):
        calc_rpn(rpn)


def test_to_RPN_invalid_symbol_raises_value_error():
    """使用不可能な記号を使ったときに例外を投げるか検証する"""
    invalid_formula = "5?3"
    with pytest.raises(ValueError, match="不適切な記号が含まれています。"):
        to_RPN(invalid_formula)


def test_to_RPN_last_operator_raises_value_error():
    """中置記法の最後に演算子があるときに例外を投げるか検証する"""
    invalid_formula = "1.2+5-2.3+"
    with pytest.raises(ValueError, match="式の最後に演算子を入れることはできません。"):
        to_RPN(invalid_formula)


# TODO 連続演算子は通さない実装にきりかえる
# TODO "1.23+*2*34", "1.23+/2+34" テストに左記を加えても通るように実装を変更する
@pytest.mark.parametrize("invalid_formula", ["1.23++2/34"])
def test_to_RPN_consecutive_operators_raises_value_error(invalid_formula):
    """演算子の直後に演算子があるときに例外を投げるか検証する"""
    with pytest.raises(ValueError):
        to_RPN(invalid_formula)
