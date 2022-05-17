from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Game(models.Model):

    mode_choices = [
        ("multi", "Multiplayer"),
        ("single", "Single-Player"),
    ]

    name = models.CharField(max_length = 50)
    competitive = models.BooleanField()
    mode = models.CharField(max_length = 15, choices = mode_choices)
    thumbnail = models.ImageField()
    date_created = models.DateField()

    def __str__(self):
        return self.name


class Score(models.Model):
    player = models.ForeignKey(User, on_delete = models.PROTECT)
    score = models.CharField(max_length = 20)
    game = models.ForeignKey(Game, on_delete = models.CASCADE)
    extra = models.CharField(max_length = 50, null = True)

    def __str__(self):
        return f"{self.player.username}- {self.score} on {self.game.name}"