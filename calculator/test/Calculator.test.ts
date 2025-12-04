import { describe, it, expect, vi, beforeEach } from "vitest";
import { Calculator } from "../src/Calculator";
import { CalcState } from "../src/Enums/CalcState";
import { Operation } from "../src/Enums/Operation";
import { IDisplay } from "../src/Display/IDisplay";

/** IDisplay のモック */
function createDisplayMock():IDisplay {
    return {
        render: vi.fn(),
        renderError: vi.fn(),
        renderHistory: vi.fn(),
        clearHistory: vi.fn(),
    };
}

describe("Calculator", () => {
    let displayMock: ReturnType<typeof createDisplayMock>;
    let calc: Calculator;

    beforeEach(() => {
        displayMock = createDisplayMock();
        calc = new Calculator(displayMock);
    });

    // ------------------------------------
    // 初期状態
    // ------------------------------------
    it("初期表示は '0' である", () => {
        expect(displayMock.render).toHaveBeenCalledWith("0");
    });

    // ------------------------------------
    // 数字入力
    // ------------------------------------
    it("数字を入力すると表示が更新される", () => {
        calc.handle("1");
        expect(displayMock.render).toHaveBeenLastCalledWith("1");

        calc.handle("2");
        expect(displayMock.render).toHaveBeenLastCalledWith("12");
    });

    it("ResultShown のあと数字を押すと新規入力になる", () => {
        calc["state"] = CalcState.ResultShown;
        calc.handle("5");
        expect(displayMock.render).toHaveBeenLastCalledWith("5");
    });

    // ------------------------------------
    // 小数点
    // ------------------------------------
    it("小数点を入力できる", () => {
        calc.handle("1");
        calc.handle(".");
        calc.handle("5");

        expect(displayMock.render).toHaveBeenLastCalledWith("1.5");
    });

    it("小数点の連続入力は無視される", () => {
        calc.handle("1");
        calc.handle(".");
        calc.handle(".");
        expect(displayMock.render).toHaveBeenLastCalledWith("1.");
    });

    // ------------------------------------
    // 演算子
    // ------------------------------------
    it("1 + を押すと left=1 演算子=+ になる", () => {
        calc.handle("1");
        calc.handle("+");

        expect(calc["left"]).toBe(1);
        expect(calc["operatorType"]).toBe(Operation.add);
        expect(displayMock.renderHistory).toHaveBeenLastCalledWith(`1 ${Operation.add}`);
    });

    it("演算子連打時は演算子だけ切り替える", () => {
        calc.handle("1");
        calc.handle("+");
        calc.handle("x");

        expect(calc["operatorType"]).toBe(Operation.multiply);
        expect(displayMock.renderHistory).toHaveBeenLastCalledWith(`1 ${Operation.multiply}`);
    });

    // ------------------------------------
    // 計算（＝）
    // ------------------------------------
    it("1 + 2 = は 3 を表示する", () => {
        calc.handle("1");
        calc.handle("+");
        calc.handle("2");
        calc.handle("=");

        expect(displayMock.render).toHaveBeenLastCalledWith("3");
        expect(displayMock.renderHistory).toHaveBeenLastCalledWith("1+2=");
    });

    it("結果表示後に演算子を押すと連続計算可能", () => {
        calc.handle("5");
        calc.handle("+");
        calc.handle("5");
        calc.handle("=");
        calc.handle("x");
        calc.handle("2");
        calc.handle("=");

        expect(displayMock.render).toHaveBeenLastCalledWith("20");
        expect(displayMock.renderHistory).toHaveBeenLastCalledWith("10x2=");
    });

    // ------------------------------------
    // エラー（0 除算）
    // ------------------------------------
    it("5 ÷ 0 = でエラー表示になる", () => {
        calc.handle("5");
        calc.handle("÷");
        calc.handle("0");
        calc.handle("=");

        expect(displayMock.render).toHaveBeenLastCalledWith("エラー");
        expect(calc["state"]).toBe(CalcState.Error);
    });

    it("Error 状態で数字入力すると復帰する", () => {
        calc["state"] = CalcState.Error;
        calc.handle("3");

        expect(calc["state"]).toBe(CalcState.InputtingFirst);
        expect(displayMock.render).toHaveBeenLastCalledWith("3");
    });

    // ------------------------------------
    // クリア
    // ------------------------------------
    it("C を押すと初期状態に戻る", () => {
        calc.handle("9");
        calc.handle("C");

        expect(displayMock.render).toHaveBeenLastCalledWith("0");
        expect(displayMock.clearHistory).toHaveBeenCalled();
        expect(calc["state"]).toBe(CalcState.ready);
        expect(calc["left"]).toBe(null);
        expect(calc["operatorType"]).toBe(null);
    });
});