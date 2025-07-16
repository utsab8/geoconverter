from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    # Add additional fields here if needed, e.g. avatar, bio, etc.

    def __str__(self):
        return self.user.username
