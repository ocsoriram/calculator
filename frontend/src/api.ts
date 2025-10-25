const BASE = import.meta.env.VITE_API_BASE_URL as string;

/**
 * 文字列で与えられた数式の中の演算子をunicodeに書き換える\
 * "*"→"×", "/"→"÷" に変換する
 * @param formula 数式の文字列
 * @returns 変換後の数式お文字列
 */
function normalizeFormula(formula: string) {
  return formula.replaceAll("*","×").replaceAll("/","÷");
}

export async function evaluateFormula(formula: string) {
  if (!BASE) throw new Error("VITE_API_BASE_URLが定義されていません。");
  const res = await fetch(`${BASE}/calc`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ formula: normalizeFormula(formula) }),
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  // 正しくJSONをパースして返す
  return (await res.json()) as {
    result?: number;
    received?: string;
    error?: string;
  };
}
