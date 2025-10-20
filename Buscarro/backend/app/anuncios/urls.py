from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AnuncioViewSet, search_anuncios

router = DefaultRouter()
router.register(r'anuncios', AnuncioViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('anuncios/search/', search_anuncios, name='search_anuncios'),
]
