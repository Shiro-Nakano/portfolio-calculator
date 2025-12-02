/** 
 * クラス：Calculator :アプリの制御（状態遷移と評価タイミング）
 * 【Private】
 * -state: CalcState              　　　　　 状態
 * -left: number|null              　　　　　左辺
 * -operator: Operation | null     　　　　　演算子
 * -buffer: InputBuffer            　　　　　バッファー
 * -evaluator: Evaluator           　　　　　計算
 * -formatter: NumberFormatter     　　　　　表示文字列の形成
 * -display: IDisplay              　　　　　描画
 * 
 * 【Public】
 * +handle 
 * +handleDigit(d: number):void    
 * +handleDecimalPoint(): void             小数点押下時の動作
 * +handleOperator(op: Operation): void
 * +handleEqual(): void
 * +handleClear: void
 */


// クラスのimport
// 各クラス
import type { IDisplay } from "../src/Display/IDisplay";
import { InputBuffer } from "./InputBuffer";
import { Evaluator } from "./Evaluator";
import { NumberFormatter } from "./NumberFormatter";
import { DivideByZero } from "./DivideByZero";

// イーナム
import { CalcState } from "./Enums/CalcState";
import { Operation } from "./Enums/Operation";
// 型エイリアス
import type { KeyToken } from "./TypeAlias/KeyToken";


export class Calculator {
    // 【Private】
    // メンバー変数：状態の取得
    private state: CalcState = CalcState.ready;
    // メンバー変数：左辺の初期値（null）
    private left: number | null = null;
    // メンバー変数：演算子の初期値（null）
    private operatorType: Operation | null = null;
    // メンバー変数：履歴の初期設定（空欄）
    private history: string = "";

    constructor(
        // 初期値:各クラスで設定した内容を引っ張ってくる
        private readonly display: IDisplay,
        private readonly formatter = new NumberFormatter(),
        private readonly evaluator = new Evaluator(),
        private readonly buffer = new InputBuffer()
    ) {
        this.display.render(this.buffer.toString()
        );
    }

    /** 
     * operator: KeyTokenにて入力された内容を対応するOperationのキーを返す
     * @param   {KeyToken}          token  入力されたキー
     * @returns {Operation | null}   　　   演算子がある・ないで返す
     */
    private operator(token: KeyToken): Operation | null {
        switch (token) {
            case "+": return Operation.add;
            case "-": return Operation.subtract;
            case "x": return Operation.multiply;
            case "÷": return Operation.divide;
            default: return null;
        }
    }


    // 【Public】

    /** 
     * handle: KeyTokenを適切なハンドラへ渡す
     * @param   {KeyToken}          token  入力されたキー
     * @returns {void}   　　               押下されたtokenに応じて各処理を返す
     */
    public handle(token: KeyToken): void {
        // （第一数入力前）負の数が押下された場合
        if (this.state === CalcState.ready && token === "-") {
            this.buffer.setNegative();
            this.display.render(this.buffer.toString());
            this.state = CalcState.InputtingFirst;
            return;
        }
        // 数字キーが押下された場合
        if (token >= "0" && token <= "9") {
            this.handleDigit(Number(token));
            return;
        }
        // 小数点キーが押下された場合
        if (token === ".") {
            this.handleDecimalPoint();
            return;
        }
        // イコールキーが押下された場合
        if (token === "=") {
            this.handleEqual();
            return;
        }
        // クリアキーが押下された場合
        if (token === "C") {
            this.handleClear();
            return;
        }
        // 演算子キーが押下された場合
        const op = this.operator(token);
        if (op) {
            this.handleOperator(op);
            return;
        }
    }

    // 各キーの入力後の処理

    /** 
     * 数字キー 押下後の処理
     */
    public handleDigit(d: number): void {
        // 例外処理：『Error』表示後に数字ボタンを押下すると初期化される。
        if (this.state === CalcState.Error) {
            this.buffer.clear();
            this.state = CalcState.InputtingFirst;
        }
        // 通常処理：
        if (this.state === CalcState.ResultShown) {
            this.buffer.clear();
            this.left = null;
            this.state = CalcState.InputtingFirst;
        }

        this.buffer.pushDigit(d);
        this.display.render(this.buffer.toString());

        if (this.state === CalcState.ready) {
            this.state = CalcState.InputtingFirst;
        }
    }

    /** 
     * 小数点キー　押下後の処理
     */
    public handleDecimalPoint(): void {
        this.buffer.pushDecimal();
        this.display.render(this.buffer.toString());
    }

    /** 
     * 演算子キー　押下後の処理
     */
    public handleOperator(op: Operation): void {
        // 結果表示後に演算子が押下された場合
        if (this.state === CalcState.ResultShown) {
            this.state = CalcState.OperatorEntered;
            this.operatorType = op;
            this.history = `${this.left} ${op}`;
            this.display.renderHistory(this.history);
            this.buffer.clear();
            return;
        }
        // 最初の数値入力後に演算子が押下された場合
        if (this.state === CalcState.InputtingFirst) {
            const num = this.buffer.toNumber();
            this.left = num;
            this.operatorType = op;
            this.state = CalcState.OperatorEntered;
    
            this.history = `${num} ${op}`;
            this.display.renderHistory(this.history);
    
            this.buffer.clear();
            return;
        }
     // 演算子連打時（途中計算）
        if (this.state === CalcState.OperatorEntered) {
        const right = this.buffer.toNumber();

        const result = this.evaluator.compute(this.left!, this.operatorType!, right);
        this.left = result;
        // 次の演算子に更新
        this.operatorType = op; 

        this.display.render(this.formatter.formatForDisplay(result));

        this.history = `${result} ${op}`;
        this.display.renderHistory(this.history);

        this.buffer.clear();
        return;
    }
}


    /** 
     * イコールキー押下時の処理
     */
    public handleEqual(): void {
        // すでに結果が表示されている場合は計算しない
        if (this.state === CalcState.ResultShown) {
            return;
        }
        // 
        if (!this.operatorType || this.left === null) {
            return;
        }
        const right = this.buffer.toNumber();
        // 履歴更新
        this.history = `${this.left}${this.operatorType}${right}=`;
        this.display.renderHistory(this.history);

        // 例外処理：割り算0除算時のエラー
        try {
            const result = this.evaluator.compute(this.left, this.operatorType, right);

            this.display.render(this.formatter.formatForDisplay(result));
            this.left = result;
            this.state = CalcState.ResultShown;
        }
        catch (error) {
            // エラー時の表示：０除算
            if(error instanceof DivideByZero){
                this.display.render("エラー")
            }
            // エラー表示：そのほか
            else{
            this.display.render("Error");
            }
            // 状態：Errorになる
            this.state = CalcState.Error;
            // バッファのリセット
            this.buffer.clear();
        }
    }

    /** 
     * クリアーキー押下時の処理
     */
    public handleClear(): void {
        // バッファの初期化
        this.buffer.clear();
        // 『０』を表示
        this.display.render("0");
        // 履歴更新：
        this.display.clearHistory();
        this.history = "";
        // ready状態に移行
        this.state = CalcState.ready;
    }
}
