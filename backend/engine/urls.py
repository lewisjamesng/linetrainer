from django.urls import path
from . import views

# URLconf
urlpatterns = [
    path("", views.engine),
    path("analyse/", views.analyse),
]
