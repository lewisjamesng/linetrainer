from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .chess_engine import ChessEngine

# from .serialisers import ChildNodeSerialiser


@api_view(["GET", "POST"])
def engine(request):
    if request.method == "GET":
        return Response("ok")

    elif request.method == "POST":
        return Response("new engine", status=status.HTTP_201_CREATED)


@api_view(["GET", "POST"])
def analyse(request):
    if request.method == "GET":
        return Response("ok")

    elif request.method == "POST":
        position_fen = request.data.get("position")
        # position_fen = "rnbqkbnr/ppp1pppp/8/3P4/8/8/PPPP1PPP/RNBQKBNR b KQkq - 0 2"
        engine = ChessEngine()
        move, eval, position = engine.analyse(position_fen)

        body = {
            "move": move,
            "eval": eval,
            "position": position,
        }

        return Response(body, status=status.HTTP_200_OK)
