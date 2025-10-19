from django.contrib import admin
from .models import Anuncio

# Register your models here.
@admin.register(Anuncio)
class AnuncioAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'marca', 'modelo', 'ano', 'preco', 'origem', 'is_active')
    list_filter = ('marca', 'ano', 'origem', 'is_active')
    search_fields = ('titulo', 'marca', 'modelo', 'descricao', 'localizacao', 'autor_nome')
    ordering = ('-id',)

