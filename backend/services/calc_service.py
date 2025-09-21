"""計算機能を提供するservice

* to_RPN(calc_formula: str): 中置記法の数式を受け取って、逆ポーランド記法のlistに変換
* calc_rpn(rpn: list[str]):逆ポーランド記法のlistの計算結果を返す
"""

import operator
import re


def _tokenize(calc_formula) -> list[str]:
    """トークン化用の正規表現: 小数・整数・演算子・括弧を1トークンとして抽出"""
    # 注意: キャプチャグループや ^/$ アンカーを入れると findall の結果やマッチ範囲が壊れるため使用しない
    pattern = re.compile(
        r"""
        \d+\.\d+               # 小数
        | \d+                  # 整数
        | \+ | \- | \* | \/ | × | ÷  # 四則演算子
        | \(|\)                # ()
    """,
        re.VERBOSE,
    )
    tokens = pattern.findall(calc_formula)

    return tokens


def _validate_tokens(tokens: list[str], original: str) -> None:
    """calc_formulaのバリデーションを行う"""
    _validate_formula_correct(tokens, original)
    _validate_parentheses_correct(tokens)


def _validate_formula_correct(tokens: list[str], original: str):
    """トークンを結合し直して元の中置記法の式と一致するか確認することで、不適切な記号を弾く"""
    parsed = "".join(tokens)
    if parsed != original.replace(" ", ""):
        raise ValueError("不適切な記号が含まれています。")


def _validate_parentheses_correct(parsed):
    """()のそれぞれの個数を比較して、()の書き忘れを検証する"""
    if parsed.count("(") != parsed.count(")"):
        raise ValueError("()の数が一致していません。")


def to_RPN(calc_formula: str) -> list[str]:
    """Shunting-yard algorithm を使って、中置記法の計算式の文字列を逆ポーランド記法に変換する関数."""

    rpn: list[str] = []
    stack = []

    # 演算子の優先順位を指定(数値が大きい方が優先度が高い)
    operators = {"+": 1, "-": 1, "*": 2, "×": 2, "/": 2, "÷": 2}

    tokens = _tokenize(calc_formula)
    _validate_tokens(tokens, calc_formula)

    # Shunting-yard algorithmの実装
    # tokensから値を一つずつ取り出す
    for token in tokens:
        # 小数か整数ならrpnに格納
        # 数値判定は小数も含めて厳密に行う
        if re.fullmatch(r"\d+(?:\.\d+)?", token):
            rpn.append(token)

        # 演算子はスタックに積む
        elif token in operators:
            # スタックに積んだ演算子の優先度よりも、今回の演算子の優先度が高い場合はrpnの末尾に追加
            while (
                stack
                and stack[-1] in operators
                and operators[stack[-1]] >= operators[token]
            ):
                rpn.append(stack.pop())
            stack.append(token)

        # "("以降をスタックに積む
        elif token == "(":
            stack.append(token)

        elif token == ")" and "(" not in stack:
            raise ValueError("()の順番が不正です。")

        # ")"まで来たら、次の"("までのスタックの中身を全てrpnに積む
        elif token == ")" and "(" in stack:
            while stack and stack[-1] != "(":
                rpn.append(stack.pop())
            stack.pop()  # "("を捨てる

    # スタックの残りを全て出力に送る
    while stack:
        rpn.append(stack.pop())

    return rpn


def calc_rpn(rpn: list[str]) -> float:
    """逆ポーランド記法のリストを受けとって計算結果を返す"""

    # 演算子と四則演算をマッピングする
    ops = {
        "+": operator.add,
        "-": operator.sub,
        "*": operator.mul,
        "×": operator.mul,
        "/": operator.truediv,
        "÷": operator.truediv,
    }

    stack = []

    for token in rpn:
        if token in ops:
            b = float(stack.pop())  # 右の数
            a = float(stack.pop())  # 左の数
            result = ops[token](a, b)
            stack.append(result)

        else:
            stack.append(token)

    return stack[0]


if __name__ == "__main__":
    print("input calc_formula: ", end="")
    calc_formula = input()

    rpn = to_RPN(calc_formula)
    result = calc_rpn(rpn)
    print(f"{calc_formula} convert to RPN is : {rpn}")
    print(f"{calc_formula} = {result}")
