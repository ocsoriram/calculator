// Display.test.tsx
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Display } from "./Display";

describe("Display コンポーネント", () => {
  it("初期描画時に式と結果が表示される", () => {
    render(<Display expression="1+2" result="3" onChange={() => {}} />);

    // 入力欄に初期値がセットされていること
    const input = screen.getByLabelText("式");
    expect(input).toHaveValue("1+2");

    // 結果が表示されていること
    const result = screen.getByText("3");
    expect(result).toBeInTheDocument();
  });

  it("入力欄の値を変更すると onChange が呼ばれる", () => {
    const handleChange = vi.fn(); // モック関数
    render(<Display expression="" result={null} onChange={handleChange} />);

    const input = screen.getByLabelText("式");
    fireEvent.change(input, { target: { value: "123" } });

    expect(handleChange).toHaveBeenCalledWith("123");
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("result が null の場合は空文字が表示される", () => {
    render(<Display expression="1+2" result={null} onChange={() => {}} />);

    const result = screen.getByText(""); // 空文字でもDOMは存在
    expect(result).toBeInTheDocument();
  });
});
