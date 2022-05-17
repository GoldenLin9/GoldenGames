from django.shortcuts import render
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth import login
from django.shortcuts import redirect
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

    sign_up = UserCreationForm()
    log_in = AuthenticationForm()
    games = Game.objects.all()

    context = {
        "sign_up": sign_up,
        "log_in": log_in,
        "games": games
    }

    return render(request, "arcade/home.html", context)


def mine(request):
    game = Game.objects.filter(name__iexact = "Minesweeper").first()

    if request.method == "POST":
        # save score ONLY if score is better than record, so I can save storage
        time = int(json.loads(request.body)["score"].replace(":","").lstrip("0"))
        best = Score.objects.filter(player = request.user, game = game).first()
        if best == None:
            best = float("inf")
        else:
            best = int(best.score.replace(":","").lstrip("0"))

        if time < best:
            if best != float("inf"):
                Score.objects.filter(player = request.user, game = game).first().delete()

            new_high = Score(player = request.user, game = game, score = json.loads(request.body)["score"])
            new_high.save()

    obj_scores = Score.objects.filter(game = game)
    scores = {}
    for score in obj_scores:
        scores[score] = score.score.replace(":", "").lstrip("0")
    
    scores = dict(sorted(scores.items(), key = lambda item:item[1]))

    return render(request, "arcade/minesweeper.html", {"scores": scores})


def score(request, score):
    return render(request, "arcade/test.html", {"score":score})