from rest_framework import serializers
from .models import File

class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = ['id', 'user', 'file', 'uploaded_at', 'original_name']
        read_only_fields = ['id', 'user', 'uploaded_at', 'original_name']

    def validate_file(self, value):
        valid_mime_types = [
            'application/vnd.google-earth.kml+xml',
            'application/xml',
            'text/xml',
            'text/csv',
            'application/csv',
        ]
        valid_extensions = ['.kml', '.csv']
        import os
        ext = os.path.splitext(value.name)[1].lower()
        if ext not in valid_extensions:
            raise serializers.ValidationError('Only KML and CSV files are allowed.')
        return value

    def create(self, validated_data):
        validated_data['original_name'] = validated_data['file'].name
        return super().create(validated_data) 