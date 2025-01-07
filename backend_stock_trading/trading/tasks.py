from celery import shared_task
import yfinance as yf
from channels.layers import get_channel_layer
import pandas as pd

# If we want to print data we need pandas

pd.set_option('display.max_rows', None)  # Show all rows
pd.set_option('display.max_columns', None)  # Show all columns

def get_live_data(symbol):
    """
    Fetch live stock data from Yahoo Finance.
    """
    stock = yf.Ticker(symbol)
    data = stock.history(period="1d", interval="1m")  # 1-minute interval data
    return data

# Refer tasks_backup.py for different strategies
def enhanced_breakout_strategy(symbol):
    data = get_live_data(symbol)
    
    if len(data) < 30:
        print(f"⚠️ Not enough data yet for {symbol}. Waiting for the first 30 minutes.")
        # time.sleep(interval)
        # return enhanced_breakout_strategy(symbol, interval)
    
    # Calculate VWAP
    data['VWAP'] = (data['Close'] * data['Volume']).cumsum() / data['Volume'].cumsum()
    
    # RSI Calculation (14-period)
    delta = data['Close'].diff()
    gain = (delta.where(delta > 0, 0)).rolling(14).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(14).mean()
    data['RSI'] = 100 - (100 / (1 + (gain / loss)))

    current_price = data['Close'].iloc[-1]
    vwap = data['VWAP'].iloc[-1]
    rsi = data['RSI'].iloc[-1]

    # Entry conditions
    if current_price > vwap and rsi > 50:
        return {
            'symbol': symbol,
            'type': "BUY",
            'current_price': current_price,
            'target_profit': current_price * 1.02,  # Target 2% profit
            'stop_loss': current_price * 0.98,  # Stop loss at 2% below
        }
    elif current_price < vwap and rsi < 50:
        return {
            'symbol': symbol,
            'type': "SELL",
            'current_price': current_price,
            'target_profit': current_price * 0.98,  # Target 2% profit
            'stop_loss': current_price * 1.02,  # Stop loss at 2% above
        }
    
    return {
        'symbol': symbol,
        'type': "MONITORING",
        'current_price': current_price,
        'target_profit': 0,
        'stop_loss': 0,
    }


@shared_task
def fetch_trading_strategy(symbol):
    strategy = enhanced_breakout_strategy(symbol)
    return strategy
