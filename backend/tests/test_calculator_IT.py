import sys
import pytest
from backend.services.calc_service import calc_rpn, to_RPN


def test_simple_addition():
    """2項の足し算の結果が正しいか検証する"""
    formula = "1+2"
    rpn = to_RPN(formula)
    result = calc_rpn(rpn)
    assert result == 3


def test_simple_subtraction():
    """2項の引き算の結果が正しいか検証する"""
    formula = "5-3"
    rpn = to_RPN(formula)
    result = calc_rpn(rpn)
    assert result == 2


@pytest.mark.skipif(sys.platform.startswith("macOS"), reason="Linuxでは不要")
def test_simple_multiplication():
    """2項の掛け算の結果が正しいか検証する

    演算子として'*'を使用

    """
    formula = "3*4"
    rpn = to_RPN(formula)
    result = calc_rpn(rpn)
    assert result == 12


def test_simple_multiplication_readable():
    """2項の掛け算の結果が正しいか検証する

    演算子として'x'を使用

    """
    formula = "3×4"
    rpn = to_RPN(formula)
    result = calc_rpn(rpn)
    assert result == 12


def test_simple_division():
    """2項の割り算の結果が正しいか検証する

    演算子として'/'を使用

    """
    formula = "12/3"
    rpn = to_RPN(formula)
    result = calc_rpn(rpn)
    assert result == 4


def test_simple_division_readable():
    """2項の割り算の結果が正しいか検証する

    演算子として'÷'を使用

    """
    formula = "12÷3"
    rpn = to_RPN(formula)
    result = calc_rpn(rpn)
    assert result == 4


def test_mul_add_correct():
    """()付きの足し算と掛け算の計算順序が正しいか検証する"""
    formula = "(2+3)*5"
    rpn = to_RPN(formula)
    result = calc_rpn(rpn)
    assert result == 25


def test_sub_div_correct():
    """()付きの引き算と割り算の計算順序が正しいか検証する"""
    formula = "(32-2)/5"
    rpn = to_RPN(formula)
    result = calc_rpn(rpn)
    assert result == 6


def test_use_all_operator_with_space_success():
    """()付きの四則演算の計算順序が正しいか検証する"""
    formula = "( 25 + 2 ) / 3 - ( 2 * 3 )"
    rpn = to_RPN(formula)
    result = calc_rpn(rpn)
    assert result == 3
