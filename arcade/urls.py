from django.urls import path
from django.views.generic.base import TemplateView
from . import views

urlpatterns = [
    path("", views.home, name = "home"),
    path("game/<str:game>/", views.mine, name = "game"),
    path("hall-of-fame/", views.hall_of_fame, name = "hall-of-fame"),
    path("origin/", views.origin, name = "origin"),
]

#TODO
"""
*filter/sort
*rating (model/functionality), add to home
*logout
*about the creator text
*hall of fame (search bar/pagination?)
*report/suggestions
*create app for suggestions/bugs
*pagination?
*design login/register
"""