# trading/urls.py
from django.urls import path
from . import views

urlpatterns = [
    
    path('api/trading-strategy/<str:symbol>/', views.get_trading_strategy, name='get_trading_strategy'),
    path('api/get_log/', views.get_log, name='get_log'),

]
