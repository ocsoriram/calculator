
const keys = [
  "7","8","9","DEL",
  "4","5","6","×",
  "1","2","3","÷",
  "0",".","+","-",
  "(",")","AC","=",
];

type Props = {onPress: (key: string) => void; disabled?: boolean };

export function Keypad({onPress, disabled}: Props) {
  return (
    <div className="keypad grid grid-cols-4 gap-2 p-2">
      {keys.map((k) => (
        <button key={k} onClick={() => onPress(k)} disabled={disabled} aria-label={k}>
          {k}
        </button>
       ))}
    </div>
  )
}
