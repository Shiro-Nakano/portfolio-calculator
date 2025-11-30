// クラスのimport
// ↓画面反映のため
import { DomDisplay } from "./Display/DomDisplay";
// ↓計算処理のため
import { Calculator } from "./Calculator";
// ↓Token化するため
import { KeyMapper } from "./KeyMapper";


const display = new DomDisplay();
const calculator = new Calculator(display);
const mapper = new KeyMapper();

document.querySelectorAll(".buttons > button").forEach(btn => {
    btn.addEventListener("click", e => {
    const token = mapper.resolve(e.target as HTMLElement);
    if (token) {
        calculator.handle(token);
    }
    });
});