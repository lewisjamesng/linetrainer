import requests
from decouple import config
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

LICHESS_OAUTH_TOKEN = config("LICHESS_OAUTH_TOKEN")


@api_view(["GET", "POST"])
def engines(request):
    if request.method == "POST":
        lichess_url = "https://lichess.org/api/external-engine"
        payload = {"key": "value"}
        headers = {
            "Authorization": "Bearer " + LICHESS_OAUTH_TOKEN,
            "Content-Type": "application/json",
        }

        try:
            response = requests.get(lichess_url, headers=headers, json=payload)

            if response.status_code == 200:
                return Response(response.json(), status=status.HTTP_200_OK)
            else:
                Response({"error": "Failed to fetch data"}, status=response.status_code)

        except requests.exceptions.RequestException as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    if request.method == "GET":
        return Response("ok")


@api_view(["GET", "POST"])
def analyse(request):
    return Response("ok")
