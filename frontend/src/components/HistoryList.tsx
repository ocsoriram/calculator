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
  onClearAll: () => void;
  onClear: (id: string) => void;
};

export const HistoryList = memo(function HistoryList({
  items,
  onUse,
  onClearAll,
  onClear,
}: Props) {
  return (
    <aside className="history pt-6">
      <div className="history-header flex justify-end items-center">
        <h3 className="text-base sm:text-3xl sm:me-4 flex-auto">計算履歴</h3>
        <button className="ms-2 bg-sky-600" onClick={onClearAll}>
          クリア
        </button>
      </div>
      <ul>
        {items.map((it) => (
          <li className="pt-2 flex justify-end" key={it.id}>
            <button
              className="flex-auto border border-red-500"
              onClick={() => onUse(it.expression)}
            >
              <span className="hist-expr">{it.expression}</span>
              <span className="hist-res"> = {it.result}</span>
            </button>
            <button
              className="bg-red-500 font-medium"
              onClick={() => {
                onClear(it.id);
              }}
            >
              削除
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
});
