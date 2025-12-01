/** 
 * インターフェース　IDisplay:ディスプレイ表示
 * 【Private】
 * +render(text: string)          void  :入力内容・計算結果の表示メソッド
 * +renderError(message: string)  void  :エラー表示時のメソッド
 * +renderHistory(text: string)   void  :履歴エリアの表示メソッド
 * +clearHistory()                void  :履歴エリアの削除メソッド
 */


export interface IDisplay{
    render(text: string):void;
    renderError(message: string):void;
    renderHistory(text: string):void;
    clearHistory(): void;
}