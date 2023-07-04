from django.urls import path
from . import views

urlpatterns = [
    path("bugs/", views.bugs, name = "bugs"),
    path("suggestions/", views.suggestions, name = "suggestions"),
]

# if parameters were captured, then response was to a person, else just a post

#ORDER MATTERS, all in a huge list (depth(tabsize), blog)
#TO COLLAPSE: SELECT ALL FROM TAB 0 TO NEXT, then DELETE