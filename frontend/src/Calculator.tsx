import { useEffect, useState } from "react";
import { evaluateFormula } from "./api";
import { Display } from "./components/Display";
import { HistoryList, type HistoryItem } from "./components/HistoryList";
import { Keypad } from "./components/Keypad";

const STORAGE_KEY = "calc_history_v1";

function formatResult(n: number, maxDigits = 12) {
  // 簡易的な丸め：有効桁数ベース
  const str = Number(n).toPrecision(maxDigits);
  // 末尾の不要な0と小数点を除去
  return str
    .replace(/(?:\\.\\d*?[1-9])0+$/, "$1")
    .replace(/\\.0+$/, "")
    .replace(/\\.$/, "");
}

export default function Calculator() {
  const [expression, setExpression] = useState<string>("");
  const [result, setResult] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // 履歴の復元 AI実装コピペ
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setHistory(JSON.parse(raw));
    } catch {}
  }, []);
  // 履歴の保存
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  /**
   * キーボードがクリックされたときの挙動を定義する関数
   * @param key 押されたキーボードの値
   * @returns
   */
  function handlePress(key: string) {
    setError(null);
    switch (key) {
      case "AC":
        setExpression("");
        setResult(null);
        return;
      case "DEL":
        setExpression((prev) => prev.slice(0, -1));
        return;
      case "=":
        return evaluate();
      default:
        setExpression((prev) => prev + key);
    }
  }

  /**
   *
   * @returns
   */
  async function evaluate() {
    // 両端の余計な空白を削除する
    const formula = expression.trim();
    if (!formula) return;
    setIsCalculating(true);
    setError(null);

    try {
      const json = await evaluateFormula(formula);
      const value: string =
        typeof json.result === "number"
          ? formatResult(json.result)
          : String(json.received ?? "");
      setResult(value);
      const item: HistoryItem = {
        id: crypto.randomUUID(),
        expression: formula,
        result: value,
        at: Date.now(),
      };
      // 最新の計算式の履歴を先頭に追加、かつ履歴を100件までにする
      setHistory((h) => [item, ...h].slice(0, 100));
    } catch (e: any) {
      setError(e?.message ?? "計算に失敗しました。");
    } finally {
      setIsCalculating(false);
    }
  }

  // 物理キーボード対応（任意）AI実装コピペ
  // useEffect(() => {
  //   const onKey = (e: KeyboardEvent) => {
  //     if (e.key === "Enter") return evaluate();
  //     if (e.key === "Backspace") return handlePress("DEL");
  //     if (/^[0-9.+\\-*/()]$/.test(e.key)) {
  //       const map: Record<string, string> = { "*": "×", "/": "÷" };
  //       return handlePress(map[e.key] ?? e.key);
  //     }
  //   };
  //   window.addEventListener("keydown", onKey);
  //   return () => window.removeEventListener("keydown", onKey);
  // }, [expression]);

  return (
    <>
      <h1>this is calculator component</h1>
      <Display
        expression={expression}
        result={result}
        onChange={setExpression}
      />
      {error && <div className="error">{error}</div>}
      <Keypad onPress={handlePress} disabled={isCalculating} />
      <HistoryList
        items={history}
        onUse={setExpression}
        onClear={() => setHistory([])}
      />
    </>
  );
}
