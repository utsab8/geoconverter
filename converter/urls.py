from django.urls import path
from .views import FileUploadView, FileListView, FileDeleteView, FileConvertView

urlpatterns = [
    path('upload/', FileUploadView.as_view(), name='file-upload'),
    path('list/', FileListView.as_view(), name='file-list'),
    path('delete/<int:pk>/', FileDeleteView.as_view(), name='file-delete'),
    path('convert/', FileConvertView.as_view(), name='file-convert'),
] 