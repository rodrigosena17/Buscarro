from rest_framework import serializers
from .models import Anuncio, Favorito

class AnuncioSerializer(serializers.ModelSerializer):
    favoritado = serializers.SerializerMethodField()
    class Meta:
        model = Anuncio
        fields = ['id', 'titulo', 'descricao', 'marca', 'modelo', 'ano', 'cor', 'origem', 'preco', 'localizacao', 'quilometragem', 'autor_nome', 'favoritado']

    def get_favoritado(self, obj):
        request = self.context.get('request')
        usuario = getattr(request, 'user', None)
        if not usuario or not usuario.is_authenticated:
            return False
        return obj.favoritos.filter(usuario=usuario).exists()


class FavoritoSerializer(serializers.ModelSerializer):
    anuncio = AnuncioSerializer(read_only=True)
    anuncio_id = serializers.PrimaryKeyRelatedField(queryset=Anuncio.objects.all(), source='anuncio', write_only=True)
    class Meta:
        model = Favorito
        fields = ['id', 'usuario', 'anuncio', 'anuncio_id']

        