from django.db import models

# Create your models here.
class Origem(models.TextChoices):
    OLX = 'OLX', 'OLX'
    WEBMOTORS = 'WEBMOTORS', 'Webmotors'
    MERCADO_LIVRE = 'MERCADO_LIVRE', 'Mercado Livre'
    OUTROS = 'OUTROS', 'Outros'

class Anuncio(models.Model):
    titulo = models.CharField(max_length=255)
    modelo = models.CharField(max_length=120)
    marca = models.CharField(max_length=120)
    ano = models.CharField(max_length=4)
    quilometragem = models.IntegerField()
    preco = models.DecimalField(max_digits=10, decimal_places=2)
    descricao = models.TextField()
    cor = models.CharField(max_length=50)
    localizacao = models.CharField(max_length=255)
    repassado = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)                              
    origem = models.CharField(max_length=20, choices=Origem.choices, default=Origem.OUTROS)
    autor_nome = models.CharField(max_length=120)
    autor_telefone = models.CharField(max_length=20, null=True, blank=True)

    class Meta:
        db_table = 'anuncios'
        indexes = [
            models.Index(fields=['marca']),
            models.Index(fields=['modelo']),
            models.Index(fields=['ano']),
            models.Index(fields=['preco']),
            models.Index(fields=['quilometragem']),
            models.Index(fields=['origem'])
        ]

    def __str__(self):
        return f"{self.marca} {self.modelo} {self.ano} - {self.titulo}"