"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from parking.views import update_spot_status, get_dashboard_data, manual_update_status, get_all_spots

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/update_spot/', update_spot_status),
    path('api/dashboard/', get_dashboard_data),
    path('api/manual_update/', manual_update_status),
    path('api/spots/', get_all_spots),
]
