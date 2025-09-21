"""
計算サービスのRPN変換と評価の結合テスト。
四則演算の基本、演算子の表記ゆれ(*,×,/,÷)、括弧による計算の優先順位決定、空白スペースの無視を検証する。
"""

import math
import pytest
from backend.services.calc_service import calc_rpn, to_RPN


def test_int_addition():
    """2項の足し算の結果が正しいか検証する"""
    formula = "1+2"
    rpn = to_RPN(formula)
    result = calc_rpn(rpn)
    assert result == 3


@pytest.mark.calc_float
def test_float_addition():
    """2項の小数の足し算の結果が正しいか検証する"""
    formula = "1.15+2.2"
    rpn = to_RPN(formula)
    result = calc_rpn(rpn)
    assert math.isclose(result, 1.15 + 2.2, rel_tol=1e-9)


def test_int_subtraction():
    """2項の引き算の結果が正しいか検証する"""
    formula = "5-3"
    rpn = to_RPN(formula)
    result = calc_rpn(rpn)
    assert result == 2


@pytest.mark.calc_float
def test_float_subtraction():
    """2項の小数の引き算の結果が正しいか検証する"""
    formula = "5.5-2.6"
    rpn = to_RPN(formula)
    result = calc_rpn(rpn)
    assert math.isclose(result, 5.5 - 2.6, rel_tol=1e-9)


def test_int_multiplication():
    """2項の掛け算の結果が正しいか検証する"""
    # 演算子として'*'を使用
    formula = "3*4"
    rpn = to_RPN(formula)
    result = calc_rpn(rpn)
    assert result == 12


@pytest.mark.calc_float
def test_float_multiplication():
    """2項の小数の掛け算の結果が正しいか検証する"""
    formula = "2.5*4.1"
    rpn = to_RPN(formula)
    result = calc_rpn(rpn)
    assert math.isclose(result, 2.5 * 4.1, rel_tol=1e-9)


def test_int_multiplication_readable():
    """2項の掛け算の結果が正しいか検証する"""
    # 演算子として'x'を使用
    formula = "3×4"
    rpn = to_RPN(formula)
    result = calc_rpn(rpn)
    assert result == 12


def test_int_division():
    """2項の割り算の結果が正しいか検証する"""
    # 演算子として'/'を使用
    formula = "12/3"
    rpn = to_RPN(formula)
    result = calc_rpn(rpn)
    assert result == 4


@pytest.mark.calc_float
def test_float_division():
    """2項の小数の割り算の結果が正しいか検証する"""
    formula = "8.5/2.4"
    rpn = to_RPN(formula)
    result = calc_rpn(rpn)
    assert math.isclose(result, 8.5 / 2.4, rel_tol=1e-9)


def test_int_division_readable():
    """2項の割り算の結果が正しいか検証する"""
    # 演算子として'÷'を使用
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
    """()有り、かつ半角スペース入りの四則演算の計算順序が正しいか検証する"""
    formula = "( 25 + 2 ) / 3 - ( 2 * 3 )"
    rpn = to_RPN(formula)
    result = calc_rpn(rpn)
    assert result == 3
