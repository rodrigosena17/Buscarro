from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework import status, viewsets, filters
from rest_framework.pagination import PageNumberPagination
from .serializers import AnuncioSerializer
from .models import Anuncio, Favorito
from django.db.models import Q


# Create your views here.

class AnuncioViewSet(viewsets.ModelViewSet):
    queryset = Anuncio.objects.all()
    serializer_class = AnuncioSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['titulo', 'descricao', 'marca', 'modelo', 'cor', 'localizacao']
    filterset_fields = ['ano', 'marca', 'modelo', 'origem']

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
        
    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def desfavoritar(self, request):
        anuncio_id = request.data.get('anuncio_id')
        usuario = request.user
        try:
            favorito = Favorito.objects.get(usuario=usuario, anuncio_id=anuncio_id)
            favorito.delete()
            return Response({'status': 'anúncio desfavoritado'}, status=status.HTTP_200_OK)
        except Favorito.DoesNotExist:
            return Response({'error': 'Favorito não encontrado'}, status=status.HTTP_404_NOT_FOUND)
        
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def meus_favoritos(self, request):
        usuario = request.user
        favoritos = Favorito.objects.filter(usuario=usuario)
        anuncios = [favorito.anuncio for favorito in favoritos]
        page = self.paginate_queryset(anuncios)
        if page is not None:
            serializer = AnuncioSerializer(page, many=True, context={'request': request})
            return self.get_paginated_response(serializer.data)
        serializer = AnuncioSerializer(anuncios, many=True, context={'request': request})
        return Response(serializer.data)

@swagger_auto_schema(method='get', operation_summary="List all ads", )
@api_view(['GET'])
@permission_classes([AllowAny])
def list_anuncios(request):
    anuncios = Anuncio.objects.all()
    serializer = AnuncioSerializer(anuncios, many=True)
    return Response(serializer.data)


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
    origem = request.GET.get('origem')
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
    serializer = AnuncioSerializer(page, many=True)
    return paginator.get_paginated_response(serializer.data)

