from usuarios.serializers import RegisterSerializer, UsuarioSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from drf_yasg.utils import swagger_auto_schema


@swagger_auto_schema(method='post', request_body=RegisterSerializer, operation_summary='register a new user')
@api_view(['POST'])
@permission_classes([AllowAny])
def user_register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "User created successfully!"}, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(methods=['put', 'patch'], request_body=UsuarioSerializer,  operation_summary='update user information')
@swagger_auto_schema(method='get', responses={200: UsuarioSerializer}, operation_summary='get user information')
@api_view(['GET', 'PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def user_information(request):
    user = request.user
    if request.method == 'GET':
        serializer = UsuarioSerializer(request.user)
        return Response(serializer.data)
    elif request.method == 'PUT' or request.method == 'PATCH':
        serializer = UsuarioSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(method='delete', operation_summary='delete user')
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def user_delete(request):
    try:
        user=request.user 
        user.delete()
        return Response({'message': 'User deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
    except Exception as e:
        return Response({f'error': 'Error deleting user, {e}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)