export const BASE_API = "http://127.0.0.1:8000/api/"

export type StockActions = "BUY" | "SELL" | "MONITORING"

export interface Strategy {
    symbol: string,
    type: StockActions,
    current_price: number,
    target_profit: number,
    stop_loss: number,
    live_price?: number,
}

export const localStorageKey = "companyStrategies";


