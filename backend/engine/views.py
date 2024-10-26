from rest_framework.decorators import api_view
from rest_framework.response import Response

from .chess_engine import ChessEngine
from rest_framework import status


@api_view(["GET", "POST"])
def engine(request):
    if request.method == "GET":
        return Response("ok")

    elif request.method == "POST":
        # TODO: create instance of engine in the backend
        return Response("new engine", status=status.HTTP_201_CREATED)


