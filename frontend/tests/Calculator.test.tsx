import * as api from "@/api";
import Calculator from "@/Calculator";
import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

describe("Calculatorコンポーネント", () => {
  // テストごとにクリーンアップ処理を行う
  afterEach(async () => {
    await vi.resetAllMocks();
    await localStorage.clear();
  });

  it("1+2= でAPIを呼び出して、結果と履歴を表示する", async () => {
    // Arrange
    // evaluateFormulaをモックして、常にresult: 3 を返すようにする
    const evaluateFormulaSpy = vi
      .spyOn(api, "evaluateFormula")
      .mockResolvedValue({ result: 3 });

    render(<Calculator />);

    // Act キーパッドから1+2=を入力する
    fireEvent.click(screen.getByRole("button", { name: "1" }));
    fireEvent.click(screen.getByRole("button", { name: "+" }));
    fireEvent.click(screen.getByRole("button", { name: "2" }));
    fireEvent.click(screen.getByRole("button", { name: "=" }));

    // Assert
    // APIが正しい式で呼ばれていることを確認する
    expect(evaluateFormulaSpy).toHaveBeenCalledWith("1+2");

    // 計算機がディスプレイに表示されることを確認する
    expect(await screen.findByText("1+2 = 3")).toBeVisible();

    // 履歴に式と結果が表示されていることを確認する
    expect(screen.getByText("1+2")).toBeVisible();
    expect(screen.getByText("= 3")).toBeVisible();
  });

  it("式の最初に使えない演算子を入力するとエラーを表示する", () => {
    render(<Calculator />);
    // Display の input は aria-label="式" が付いている
    const input = screen.getByLabelText("式");
    // 先頭に × を入力（hasStartError が true になるパターン）
    fireEvent.change(input, { target: { value: "×1" } });
    // エラーメッセージが表示されること
    expect(screen.getByText("式の最初に×は使えません。")).toBeVisible();
  });

  it("エラー発生時に=ボタンが押せなくなる", () => {
    // Arrange
    render(<Calculator />);
    // Act 先頭に日本語を入れて hasCharErrorを発生させる
    const input = screen.getByLabelText("式");
    fireEvent.change(input, { target: { value: "あ" } });
    // Assert
    const equalButton = screen.getByRole("button", { name: "=" });
    expect(equalButton).toBeDisabled();
  });

  it("APIエラー時にメッセージが表示されること", async () => {
    // Arrange
    vi.spyOn(api, "evaluateFormula").mockRejectedValue(
      new Error("サーバーエラー")
    );
    render(<Calculator />);
    // Act 便宜的にテキトーなボタンを押下する
    fireEvent.click(screen.getByRole("button", { name: "1" }));
    fireEvent.click(screen.getByRole("button", { name: "+" }));
    fireEvent.click(screen.getByRole("button", { name: "2" }));
    fireEvent.click(screen.getByRole("button", { name: "=" }));
    // Assert
    expect(
      await screen.findByText("計算結果を取得できませんでした。")
    ).toBeVisible();
  });
});
