from django.contrib import admin
from .models import UserProfile, ResetPasswordToken

# Register your models here.

admin.site.register(UserProfile)
admin.site.register(ResetPasswordToken)


