import operator
import re
from attr import dataclass


def to_RPN(calc_formula: str)->list[str]:
  '''Shunting-yard algorithm を使って、中置記法の計算式の文字列を逆ポーランド記法に変換する関数.
  '''

  rpn: list[str] = []
  stack = []

  # 演算子の優先順位を指定(数値が大きい方が優先度が高い)
  operators = {"+":1, "-": 1, "*": 2,"x":2, "/": 2, "÷": 2}

  pattern = re.compile(r"""(\d+\.\d+       # 小数
                      |\d+                 # 整数
                      |\+|\-|\*|\/|x |÷    # 四則演算子
                      |\(|\) )"""          # ()
                      , re.VERBOSE)
  tokens = pattern.findall(calc_formula)

  # Shunting-yard algorithmの実装
  # tokensから値を一つずつ取り出す
  for token in tokens:
  # 数値ならrpnに格納
    if token.isdigit():
      rpn.append(token)

    # 演算子はスタックに積む
    elif token in operators:
      # スタックに積んだ演算子の優先度よりも、今回の演算子の優先度が高い場合はrpnの末尾に追加
      while stack and stack[-1] in operators and operators[stack[-1]] >= operators[token]:
        rpn.append(stack.pop())
      stack.append(token)

    # "("以降をスタックに積む
    elif token == "(":
      stack.append(token)

    # ")"まで来たら、"("がまでのスタックの中身を全てrpnに積む
    elif token ==")":
      while stack and stack[-1] != "(":
        rpn.append(stack.pop())
      stack.pop()                                 # "("を捨てる

  # スタックの残りを全て出力に送る
  while stack:
    rpn.append(stack.pop())

  return rpn


def calc_rpn(rpn: list[str])-> float:
  """逆ポーランド記法のリストを受けとって計算結果を返す

  """

  # 演算子と四則演算をマッピングする
  ops = {
    "+": operator.add,
    "-": operator.sub,
    "*": operator.mul,
    "x": operator.mul,
    "/": operator.truediv,
    "÷": operator.truediv,

  }

  stack = []

  for token in rpn:
    if token in ops:
      b = float(stack.pop())        # 右の数
      a = float(stack.pop())        # 左の数
      result = ops[token](a, b)
      stack.append(result)

    else:
      stack.append(token)

  return stack[0]



if __name__ == "__main__":
  print("input calc_formula: ", end = "")
  calc_formula = input()

  rpn = to_RPN(calc_formula)
  result = calc_rpn(rpn)
  print(f"{calc_formula} convert to RPN is : {rpn}")
  print(f"{calc_formula} = {result}")
