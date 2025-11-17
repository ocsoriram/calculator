// Display.test.tsx
import { Display } from "@/components/Display";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

describe("Display コンポーネント", () => {
  it("入力には expression、placeholder には result が入る", () => {
    render(
      <Display
        expression="1+2"
        prevExpression="1+2"
        result="3"
        onChange={() => {}}
      />
    );

    // 入力欄に初期値がセットされていること
    const input = screen.getByLabelText("式");
    expect(input).toHaveValue("1+2");
    expect(input).toHaveAttribute("placeholder", "3");
  });

  it("prevExpression と result から '式 = 結果' を表示する", () => {
    // const handleChange = vi.fn(); // モック関数
    render(
      <Display
        expression="4-1"
        prevExpression="4-1"
        result="3"
        onChange={() => {}}
      />
    );

    // 実際にテキストとしてDOMに現れる値を検証する
    expect(screen.getByText("4-1 = 3")).toBeInTheDocument();
  });

  it("result が null の場合はresには何も表示されず、placeholderは0", () => {
    const { container } = render(
      <Display
        expression=""
        prevExpression=""
        result={null}
        onChange={() => {}}
      />
    );
    const input = screen.getByLabelText("式"); // 空文字でもDOMは存在
    expect(input).toHaveValue("");
    expect(input).toHaveAttribute("placeholder", "0");

    // res要素は空(テキストなし)
    const res = container.querySelector(".res");
    expect(res?.textContent).toBe("");
    // " = "を「含む文字列が存在しないことを確認
    expect(screen.queryByText(/ = /)).not.toBeInTheDocument();
  });

  it("入力を変更すると、onChangeが一回、変更後の型で呼ばれる", () => {
    const handleChange = vi.fn();
    render(
      <Display
        expression="2*5"
        prevExpression=""
        result="2*5"
        onChange={handleChange}
      />
    );

    const input = screen.getByLabelText("式");
    fireEvent.change(input, { target: { value: "123" } });

    expect(handleChange).toHaveBeenCalledWith("123");
    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});
