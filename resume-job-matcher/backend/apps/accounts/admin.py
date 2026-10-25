from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import User


class AccountsUserAdmin(UserAdmin):
	ordering = ('email',)


admin.site.register(User, AccountsUserAdmin)

# Register your models here.
