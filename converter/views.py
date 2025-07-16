from django.shortcuts import render
from rest_framework import generics, permissions
from rest_framework.parsers import MultiPartParser, FormParser
from .models import File
from .serializers import FileSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .utils import kml_to_csv, csv_to_kml

# Create your views here.

class FileUploadView(generics.CreateAPIView):
    queryset = File.objects.all()
    serializer_class = FileSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class FileListView(generics.ListAPIView):
    serializer_class = FileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return File.objects.filter(user=self.request.user)

class FileDeleteView(generics.DestroyAPIView):
    serializer_class = FileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return File.objects.filter(user=self.request.user)

class FileConvertView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        uploaded_file = request.FILES.get('file')
        if not uploaded_file:
            return Response({'error': 'No file provided.'}, status=status.HTTP_400_BAD_REQUEST)
        ext = uploaded_file.name.lower().split('.')[-1]
        try:
            if ext == 'kml':
                csv_output = kml_to_csv(uploaded_file)
                response = Response(csv_output.getvalue(), content_type='text/csv')
                response['Content-Disposition'] = 'attachment; filename="converted.csv"'
                return response
            elif ext == 'csv':
                kml_output = csv_to_kml(uploaded_file)
                response = Response(kml_output.getvalue(), content_type='application/vnd.google-earth.kml+xml')
                response['Content-Disposition'] = 'attachment; filename="converted.kml"'
                return response
            else:
                return Response({'error': 'Unsupported file type. Only KML and CSV are allowed.'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
