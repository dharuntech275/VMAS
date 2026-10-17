from django.urls import path
from .views import MenuItemListView

app_name = 'menu'

urlpatterns = [
    path('', MenuItemListView.as_view(), name='menu-list'),
]
