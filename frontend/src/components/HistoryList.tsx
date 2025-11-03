export type HistoryItem  = {
  id: string;
  expression: string;
  result: string;
  at: number;
};

type Props = {
  items: HistoryItem[];
  onUse: (expression: string)=> void;
  onClear: ()=> void
}

export function HistoryList({items, onUse, onClear}:Props) {
  return (
    <aside className="history">
      <div className="history-header flex pt-2">
        <h3 className="text-4xl">計算履歴</h3>
        <button className="ms-2" onClick={onClear}>クリア</button>
      </div>
      <ul>
        {items.map((it) => (
          <li className="pt-2" key={it.id}>
            <button className="w-full" onClick={() => onUse(it.expression)}>
              <span className="hist-expr">{it.expression}</span>
              {/* TODO =の前に空白を表示する */}
              {/* <span className="hist-expr">{it.expression.replace("=", "")} =</span> */}
              <span className="hist-res">= {it.result}</span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
