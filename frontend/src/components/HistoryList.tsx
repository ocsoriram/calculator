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
      <div className="header">
        <h3>履歴</h3>
        <button onClick={onClear}>クリア</button>
      </div>
      <ul>
        {items.map((it) => (
          <li key={it.id}>
            <button onClick={() => onUse(it.expression)}>
              <span className="hist-expr">{it.expression}</span>
              <span className="hist-res">= {it.result}</span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
