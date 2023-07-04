from django.shortcuts import render
from django.http import HttpResponseRedirect
from .models import *

# Create your views here.

def get_all_roots(roots, sub_roots):
    """   0
         / \
        0   0
       /|\   \
      0 0 0   0 """
    #METHOD: DIVE EACH ROOT WHILE REMOVING ONE'S YOU'VE USED RETURNING (DEPTH, OBJECT)

    all_roots = []
    main_root = []
    
    def dive(curr_root, sub_roots, depth):
        depth += 1
        curr_root = curr_root

        for response in sub_roots:
            if response.respond_to == curr_root:
                main_root.append((depth, response))
                new_sub_roots = sub_roots[:]
                new_sub_roots.remove(response)

                dive(response, new_sub_roots, depth)


    for root in roots:
        main_root.append((0, root))
        dive(root, sub_roots, depth = 0)
        all_roots.append(main_root)
        main_root = []
    
    return all_roots


def sort_by(type, roots, sub_roots):
    #METHOD: sorts it before-hand so that diving through matches are being appended in the right order since it's first come first server in get_all_roots
    #RESULT: order in right way -> appending in right way
    
    sorted_roots = None
    sorted_sub_roots = None

    if type == "likes":
        sorted_roots = list(sorted(roots, key = lambda x: x.likes, reverse = True))
        sorted_sub_roots = list(sorted(sub_roots, key = lambda x: x.likes, reverse = True))
    
    return sorted_roots, sorted_sub_roots



def bugs(request):

    if request.method == "POST":
        
        # new user root commment
        rootComment = request.POST.get("rootComment")
        if rootComment and len(rootComment) > 0:
            bug = Bug()
            bug.user = request.user
            bug.comment = rootComment
            bug.save()

            return HttpResponseRedirect(request.path_info)

        # user commented to thread
        comment = request.POST.get("comment")
        if comment and len(comment) > 0:
            reporter = Bug()
            reporter.user = request.user
            reporter.comment = comment
            reporter.respond_to = Bug.objects.filter(comment__exact = request.POST.get("respond_to"))[0]
            reporter.save()

            return HttpResponseRedirect(request.path_info)

    roots = list(Bug.objects.filter(respond_to = None))
    sub_roots = list(Bug.objects.exclude(respond_to = None))
    
    # roots, sub_roots = sort_by("likes", roots, sub_roots)

    all_roots = get_all_roots(roots, sub_roots)

    return render(request, "user/bugs.html", {"all_roots": all_roots})

def suggestions(request):

    if request.method == "POST":
        
        # new user root commment
        rootComment = request.POST.get("rootComment")
        if rootComment and len(rootComment) > 0:
            suggestion = Suggestion()
            suggestion.user = request.user
            suggestion.comment = rootComment
            suggestion.save()

            return HttpResponseRedirect(request.path_info)

        # user commented to thread
        comment = request.POST.get("comment")
        if comment and len(comment) > 0:
            reporter = Suggestion()
            reporter.user = request.user
            reporter.comment = comment
            reporter.respond_to = Suggestion.objects.filter(comment__exact = request.POST.get("respond_to"))[0]
            reporter.save()

            return HttpResponseRedirect(request.path_info)

    roots = list(Suggestion.objects.filter(respond_to = None))
    sub_roots = list(Suggestion.objects.exclude(respond_to = None))
    
    # roots, sub_roots = sort_by("likes", roots, sub_roots)

    all_roots = get_all_roots(roots, sub_roots)

    return render(request, "user/suggestions.html", {"all_roots": all_roots})