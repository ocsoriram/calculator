import { useEffect, useState } from "react";
import { evaluateFormula } from "./api";
import { Display } from "./components/Display";
import { HistoryList, type HistoryItem } from "./components/HistoryList";
import { Keypad } from "./components/Keypad";

const STORAGE_KEY = "calc_history_v1";

/**
 * 引数で与えられたintの桁数を丸める関数
 * @param n
 * @param maxDigits
 * @returns
 */
function formatResult(n: number, maxDigits = 12) {
  // 簡易的な丸め：有効桁数ベース
  const str = Number(n).toPrecision(maxDigits);
  // 末尾の不要な0と小数点を除去
  // return str
  //   .replace(/(?:\\.\\d*?[1-9])0+$/, "$1") // 小数点以下の不要な末尾の0を削除する
  //   .replace(/\\.0+$/, "")                 //
  //   .replace(/\\.$/, "");
  return str
    .replace(/(\.\d*?[1-9])0+$/, "$1") // 小数末尾の0削除
    .replace(/\.0+$/, "") // .000 → ""
    .replace(/\.$/, ""); // . → ""
}

export default function Calculator() {
  const [expression, setExpression] = useState<string>("");
  const [prevExpression, setPrevExpression] = useState<string>("");
  const [result, setResult] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // 履歴の復元 AI実装コピペ 動いてないイメージ
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setHistory(JSON.parse(raw));
    } catch (e) {
      console.error("Failed to parse history from localStorage:", e);
    }
  }, []);
  // 履歴の保存
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  useEffect(() => {}, []);

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
        if (isFormulaCorrect(expression)) {
          return evaluate();
        } else {
          setError("()の数が一致しません。");
          return ;
        }
      default:
        setExpression((prev) => prev + key);
    }
  }

  /**
   * "="が押された時に発火する関数。/
   * 文字列の計算式をバックエンドにfetchして計算結果を取得する
   * @returns
   */
  async function evaluate() {
    // 両端の余計な空白を削除する
    const formula = expression.trim();
    if (!formula) return;
    setIsCalculating(true);
    setError(null);

    let value:string = "";
    const FAILED_MESSAGE = "計算結果を取得できませんでした。"

    try {
      const json = await evaluateFormula(formula);
       value =
        typeof json.result === "number"
          ? formatResult(json.result)
          : FAILED_MESSAGE;
      setResult(value);
      const item: HistoryItem = {
        id: crypto.randomUUID(),
        expression: formula,
        result: value,
        at: Date.now(),
      };
      // 最新の計算式の履歴を先頭に追加、かつ履歴を100件までにする
      setHistory((h) => [item, ...h].slice(0, 100));
      setPrevExpression(expression);
      setExpression(value);

    } catch (e: unknown) {

      if (e instanceof Error) {
        console.error(e.message);
        setError(FAILED_MESSAGE);

      } else {
        setError("計算に失敗しました。");
      }

    } finally {
      setIsCalculating(false);
    }
  }

  function isFormulaCorrect(formula:string): boolean {
    let isFormulaCorrect: boolean = false;
    const leftParenthesisTotal:number = formula.match(/\(/g)?.length ?? 0;
    const rightParenthesisTotal:number = formula.match(/\)/g)?.length ?? 0;

    if (leftParenthesisTotal === rightParenthesisTotal) {
      isFormulaCorrect = true;
    }

    return isFormulaCorrect
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
      <div className="main-container">
        <div className="calculator-container">
          <Display
            expression={expression}
            prevExpression={prevExpression}
            result={result}
            onChange={setExpression}
          />
          {error && <div className="error text-red-500">{error}</div>}
          <Keypad onPress={handlePress} disabled={isCalculating} />
        </div>
        <div className="history-container ">
          <HistoryList
            items={history}
            onUse={setExpression}
            onClear={() => setHistory([])}
          />
        </div>
      </div>
    </>
  );
}
