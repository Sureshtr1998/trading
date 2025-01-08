export const BASE_API = import.meta.env.VITE_BASE_API;

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


