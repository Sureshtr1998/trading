# trading/views.py
from django.http import JsonResponse
from .tasks import fetch_trading_strategy
from .tasks import fetch_trading_strategy
import logging
from django.views.decorators.csrf import csrf_exempt
import os


logging.basicConfig(
    filename="stock_alerts.log",  
    level=logging.INFO,  
    format="%(asctime)s - %(levelname)s - %(message)s",  
    datefmt="%Y-%m-%d %H:%M:%S",  
)

@csrf_exempt
def get_log(request):
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    log_file_path = os.path.join(base_dir, 'stock_alerts.log')
    
    try:
        with open(log_file_path, 'r') as log_file:
            # Read the last few lines of the file
            log_content = log_file.readlines()
            # You could decide how much log data to return based on your needs
            return JsonResponse({"log_content": log_content}, status=200)
    except FileNotFoundError:
        return JsonResponse({"error": "Log file not found"}, status=404)


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