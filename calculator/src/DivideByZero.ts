/** 
 * クラス　DivideByZero    :0除算時のエラー
 * 【Public】
 * +message: string　   　:0で割った時のエラー内容の値
 */


export class DivideByZero extends Error{
    public message : string;

    constructor(message: string){
        // 親クラス『Evaluator』で指定したErrorクラスの呼び出し(オーバーライド)
        super(message);
        // エラーメッセージを代入
        this.message = message;
        // エラー名「０除算」の設定
        this.name = "０除算";
    }
}