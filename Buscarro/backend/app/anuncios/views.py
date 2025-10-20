from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework import status, viewsets, filters
from rest_framework.filters import OrderingFilter
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from .serializers import AnuncioSerializer
from .models import Anuncio, Favorito
from django.db.models import Q


# Create your views here.

class AnuncioViewSet(viewsets.ModelViewSet):
    queryset = Anuncio.objects.all().order_by('-id')
    serializer_class = AnuncioSerializer
    filter_backends = [filters.SearchFilter, DjangoFilterBackend, OrderingFilter]
    search_fields = ['titulo', 'descricao', 'marca', 'modelo', 'cor', 'localizacao']
    filterset_fields = ['ano', 'marca', 'modelo', 'origem']
    ordering_fields = ['preco', 'ano']
    ordering = ['preco']

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def favoritar(self, request, pk=None):
        anuncio = self.get_object()
        usuario = request.user
        favorito, created = Favorito.objects.get_or_create(usuario=usuario, anuncio=anuncio)
        if created:
            return Response({'status': 'anúncio favoritado'}, status=status.HTTP_201_CREATED)
        else:
            favorito.delete()
            return Response({'status': 'anúncio desfavoritado'}, status=status.HTTP_200_OK)
        
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def meus_favoritos(self, request):
        usuario = request.user
        favoritos = Anuncio.objects.filter(favoritos__usuario=usuario).order_by('-favoritos__id')
        page = self.paginate_queryset(favoritos)
        if page is not None:
            serializer = AnuncioSerializer(page, many=True, context={'request': request})
            return self.get_paginated_response(serializer.data)
        serializer = AnuncioSerializer(favoritos, many=True, context={'request': request})
        return Response(serializer.data)

@swagger_auto_schema(method='get', operation_summary="Search ads with filters",
                     manual_parameters=[openapi.Parameter(
                        name='search',
                        in_=openapi.IN_QUERY,  
                        required=False,
                        type=openapi.TYPE_STRING,
                        description='Search term for ad'
                    )])
@api_view(['GET'])
@permission_classes([AllowAny])
def search_anuncios(request):
    # fazendo a busca por título, descrição, marca, modelo, cor e localização no search
    query = request.GET.get('search', '')
    if query:
        anuncios = Anuncio.objects.filter(Q(titulo__icontains=query) | Q(descricao__icontains=query) | Q(marca__icontains=query) | Q(modelo__icontains=query) | Q(cor__icontains=query) | Q(localizacao__icontains=query))
    else:
        anuncios = Anuncio.objects.all()
    # fazendo a buscar por filtros específicos
    marca = request.GET.get('marca')
    modelo = request.GET.get('modelo')
    ano = request.GET.get('ano')
    origem = request.GET.get('origem')
    cor = request.GET.get('cor')
    if marca:
        anuncios = anuncios.filter(marca__iexact=marca)
    if modelo:
        anuncios = anuncios.filter(modelo__iexact=modelo)
    if ano:
        anuncios = anuncios.filter(ano__iexact=ano)
    if origem:
        anuncios = anuncios.filter(origem__iexact=origem)
    if cor:
        anuncios = anuncios.filter(cor__iexact=cor)

    paginator = PageNumberPagination()
    page = paginator.paginate_queryset(anuncios, request)
    serializer = AnuncioSerializer(page, many=True, context={'request': request})
    return paginator.get_paginated_response(serializer.data)

