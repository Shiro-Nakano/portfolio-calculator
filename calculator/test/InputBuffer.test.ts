import { describe, it, expect, beforeEach } from "vitest";
import { InputBuffer } from "../src/InputBuffer";
import { Config } from "../src/Config";

// Config.MAX_DIGITS が必ず存在する前提
Config.MAX_DIGITS;

describe("InputBuffer", () => {
  let buffer: InputBuffer;

  beforeEach(() => {
    buffer = new InputBuffer();
  });

  // ------------------------------
  // 初期状態
  // ------------------------------
  it("初期値は '0' である", () => {
    expect(buffer.toString()).toBe("0");
    expect(buffer.isEmpty()).toBe(true);
  });

  // ------------------------------
  // setNegative()
  // ------------------------------
  it("setNegative(): 初期状態 '0' のとき '-' に変わる", () => {
    buffer.setNegative();
    expect(buffer.toString()).toBe("-");
  });

  it("setNegative(): 既に '0' 以外の値の場合は変更されない", () => {
    buffer.pushDigit(1);
    buffer.setNegative();
    expect(buffer.toString()).toBe("1"); // 変わらない
  });

  // ------------------------------
  // pushDigit()
  // ------------------------------
  it("pushDigit(): 0〜9 以外は無視する", () => {
    buffer.pushDigit(10);
    buffer.pushDigit(-1);
    expect(buffer.toString()).toBe("0");
  });

  it("pushDigit(): 初期状態で 0 を押しても変わらない", () => {
    buffer.pushDigit(0);
    expect(buffer.toString()).toBe("0");
  });

  it("pushDigit(): 初期状態で 5 を押したら '5' に変わる", () => {
    buffer.pushDigit(5);
    expect(buffer.toString()).toBe("5");
  });

  it("pushDigit(): 連続入力で '123' になる", () => {
    buffer.pushDigit(1);
    buffer.pushDigit(2);
    buffer.pushDigit(3);
    expect(buffer.toString()).toBe("123");
  });

  it("pushDigit(): 最大桁数を超える入力は無視される", () => {
    for (let i = 1; i <= 8; i++) {
      buffer.pushDigit(1);
    }
    buffer.pushDigit(9); // 無視される
    expect(buffer.toString()).toBe("11111111");
  });

  // ------------------------------
  // pushDecimal()
  // ------------------------------
  it("pushDecimal(): 初回小数点は '0.' になる", () => {
    buffer.pushDecimal();
    expect(buffer.toString()).toBe("0.");
  });

  it("pushDecimal(): 通常の数字のあとに '.' がつく", () => {
    buffer.pushDigit(1);
    buffer.pushDecimal();
    expect(buffer.toString()).toBe("1.");
  });

  it("pushDecimal(): 2回目以降は無視される", () => {
    buffer.pushDigit(1);
    buffer.pushDecimal();
    buffer.pushDecimal();
    expect(buffer.toString()).toBe("1.");
  });

  // ------------------------------
  // clear()
  // ------------------------------
  it("clear(): 値が '0' に戻る", () => {
    buffer.pushDigit(3);
    buffer.pushDigit(4);
    buffer.clear();
    expect(buffer.toString()).toBe("0");
  });

  // ------------------------------
  // toNumber()
  // ------------------------------
  it("toNumber(): '123' → 123 の number を返す", () => {
    buffer.pushDigit(1);
    buffer.pushDigit(2);
    buffer.pushDigit(3);
    expect(buffer.toNumber()).toBe(123);
  });

  it("pushDecimal の結果 '0.' のとき toNumber() は 0 を返す", () => {
    const buffer = new InputBuffer();
    buffer.pushDecimal();             // "0."
    expect(buffer.toNumber()).toBe(0);
  });

  it("toNumber(): '-' は数値に変換すると NaN になる（仕様通り Number('-')）", () => {
    buffer.setNegative();
    expect(Number("-")).toBeNaN();
    expect(buffer.toNumber()).toBeNaN();
  });

  // ------------------------------
  // isEmpty()
  // ------------------------------
  it("isEmpty(): '0' または '' のとき true", () => {
    expect(buffer.isEmpty()).toBe(true);
    buffer.clear();
    expect(buffer.isEmpty()).toBe(true);
  });

  it("isEmpty(): 数字があると false", () => {
    buffer.pushDigit(5);
    expect(buffer.isEmpty()).toBe(false);
  });

  // ------------------------------
  // digitCount()
  // ------------------------------
  it("digitCount(): 小数点を除いた桁数を返す", () => {
    buffer.pushDigit(1);
    buffer.pushDigit(2);
    buffer.pushDecimal();
    buffer.pushDigit(3);
    expect(buffer.digitCount()).toBe(3); // "12.3" → 3
  });

  it("digitCount(): '-' は桁数に含まれない", () => {
    buffer.setNegative();
    buffer.pushDigit(9);
    buffer.pushDigit(8);
    expect(buffer.digitCount()).toBe(2); // "-98" → 2
  });
});