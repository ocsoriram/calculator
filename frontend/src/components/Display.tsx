type Props = {
  expression: string;
  prevExpression: string;
  result: string | null; // TODO なぜ string | nullなのか
  onChange: (V: string) => void;
};

/**
 * 計算結果を含む式を返す関数
 * @param expression
 * @param result
 * @returns 例 4+5=9 のような文字列。計算結果が取得できない場合は式を表示させない
 */
function showFormula(expression: string, result: string | null): string | null {
  if (result == null) return null;

  if (expression) {
    return `${expression} = ${result ?? ""}`;
  } else {
    return "";
  }
}

export function Display({
  expression,
  prevExpression,
  result,
  onChange,
}: Props) {
  return (
    <div className="display flex flex-col items-end bg-gray-800 rounded-4xl p-4 shadow-lg h-22">
      <input
        className="expr w-full text-right text-2xl text-white bg-transparent border-none focus:outline-none placeholder-gray-500"
        value={expression}
        onChange={(e) => onChange(e.target.value)}
        placeholder={result ?? "0"}
        inputMode="decimal"
        aria-label="式"
      />
      <div className="res" aria-live="polite">
        {showFormula(prevExpression, result)}
      </div>
    </div>
  );
}
