from django.urls import path
from . import views

# URLconf
urlpatterns = [
    path("engines/", views.engines),
    path("analyse/", views.analyse),
]
