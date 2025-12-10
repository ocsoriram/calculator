import { HistoryList, type HistoryItem } from "@/components/HistoryList";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const sampleItems: HistoryItem[] = [
  {
    id: "1",
    expression: "1+2",
    result: "3",
    at: 1111111111111,
  },
  {
    id: "2",
    expression: "10/2",
    result: "5",
    at: 2222222222222,
  },
];

describe("HistoryList コンポーネント", () => {
  it("見出しとクリアボタンが表示される。", () => {
    render(
      <HistoryList
        items={sampleItems}
        onUse={vi.fn()}
        onClearAll={vi.fn()}
        onClear={vi.fn()}
      />
    );
    // "計算履歴"が表示されていることを確認
    expect(
      screen.getByRole("heading", { name: "計算履歴" })
    ).toBeInTheDocument();
    // "クリア"ボタンが表示されていることを確認
    expect(screen.getByRole("button", { name: "クリア" })).toBeInTheDocument();
  });

  it("渡された履歴がexpression / resultとして表示される", () => {
    render(
      <HistoryList
        items={sampleItems}
        onUse={vi.fn()}
        onClearAll={vi.fn()}
        onClear={vi.fn()}
      />
    );
    // 1件目の表示を確認
    expect(screen.getByText("1+2")).toBeInTheDocument();
    expect(screen.getByText("= 3")).toBeInTheDocument();
    // 2件目の表示を確認
    expect(screen.getByText("10/2")).toBeInTheDocument();
    expect(screen.getByText("= 5")).toBeInTheDocument();
  });

  it("履歴の行をクリックすると、onUseが呼ばれる", () => {
    const handleUse = vi.fn();
    render(
      <HistoryList
        items={sampleItems}
        onUse={handleUse}
        onClearAll={vi.fn()}
        onClear={vi.fn()}
      />
    );
    // 10/2の行のボタンを取得
    const secondHistoryButton = screen.getByRole("button", {
      name: /10\/2/,
    });
    // 履歴ボタンをクリック
    fireEvent.click(secondHistoryButton);

    // onUseが"10/2"という式で1回呼ばれていることを確認
    expect(handleUse).toHaveBeenCalledTimes(1);
    expect(handleUse).toHaveBeenCalledWith(sampleItems[1].expression);
  });

  it("クリアボタンをクリックすると、onClearが呼ばれる", () => {
    const handleClearAll = vi.fn();
    render(
      <HistoryList
        items={sampleItems}
        onUse={vi.fn()}
        onClearAll={handleClearAll}
        onClear={vi.fn()}
      />
    );
    // クリアボタンを取得する
    const clearAllButton = screen.getByRole("button", {
      name: "クリア",
    });

    // クリアボタンをクリックする
    fireEvent.click(clearAllButton);

    // onClearが1回呼ばれていることを確認
    expect(handleClearAll).toHaveBeenCalledTimes(1);
  });
});
