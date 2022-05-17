from django.urls import path
from . import views

urlpatterns = [
    path("", views.home, name = "home"),
    path("minesweeper/", views.mine, name = "mine"),
    path("minesweeper/<str:score>/", views.score, name = "score"),
]