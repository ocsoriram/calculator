type Props = {
  expression: string,
  result: string | null,  // TODO なぜ string | nullなのか
  onChange: (V: string) => void;
}


export function Display({expression, result, onChange}:Props) {
  return (
    <div className="display flex flex-col items-end bg-gray-800 rounded-4xl p-4 shadow-lg">
      <input
        className="expr w-full text-right text-2xl text-white bg-transparent border-none focus:outline-none placeholder-gray-500"
        value={expression}
        onChange={(e) => onChange(e.target.value)}
        placeholder="0"
        inputMode="decimal"
        aria-label="式"
      />
      <div className="res" aria-live="polite">
        {result ?? ""}{" "}
      </div>
    </div>
  );
}
