from flask import Flask, render_template, request, jsonify
import requests
from dotenv import load_dotenv
import os

app = Flask(__name__, template_folder="templates", static_folder="static")
load_dotenv()
API_KEY = os.getenv("OPENWEATHER_API_KEY")

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/api/weather")
def weather():
    city = request.args.get("city")


    url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric"

    response = requests.get(url)

    data = response.json()

    return jsonify(data)

@app.route("/api/forecast")
def forecast():
    city = request.args.get("city")


    url = f"https://api.openweathermap.org/data/2.5/forecast?q={city}&appid={API_KEY}&units=metric"

    response = requests.get(url)

    data = response.json()

    return jsonify(data)

@app.route("/api/location")
def get_location():
    lat = request.args.get("lat")
    lon = request.args.get("lon")


    url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API_KEY}&units=metric"

    response = requests.get(url)

    data = response.json()

    return jsonify(data)

if "__name__" == "__main__":
    app.run(debug=True)