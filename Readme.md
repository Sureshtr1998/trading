env stocks

Backend
Start redis server => Inside wsl (Powershell)

ALWAYS BE IN STOCKS ENV
workon stocks

wsl --install (Powershell)

In WSL execute hostname -I to get IP and use it in celery ip
redis-server --port 6380
<!-- daphne backend_stock_trading.asgi:application -->
python manage.py runserver
celery -A backend_stock_trading worker --loglevel=info --pool=gevent

Frontend
npm run dev


<!-- To Execute using docker -->
npm run dev (In frontend)
docker-compose build
docker-compose up

<!-- http://localhost:5173/ -->

<!-- If Docker is giving some issues -->
docker-compose down
docker-compose down --volumes --remove-orphans
docker-compose build --no-cache
docker-compose up
