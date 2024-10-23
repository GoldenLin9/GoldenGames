from django.shortcuts import render
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth import login
from django.contrib.auth import logout
from django.shortcuts import redirect
from django.http import HttpResponseRedirect
import json
from .models import *

# Create your views here.

def home(request):
    
    if request.method == "POST":
        if request.POST.get("submit") == "log_in":
            form = AuthenticationForm(data = request.POST)
            if form.is_valid():
                user = form.get_user()
                login(request,user)

                return redirect("home")

        elif request.POST.get("submit") == "sign_up":
            form = UserCreationForm(request.POST)
            if form.is_valid():
                user = form.save()

                login(request, user)

                return redirect("home")
            
        elif request.POST.get("submit") == "log_out":
            logout(request)

            return redirect("home")

    sign_up = UserCreationForm()
    log_in = AuthenticationForm()
    games = {
        {
            "name:": "Minesweeper",
            "thumbnail": {
                "url": "images/mine-thumb.png",
            },

        },
        {
            "name": "Towers",
            "thumbnail": {
                "url": "images/towers-thumb.png",
            },

        },
        {
            "name": "Connect Four",
            "thumbnail": {
                "url": "images/connect4-thumb.png",
            },
        }
    }

    context = {
        "sign_up": sign_up,
        "log_in": log_in,
        "games": games
    }

    return render(request, "arcade/home.html", context)


def converter(score, scoring) -> int:
    if scoring.lower() == "timer":
        return int(score.replace(":",""))

    elif scoring.lower() == "points":
        return int(score)


def mine(request, game):
    game = Game.objects.filter(name__iexact = game).first()
    scoring = game.scoring


    if request.method == "POST":

        best = Score.objects.filter(player = request.user, game = game)
        new = json.loads(request.body)["score"]

        if scoring == "points":

            if not best.exists() or converter(new, scoring) > converter(best.first().score, scoring):
                best.delete()
                print("condition")
                print(new)
                new_high = Score(player = request.user, score = new, game = game)
                new_high.save()

        elif scoring == "timer":

            if not best.exists() or converter(new, scoring) < converter(best.first().score, scoring):
                best.delete()
                new_high = Score(player = request.user, score = new, game = game)
                new_high.save()
                best.delete()

    obj_scores = Score.objects.filter(game = game)
    scores = {score.player: score.score for score in obj_scores}
    sorted_scores = dict(sorted(scores.items(), key = lambda x: converter(x[1], scoring)))

    context = {
        "scores": sorted_scores,
        "game": game,
    }

    return render(request, f"arcade/{game}.html", context)


def hall_of_fame(request):
    records = {}

    for game in Game.objects.filter(competitive = True):
        scoring = game.scoring
        obj_scores = Score.objects.filter(game = game)
        scores = [[score.player, score.score] for score in obj_scores]
        sorted_scores = list(sorted(scores, key = lambda x: converter(x[1], scoring)))

        records[game] = sorted_scores[:3]
    
    context = {
        "records": records,
    }

    return render(request, "arcade/hall-of-fame.html", context)

def origin(request):
    return render(request, "arcade/origin.html")