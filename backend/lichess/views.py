import secrets

import requests
from decouple import config
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

LICHESS_OAUTH_TOKEN = config("LICHESS_OAUTH_TOKEN")
lichess_url = "https://lichess.org/api/"
headers = {
    "Authorization": "Bearer " + LICHESS_OAUTH_TOKEN,
    "Content-Type": "application/json",
}


@api_view(["GET", "POST"])
def engine(request):
    if request.method == "POST":
        secret_length = 16
        payload = {
            "name": "Stockfish 15",
            "maxThreads": 8,
            "maxHash": 2048,
            "variants": ["chess"],
            "providerSecret": secrets.token_hex(secret_length),
        }
        try:
            response = requests.post(
                lichess_url + "external-engine", headers=headers, json=payload
            )

            if response.status_code == 201:
                # TODO: implement saving engine credentials in session
                response_data = response.json()
                engine_id = response_data["id"]
                engine_client_secret = response_data["clientSecret"]

                return Response(response_data, status=status.HTTP_201_CREATED)
            else:
                return Response(
                    {"error": "Failed to fetch data"}, status=response.status_code
                )

        except requests.exceptions.RequestException as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    elif request.method == "GET":
        return Response("ok", status=status.HTTP_200_OK)


@api_view(["GET", "POST"])
def analyse(request):
    # TODO: get engine credentials (ID and client secret) from stored session data
    # TODO: get position FEN and moves to date (in UCI format) from frontend
    if request.method == "POST":
        id = "eei_SRFOBGH0sD2A"
        client_secret = "ees_cNjYyjWujVTNI33K"
        payload = {
            "clientSecret": client_secret,
            "work": {
                "sessionId": "abcd1234",
                "threads": 4,
                "hash": 128,
                "multiPv": 1,
                "variant": "chess",
                "initialFen": "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 1",
                "moves": ["e2e4", "e7e5"],
            },
        }

        try:
            response = requests.post(
                f"https://engine.lichess.ovh/api/external-engine/{id}/analyse",
                headers=headers,
                json=payload,
            )

            if response.status_code == 200:
                return Response(response.json(), status=status.HTTP_200_OK)
            else:
                return Response(
                    {"error": response.content}, status=response.status_code
                )
        except requests.exceptions.RequestException as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    elif request.method == "GET":
        return Response("not ok", status=status.HTTP_200_OK)
