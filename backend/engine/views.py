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
        # TODO: create instance of engine in the backend
        return Response("new engine", status=status.HTTP_201_CREATED)


@api_view(["GET", "POST"])
def analyse(request):
    if request.method == "GET":
        return Response("ok")

    elif request.method == "POST":
        # TODO: get instance of engine in the backend
        # position_pgn = request.data.get("position")
        position_fen = "rnbk1b1r/pp2ppp1/5n1p/8/8/8/PPPP1PPP/RNBQKBNR w KQ - 0 6"
        engine = ChessEngine()
        analysis = engine.analyse(position_fen)
        # serialiser = ChildNodeSerialiser(analysis, many=True)

        return Response(analysis, status=status.HTTP_200_OK)
