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
        return {
            'symbol': symbol,
            'type': "MONITORING",
            'current_price': None,
            'target_profit': 0,
            'stop_loss': 0,
            'rating': 1,  # Not enough data to rate
        }
    
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

    # Determine rating
    if current_price > vwap:
        if rsi > 70:
            rating = 5  # Strong buy signal
        elif rsi > 60:
            rating = 4  # Buy signal
        elif rsi > 50:
            rating = 3  # Weak buy signal
        else:
            rating = 2  # Monitoring phase
    elif current_price < vwap:
        if rsi < 30:
            rating = 5  # Strong sell signal
        elif rsi < 40:
            rating = 4  # Sell signal
        elif rsi < 50:
            rating = 3  # Weak sell signal
        else:
            rating = 2  # Monitoring phase
    else:
        rating = 1  # No clear signal

    # Entry conditions
    if current_price > vwap and rsi > 50:
        return {
            'symbol': symbol,
            'type': "BUY",
            'current_price': current_price,
            'target_profit': current_price * 1.02,  # Target 2% profit
            'stop_loss': current_price * 0.98,  # Stop loss at 2% below
            'rating': rating,
        }
    elif current_price < vwap and rsi < 50:
        return {
            'symbol': symbol,
            'type': "SELL",
            'current_price': current_price,
            'target_profit': current_price * 0.98,  # Target 2% profit
            'stop_loss': current_price * 1.02,  # Stop loss at 2% above
            'rating': rating,
        }
    
    return {
        'symbol': symbol,
        'type': "MONITORING",
        'current_price': current_price,
        'target_profit': 0,
        'stop_loss': 0,
        'rating': rating,
    }

@shared_task
def fetch_trading_strategy(symbol):
    strategy = enhanced_breakout_strategy(symbol)
    return strategy
