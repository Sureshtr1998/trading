import os
import ssl
from celery import Celery
from dotenv import load_dotenv

load_dotenv()

# Set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_stock_trading.settings')

redis_url = os.getenv('REDIS_URL', 'redis://localhost:6379/0')
redis_result_backend = os.getenv('REDIS_RESULT_BACKEND', 'redis://localhost:6379/1')

# SSL setup for Celery (if using rediss://)
if redis_url.startswith('rediss://'):
    broker_transport_options = {
        'ssl': {
            'ssl_cert_reqs': ssl.CERT_NONE,  
        }
    }
else:
    broker_transport_options = {}

app = Celery('backend_stock_trading')

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django app configs.
app.autodiscover_tasks()

app.conf.update(
    broker_url=redis_url,
    result_backend=redis_result_backend,
    transport_options=broker_transport_options,
)

app.conf.worker_concurrency = 2
