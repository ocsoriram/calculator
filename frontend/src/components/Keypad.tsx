
type ButtonConfig = {
  label: string,
  type: 'btnNum' | 'btnOperator' | 'btnFunc' | 'btnOther' | 'btnEqual'
}

const buttonConfigs: ButtonConfig[] = [
  {label: "(", type: "btnFunc"},
  {label: ")", type: "btnFunc"},
  {label: "DEL", type: "btnFunc"},
  {label: "AC", type: "btnFunc"},

  {label: "7", type: "btnNum"},
  {label: "8", type: "btnNum"},
  {label: "9", type: "btnNum"},
  {label: "÷", type: "btnOperator"},

  {label: "4", type: "btnNum"},
  {label: "5", type: "btnNum"},
  {label: "6", type: "btnNum"},
  {label: "×", type: "btnOperator"},

  {label: "1", type: "btnNum"},
  {label: "2", type: "btnNum"},
  {label: "3", type: "btnNum"},
  {label: "-", type: "btnOperator"},

  {label: "0", type: "btnNum"},
  {label: ".", type: "btnOther"},
  {label: "=", type: "btnEqual"},
  {label: "+", type: "btnOperator"},
];

type Props = {onPress: (key: string) => void;
              disabled?: boolean,
              isError?: boolean
            };

export function Keypad({onPress, disabled, isError}: Props) {
  return (
    <div className="keypad">
      {buttonConfigs.map((btn) => (
        <button className={btn.type} key={btn.label} onClick={() => onPress(btn.label)} disabled={(btn.type === "btnEqual" && isError) || disabled} aria-label={btn.label}>
          {btn.label}
        </button>
       ))}
    </div>
  )
}
