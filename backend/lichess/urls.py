from django.urls import path
from . import views

# URLconf
urlpatterns = [
    path("engine/", views.engine),
    path("analyse/", views.analyse),
]
