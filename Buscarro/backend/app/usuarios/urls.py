from django.urls import path
from .views import user_register, user_delete

urlpatterns = [ 
    path('register/', user_register, name='user_register'),
    path('delete/', user_delete, name='user_delete'),
]