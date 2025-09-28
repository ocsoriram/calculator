"""計算機能を提供するservice

* to_RPN(calc_formula: str): 中置記法の数式を受け取って、逆ポーランド記法のlistに変換
* calc_rpn(rpn: list[str]):逆ポーランド記法のlistの計算結果を返す
"""

import operator
import re


def _tokenize(calc_formula: str) -> list[str]:
    """トークン化用の正規表現: 小数・整数・演算子・括弧を1トークンとして抽出

    param
    calc_formula:str 中置記法の数式
    """
    # 注意: キャプチャグループや ^/$ アンカーを入れると findall の結果やマッチ範囲が壊れるため使用しない
    pattern = re.compile(
        r"""
        \d+\.\d+               # 小数
        | \d+                  # 整数
        | \+ | \- | \* | \/ | × | ÷  # 四則演算子
        | \(|\)                # ()
        | \(\-\d+\.\d+
        """,
        re.VERBOSE,
    )
    tokens = pattern.findall(calc_formula)

    return tokens


def _validate_tokens(tokens: list[str], original: str) -> None:
    """calc_formulaのバリデーションを行う
    - tokenと中置記法が一致するか(空白を無視)
    - 中置記法内の'('と')'の個数の一致をチェック
    - 中置記法内の'('と')'の順番が正しいかチェック 例) )1+2( はNG

    tokens: _tokenize(calc_formula)で中置記法を逆ポーランド記法に変換したlist[str]
    original: 中置記法の文字列
    """
    _validate_formula_correct(tokens, original)
    _validate_parentheses_correct(tokens)


def _validate_formula_correct(tokens: list[str], original: str) -> None:
    """トークンを結合し直して元の中置記法の式と一致するか確認することで、不適切な記号を弾く"""
    parsed = "".join(tokens)
    if parsed != original.replace(" ", ""):
        raise ValueError("不適切な記号が含まれています。")


def _validate_parentheses_correct(parsed) -> None:
    """()のそれぞれの個数を比較して、()の書き忘れを検証する"""
    if parsed.count("(") != parsed.count(")"):
        raise ValueError("()の数が一致していません。")


def _attach_unary_signs(tokens: list[str]) -> list[str]:
    """中置記法内で表れた+と-の直後の数値を連結して、単一の数値トークンとする。

    符号とみなす条件:
      - 中置記法の先頭に現れる'+','-'
      - '('の直後に現れる'+','-'

    param
    tokens:list[str] 中置記法
    """

    # 空リストが渡されたらそのまま返す
    if not tokens:
        return tokens

    operators = {"+", "-", "*", "×", "/", "÷"}

    # 最後にreturnするリスト　例)　["-1", "+", "5", "-", "3"]
    merged: list[str] = []
    i = 0

    # 数値判定（符号付きも許容）
    number_full: re.Pattern[str] = re.compile(r"-?\d+(?:\.\d+)?$")

    # 中置記法の最後に演算子がある場合はエラー　（例: "3+2+3*", "2+4-" など）
    if tokens[-1] in operators:
        raise ValueError("式の最後に演算子を入れることはできません.")

    while i < len(tokens):
        tok: int = tokens[i]

        if tok in {"+", "-"}:
            prev: str | None = merged[-1] if merged else None
            # 符号の文脈（先頭 / 演算子の直後 / '(' の直後）
            is_unary_context: bool = (
                (prev is None) or (prev in operators) or (prev == "(")
            )

            if is_unary_context:
                # 演算子の直後に数値がなければエラー（例: "--5", "+)", "+*" など）
                # i+1>len(tokens)は起こりえないが、ループ条件の変更や扱いの変更に対応できるようにしている
                if i + 1 >= len(tokens):
                    raise ValueError("符号の直後に数値がありません。")
                nxt = tokens[i + 1]

                # 直後が数値なら連結（例: '-' + '5' -> '-5'）
                if re.fullmatch(r"\d+(?:\.\d+)?", nxt):
                    merged.append(tok + nxt)
                    # このループで2項分を結合しているので、ループのインデックスは2進める
                    i += 2
                    continue
                else:
                    raise ValueError("符号の直後に数値以外が来ています。")
            # elif is_unary_context is false:
            #     raise ValueError(
            #         "演算子を連続して記述することはできません。3×(-5)などの形式で既述してください。"
            #     )

            # ここに来たら二項演算子扱い
            merged.append(tok)
            i += 1
            continue

        # その他のトークンはそのまま
        merged.append(tok)
        i += 1

    # 最終的に、連結後の数値が正しく数値パターンに合うか軽く確認（任意）
    for m in merged:
        # 数値 or 既知演算子 or 括弧 であれば OK
        if number_full.fullmatch(m):
            continue
        if m in operators or m in {"(", ")"}:
            continue
        raise ValueError(f"不正なトークンを検出しました: {m}")

    return merged


def to_RPN(calc_formula: str) -> list[str]:
    """Shunting-yard algorithm を使って、中置記法の計算式の文字列を逆ポーランド記法に変換する関数."""

    rpn: list[str] = []
    stack = []

    # 演算子の優先順位を指定(数値が大きい方が優先度が高い)
    operators = {"+": 1, "-": 1, "*": 2, "×": 2, "/": 2, "÷": 2}

    tokens = _tokenize(calc_formula)
    merged_tokens = _attach_unary_signs(tokens)

    _validate_tokens(merged_tokens, calc_formula)

    # Shunting-yard algorithmの実装
    # tokensから値を一つずつ取り出す
    for token in merged_tokens:
        # 小数か整数ならrpnに格納
        # 数値判定は小数と負の数を含めて厳密に行う
        if re.fullmatch(r"-?\d+(?:\.\d+)?", token):
            rpn.append(token)

        # TODO 連続して演算子が積まれたら、ValueError   例）1++2
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

        # ")"まで来たら、次の"("までのスタックの中身を全てrpnに積む
        elif token == ")":
            # 中置記法内の()の順番を検証
            if "(" not in stack:
                raise ValueError("()の順番が不正です。")
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
