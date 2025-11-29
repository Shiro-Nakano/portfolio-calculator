/** 
 * クラス：NumberFormatter  : 電卓の表示
 * 【Public】
 * +formatForDisplay(n:number)    string    :
 * +fits(n:number)                boolean   :数値が8桁に収まるかどうかの判定
 * 【Private】
 * -maxDigits                     number    :認められる最大桁数（仕様書：８行）
 */


// クラスのimport
// ↓最大桁数の引用のため
import { Config } from "./Config";


export class NumberFormatter {
    // privateのプロパティ
    /** 
     * maxDigit : 許容される最大桁数
     * →仕様書通り８桁
     */
    private maxDigits: number;
    constructor(){
        this.maxDigits = Config.MAX_DIGITS;
    }

    // publicのメソッド
    /** 
     * @param   {number}    n  入力した数値
     * @returns {boolean}   　　8桁に収まっているか判定
     */
    public fits(n: number): boolean{
        const s = n.toString();
        // マイナス・小数点を桁数から外す
        const onlyDigits = s.replace(/[-.]/g, "");
        // 8桁以内の入力値を返す
        return onlyDigits.length <= this.maxDigits;
    }
    /** 
     * @param   {number}    n  入力した数値
     * @returns {string}   　　ディスプレイの表示
     */
    public formatForDisplay(n: number): string{
        // 表示が可能な場合　（→ディスプレイに文字列で返す）
        if(this.fits(n)){
            return n.toString();
        }
        // ⭐︎桁数が収まらない場合の指数表示　桁数の確認
        else{
            return n.toExponential(4);
        }
    }
}