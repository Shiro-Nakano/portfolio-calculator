/** 
 * クラス：Config            : 電卓全体で扱う定数の宣言
 * 【定数】
 * MAX_DIGITS      number   :最大表示桁数
 * ERROR_MESSAGE   string   :エラーメッセージ
 */


export class Config{
    // 共通・不変の内容なのでstatic+readonly
    static readonly MAX_DIGITS: number = 8;
    static readonly ERROR_MESSAGE: string = "エラー";
}