import { memo } from "react";

export type HistoryItem = {
  id: string;
  expression: string;
  result: string;
  at: number;
};

type Props = {
  items: HistoryItem[];
  onUse: (expression: string) => void;
  onClear: () => void;
};

export const HistoryList = memo(function HistoryList({
  items,
  onUse,
  onClear,
}: Props) {
  return (
    <aside className="history p-3 pt-6">
      <div className="history-header flex justify-center items-center">
        <h3 className="text-base sm:text-3xl sm:me-4">計算履歴</h3>
        <button className="ms-2 bg-sky-600" onClick={onClear}>
          クリア
        </button>
      </div>
      <ul>
        {items.map((it) => (
          <li className="pt-2" key={it.id}>
            <button className="w-full" onClick={() => onUse(it.expression)}>
              <span className="hist-expr">{it.expression}</span>
              <span className="hist-res">= {it.result}</span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
});
