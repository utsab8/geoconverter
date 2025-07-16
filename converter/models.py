from django.db import models
from django.contrib.auth import get_user_model

# Create your models here.

class File(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name='files')
    file = models.FileField(upload_to='uploads/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    original_name = models.CharField(max_length=255)

    def __str__(self):
        return self.original_name

class ConversionHistory(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name='conversions')
    input_file = models.ForeignKey(File, on_delete=models.CASCADE, related_name='input_conversions')
    output_file = models.ForeignKey(File, on_delete=models.CASCADE, related_name='output_conversions')
    conversion_type = models.CharField(max_length=50)  # e.g., 'KML to CSV'
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.conversion_type} at {self.timestamp}"
