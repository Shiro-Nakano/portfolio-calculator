/** 
 * イーナム：電卓の状態
 */

export enum CalcState{
    ready = "ready",
    InputtingFirst = "InputtingFirst",
    OperatorEntered = "OperatorEntered",
    InputtingSecond = "InputtingSecond",
    ResultShown = "ResultShown",
    Error = "Error"
}