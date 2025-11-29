import { describe, it, expect } from "vitest";
import { Evaluator } from "../src/Evaluator";
import { Operation } from "../src/Enums/Operation";

describe("Evaluator.compute", ()=>{
    const evaluator = new Evaluator();

    // 足し算テスト
    it("加算が正しく計算される", ()=>{
        expect(evaluator.compute(1, Operation.add, 2)).toBe(3);
    });
    // 引き算テスト
    it("減算が正しく計算される", () =>{
        expect(evaluator.compute(4, Operation.subtract, 3)).toBe(1);
    });
    // 掛け算テスト
    it("乗算が正しく計算される", () =>{
        expect(evaluator.compute(5,Operation.multiply,6)).toBe(30);
    });
    // 割り算テスト:正常
    it("除算が正しく計算される", ()=>{
        expect(evaluator.compute(8,Operation.divide,2)).toBe(4);
    });
        // 割り算テスト:異常
    it("0で割った場合にエラーを投げる", () =>{
        expect(() => evaluator.compute(10, Operation.divide, 0)).toThrowError("０除算は不可");
    });
})