from django.db import models
from django.contrib.auth.models import User
from datetime import date
from datetime import datetime
from django.conf import settings
import uuid

class Bug(models.Model):
    user = models.ForeignKey(User, on_delete = models.SET_NULL, null = True)
    comment = models.TextField(max_length = 400)
    respond_to = models.ForeignKey(to = "Bug", on_delete = models.SET_NULL, null = True, blank = True, default = None)
    date = models.DateField(auto_now_add = True)

    def __str__(self):
        return f"{self.user}: {self.comment[:10]}"

# class BugResponse(models.Model):
#     response_to = models.ForeignKey(Bug, on_delete = models.PROTECT)
#     responder = models.ForeignKey(User, on_delete = models.PROTECT)


class Suggestion(models.Model):
    user = models.ForeignKey(User, on_delete = models.SET_NULL, null = True)
    comment = models.TextField(max_length = 400)
    respond_to = models.ForeignKey(to = "Suggestion", on_delete = models.SET_NULL, null = True, blank = True, default = None)
    date = models.DateField(auto_now_add = True)

    def __str__(self):
        return f"{self.user}: {self.comment[:10]}"