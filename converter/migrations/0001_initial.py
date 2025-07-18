# Generated by Django 4.2.7 on 2025-07-16 06:27

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='File',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('file', models.FileField(upload_to='uploads/')),
                ('uploaded_at', models.DateTimeField(auto_now_add=True)),
                ('original_name', models.CharField(max_length=255)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='files', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='ConversionHistory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('conversion_type', models.CharField(max_length=50)),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('input_file', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='input_conversions', to='converter.file')),
                ('output_file', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='output_conversions', to='converter.file')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='conversions', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
