type Props = {
  expression: string,
  result: string | null,  // TODO なぜ string | nullなのか
  onChange: (V: string) => void;
}


export function Display({expression, result, onChange}:Props) {
  return (
    <div className="display">
      <input
        className="expr"
        value={expression}
        onChange={(e) => onChange(e.target.value)}
        placeholder="0"
        inputMode="decimal"
        aria-label="式"
      />
      <div className="res" aria-live="polite">{result ?? ""} </div>
    </div>
  );
}
