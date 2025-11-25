import { Keypad } from "@/components/Keypad";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

describe("Keypad コンポーネント", () => {
  it("数字キーが表示される", () => {
    render(<Keypad onPress={vi.fn()} disabled={false} isError={false} />);

    const btnOne = screen.getByRole("button", { name: "1" });

    expect(btnOne).toBeInTheDocument();
  });

  it("ボタンをクリックすると、onPressが呼ばれる", () => {
    // Arrange
    const handlePress = vi.fn();
    render(<Keypad onPress={handlePress} disabled={false} isError={false} />);
    // Act
    const btnTwo = screen.getByRole("button", { name: "2" });
    fireEvent.click(btnTwo);
    // Assert
    expect(handlePress).toHaveBeenCalledTimes(1);
  });

  it("disabledの時にボタンが押せないこと", () => {
    // Arrange
    render(<Keypad onPress={vi.fn()} disabled={true} isError={false} />);
    // Act
    const btnEqual = screen.getByRole("button", { name: "=" });
    // Assert
    expect(btnEqual).toBeDisabled();
  });

  it("押したボタンのラベルがonPressに渡される", () => {
    // Arrange
    const handlePress = vi.fn();
    render(<Keypad onPress={handlePress} disabled={false} isError={false} />);
    // Act
    const btnTwo = screen.getByRole("button", { name: "2" });
    fireEvent.click(btnTwo);
    // Assert
    expect(handlePress).toHaveBeenCalledWith("2");
  });
});
