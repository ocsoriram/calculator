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
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // 履歴を復元する AI実装コピペ 動いてないイメージ
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

  /**
   * キーボードがクリックされたときの挙動を定義する関数
   * @param key 押されたキーボードの値
   * @returns
   */
  function handlePress(key: string) {
    setErrorMsg(null);
    const newExpression = expression + key;
    switch (key) {
      case "AC":
        setExpression("");
        setResult(null);
        return;
      case "DEL":
        setExpression((prev) => prev.slice(0, -1));
        checkExpression(expression);
        return;
      case "=":
        return evaluate();

      default:
        setExpression(newExpression);
        checkExpression(newExpression);
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
    setErrorMsg(null);

    let value: string = "";
    const FAILED_MESSAGE = "計算結果を取得できませんでした。";

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
        setErrorMsg(FAILED_MESSAGE);
      } else {
        setErrorMsg("計算に失敗しました。");
      }
    } finally {
      setIsCalculating(false);
    }
  }

  /**
   * 式の()の数の一致の真偽値を返す関数
   * @param expression
   * @returns boolean
   */
  function hasParenError(expression: string): boolean {
    let isParenError: boolean = false;
    const leftParenthesisTotal: number = expression.match(/\(/g)?.length ?? 0;
    const rightParenthesisTotal: number = expression.match(/\)/g)?.length ?? 0;

    if (leftParenthesisTotal !== rightParenthesisTotal) {
      isParenError = true;
    }
    return isParenError;
  }

  /**
   * 式の最初の文字の正当性の真偽値を返す関数
   * @param expression
   * @returns boolean
   */
  function hasStartError(expression: string): boolean {
    let isStartError = false;
    const first = expression[0];
    const notAllowed = ["×", "÷", "*", "/"];
    if (notAllowed.includes(first)) {
      isStartError = true;
    }
    return isStartError;
  }

  function hasCharError(expression: string): boolean {
    let hasCharError = false;
    const alphabetRegex = /[a-zA-Z]/;
    const japaneseRegex = /[\u3040-\u30FF\u4E00-\u9FFF\u3400-\u4DBF]/;

    if (alphabetRegex.test(expression) || japaneseRegex.test(expression)) {
      hasCharError = true;
    }
    return hasCharError;
  }

  const hasBlankError = (expression: string) => {
    let hasBlankError = false;
    const spaceRegex = /(.*)\s(.*)/;

    if (spaceRegex.test(expression)) {
      hasBlankError = true;
    }
    return hasBlankError;
  };

  /**
   * 式全体の正当性を検証するファサード関数
   * @param expression 式を表現するstring
   */
  function checkExpression(expression: string) {
    const errors: string[] = [];
    if (hasParenError(expression)) {
      errors.push("()の数が一致しません。");
    }
    if (hasStartError(expression)) {
      errors.push(`式の最初に${expression[0]}は使えません。`);
    }
    if (hasCharError(expression)) {
      errors.push("日本語や英文字は使えません。");
    }
    if (hasBlankError(expression)) {
      errors.push("式の途中にスペースを含めることはできません。");
    }

    setIsError(errors.length > 0);
    setErrorMsg(errors[0] ?? null);
  }

  // 物理キーボード対応（任意）AI実装コピペ
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter") return evaluate();
      if (e.key === "Backspace") return handlePress("DEL");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expression]);

  return (
    <>
      <div className="main-container">
        <div className="calculator-container">
          <Display
            expression={expression}
            prevExpression={prevExpression}
            result={result}
            onChange={(v: string) => {
              // ユーザーが input に文字を打ったときに呼ばれる
              // 1) state を更新する
              setExpression(v);
              // 2) 更新後の文字列 v に対して即時に妥当性チェックを行う
              checkExpression(v);
            }}
          />
          <div className="h-6">
            {errorMsg && (
              <div className="errorMsg text-red-500">{errorMsg}</div>
            )}
          </div>
          <Keypad
            onPress={handlePress}
            disabled={isCalculating}
            isError={isError}
          />
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
