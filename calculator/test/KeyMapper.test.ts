import { describe, it, expect } from "vitest";
import { KeyMapper } from "../src/KeyMapper";

function createButton(label: string): HTMLElement {
    const btn = document.createElement("button");
    btn.textContent = label;
    return btn;
}

describe("KeyMapper.resolve", () => {
    const mapper = new KeyMapper();

    it("数字キーを正しく解決できる", () => {
        const btn = createButton("7");
        expect(mapper.resolve(btn)).toBe("7");
    });

    it("加算キーを正しく解決できる", () => {
        const btn = createButton("+");
        expect(mapper.resolve(btn)).toBe("+");
    });

    it("乗算キー x を * に変換できる", () => {
        const btn = createButton("x");
        expect(mapper.resolve(btn)).toBe("x");
    });

    it("除算キー ÷ を / に変換できる", () => {
        const btn = createButton("÷");
        expect(mapper.resolve(btn)).toBe("÷");
    });

    it("textContent が空の場合 null を返す", () => {
        const btn = createButton("");
        expect(mapper.resolve(btn)).toBeNull();
    });

    it("unknown key は null を返す", () => {
        const btn = createButton("@");
        expect(mapper.resolve(btn)).toBeNull();
    });

    it("target が HTMLElement でなければ null", () => {
        const fakeTarget = {} as EventTarget;
        expect(mapper.resolve(fakeTarget)).toBeNull();
    });
});