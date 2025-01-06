# trading/views.py
from django.http import JsonResponse
from .tasks import fetch_trading_strategy
from .tasks import fetch_trading_strategy
import logging


logging.basicConfig(
    filename="stock_alerts.log",  
    level=logging.INFO,  
    format="%(asctime)s - %(levelname)s - %(message)s",  
    datefmt="%Y-%m-%d %H:%M:%S",  
)


def get_trading_strategy(request, symbol):
    strategy = fetch_trading_strategy.delay(symbol)
    try:
        strategy_result = strategy.get(timeout=30)  # Wait for the task to complete
        logging.info(f"Alert for: {symbol}: Strategy: {strategy_result}")
        # Return the result as JSON
        return JsonResponse({'status': 'Task completed', 'strategy': strategy_result})
    except Exception as e:
        # If the task times out or fails, handle the error gracefully
        return JsonResponse({'status': 'Task failed', 'error': str(e)})