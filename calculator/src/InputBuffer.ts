/** 
 * クラス　InputBuffer　　　　　　　　 : ユーザーが入力した文字を一時的に保持・正しい数値文字列で返し組み立て、Calculatorクラスに渡すクラス
 * 例）1→2→3と押下した場合：『１２３』と返す
 * 【Public】
 * +setNegative()          void    :第一数の負の数（直前にマイナス入力）のメソッド
 * +pushDigit(d: number)   void    :数字を１行ずつ追加するメソッド
 * +pushDecimal()          void    :小数点を追加するメソッド
 * +clear()                void    :『C』押下時に初期状態に戻すメソッド
 * +toNumber()             number  :現在入力された文字列を数値として戻すメソッド
 * +toString()             string  :入力中の数値を画面に表示する文字列として渡すメソッド
 * +isEmpty()              boolean :入力がないか確認するメソッド
 * +digitCount()           number  :小数点を除いた数字の桁数を返すメソッド
 * 【Private】
 * -value                  string  :入力中の数字を保持するための文字列の値
 * -maxDigits              number  :認められる最大桁数（仕様書：８行）
 */


// クラスのimport
// ↓『最大桁数』の引用のため
import { Config } from "./Config";


export class InputBuffer {
    // 【Private】
    /** 
     * value :値　→　初期値は入力前状態とするので「（空白）」とする
     */
    private value: string;
    /** 
     * maxDigit :許容される最大桁数　→　仕様書通り８桁
     */
    private maxDigits: number;
    // 初期値
    constructor() {
        this.value = "0";
        this.maxDigits = Config.MAX_DIGITS;
    }

    // 【Public】
    /** 
     * setNegative         （第一数入力前に）マイナス（ー）押下時のメソッド（負の数計算）
     * @returns    {void}   マイナスを返す
     */
    public setNegative(): void {
        if (this.value === "0") {
            this.value = "-";
        }
    }

    /** 
     * pushDigit 　　　　　　　　数値押下時のメソッド 
     * @param   {number}  d　　押下された数字
     * @returns {void}
     */
    public pushDigit(d: number): void {
        // 引数dが0~9までの数字の場合
        if (d < 0 || d > 9) {
            return;
        }
        // 桁数制限のチェック
        if (this.digitCount() >= this.maxDigits) {
            return;
        }
        // ０(初期値)の場合：入力値による表示の変更
        if (this.value === "0") {
            // ０が入力された場合：０を返す
            if (d === 0) {
                return;
            }
            // それ以外の数字の場合：dに書き換える
            else {
                this.value = d.toString();
                return;
            }
        }
        // ０以外の数字が入力済みの場合：現在の入力値に文字列でdを返す（現在の入力値に付け加える）
        else{
            this.value += d.toString()
        }
        
    }

    /** 
     * pushDecimal     小数点押下時のメソッド
     * @returns {void} 小数点の処理
     */
    public pushDecimal(): void {
        // 現在、入力値に小数点が含まれているか（→入力されない）
        if (this.value.includes(".")) {
            return;
        }
        // 含まれていない：文頭が０の場合：『0.』で返す
        if (this.value === "0") {
            this.value = "0.";
            return
        }
        // 含まれていない：それ以外の数字の場合：小数点を返す
        else{
        this.value += ".";
        }
    }

    /** 
     * clear           クリアボタン押下時のメソッド
     * @returns {void} 
     */
    public clear(): void {
        // 『C』ボタン押下時のメソッド（→『0』）
        this.value = "0";
        return;
    }

    /** 
     * toNumber　　　　　　　押下した文字列（value）を数値に変換するメソッド
     * @returns {number}  
     */
    public toNumber(): number {
        // 現在のvalueが空or0の数字の場合：数値０を返す(小数点≠０)
        if (this.value === "" || this.value === ".") {
            return 0;
        }
        // それ以外の場合
        else {
            return Number(this.value);
        }
    }

    /** 
     * toString           押下した数値を画面に表示させる際の文字列としてIDisplayクラスに渡すメソッド
     * @returns {string} 
     */
    public toString(): string {
        return this.value;
    }

    /** 
     * isEmpty            空欄かの判定のメソッド
     * @returns {boolean} 
     */
    public isEmpty(): boolean {
        return this.value === "";
    }
    
    /**
     * digitCount            小数点をのぞく桁数を返すメソッド         
     * @returns    {number}   
     */
    public digitCount(): number {
        // 小数点・第一数前のマイナスは桁数に含めない
        return this.value.replace(/[.-]/g, "").length;
    }
}