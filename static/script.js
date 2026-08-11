

// ===============================
// DOM ELEMENTS
// ===============================

const cityInput = document.getElementById("cityInput");
const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");

const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const feelsLike = document.getElementById("feelsLike");
const pressure = document.getElementById("pressure");
const visibility = document.getElementById("visibility");
const sunrise = document.getElementById("sunrise");

const weatherIcon = document.getElementById("weatherIcon");

const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");

const forecastContainer = document.getElementById("forecastContainer");
const historyContainer = document.getElementById("historyContainer");

const weatherScene = document.getElementById("weatherScene");
let lightningInterval = null;


// ===============================
// EVENTS
// ===============================

searchBtn.addEventListener("click", searchWeather);

locationBtn.addEventListener("click", getCurrentLocation);

cityInput.addEventListener("keydown", (e) => {

    if (e.key === "Enter") {

        searchWeather();

    }

});

// ===============================
// SEARCH WEATHER
// ===============================

function searchWeather() {

    const city = cityInput.value.trim();

    if (city === "") {

        alert("Please enter a city.");

        return;

    }

    cityName.innerText = "Loading...";
    temperature.innerText = "--°C";
    description.innerText = "Fetching weather...";

    humidity.innerText = "--";
    wind.innerText = "--";
    feelsLike.innerText = "--";
    pressure.innerText = "--";
    visibility.innerText = "--";
    sunrise.innerText = "--";

    forecastContainer.innerHTML = "";

    fetch(`/api/weather?city=${encodeURIComponent(city)}`)
        .then(response => response.json())
        .then(data => {
            temperature.innerText = `${Math.round(data.main.temp)}°C`;
            cityName.innerText = data.name;
            description.innerText = data.weather[0].description;
            humidity.innerText = `${data.main.humidity}%`;
            feelsLike.innerText = `${Math.round(data.main.feels_like)}°C`;
            pressure.innerText = `${data.main.pressure} hPa`;
            visibility.innerText = `${(data.visibility / 1000).toFixed(1)} km`;
            wind.innerText = `${(data.wind.speed * 3.6).toFixed(1)} km/h`;
            sunrise.innerText = new Date(data.sys.sunrise * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
            forecastContainer.innerHTML = "";
            weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
            saveSearch(data.name);
            updateWeatherBackground(data.weather[0].main.toLowerCase());
            updateSkyObjects(data.sys.sunrise, data.sys.sunset, data.timezone);
            getForecast(data.name);
            console.log(data);
        });    


}

// ===============================
// GET WEATHER
// ===============================

async function getWeather(city) {

    const url = `/api/weather?city=${encodeURIComponent(city)}`;

try {

    searchBtn.disabled = true;
    searchBtn.innerText = "Loading...";

    const response = await fetch(url);

    const data = await response.json();

    console.log(data);

    if (Number(data.cod) !== 200) {

        alert(data.message);

        searchBtn.disabled = false;
        searchBtn.innerText = "Search";

        return;

    }


        // ===============================
        // UPDATE WEATHER
        // ===============================

        cityName.innerText = data.name;

        temperature.innerText =
            `${Math.round(data.main.temp)}°C`;

        description.innerText =
            data.weather[0].description;

        humidity.innerText =
            `${data.main.humidity}%`;

        feelsLike.innerText =
            `${Math.round(data.main.feels_like)}°C`;

        pressure.innerText =
            `${data.main.pressure} hPa`;

        visibility.innerText =
            `${(data.visibility / 1000).toFixed(1)} km`;

        wind.innerText =
            `${(data.wind.speed * 3.6).toFixed(1)} km/h`;

        const sunriseTime =
            new Date(data.sys.sunrise * 1000);

        sunrise.innerText =
            sunriseTime.toLocaleTimeString([], {

                hour: "2-digit",

                minute: "2-digit"

            });

        weatherIcon.src =
            `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;

        // ===============================
        // SAVE HISTORY
        // ===============================

        saveSearch(data.name);

        // ===============================
        // WEATHER EFFECTS
        // ===============================

        updateWeatherBackground(data.weather[0].main.toLowerCase());

       updateSkyObjects(
            data.sys.sunrise,
            data.sys.sunset,
            data.timezone
        );

        // ===============================
        // FORECAST
        // ===============================

        getForecast(data.name);

        searchBtn.disabled = false;
        searchBtn.innerText = "Search";

    }

    catch (error) {

        console.error(error);

        alert("Something went wrong!");

        searchBtn.disabled = false;
        searchBtn.innerText = "Search";

    }

}

// ===============================
// CURRENT LOCATION
// ===============================

function getCurrentLocation() {

    if (!navigator.geolocation) {

        alert("Geolocation is not supported by your browser.");

        return;

    }

    locationBtn.disabled = true;
    locationBtn.innerText = "Getting Location...";

    navigator.geolocation.getCurrentPosition(

        successLocation,

        errorLocation

    );

}



// ===============================
// LOCATION SUCCESS
// ===============================

async function successLocation(position) {

    const lat = position.coords.latitude;

    const lon = position.coords.longitude;

    const url = `/api/location?lat=${lat}&lon=${lon}`;

    try {

        const response = await fetch(url);

        const data = await response.json();

        console.log(data);

        cityName.innerText = data.name;

        temperature.innerText =
            `${Math.round(data.main.temp)}°C`;

        description.innerText =
            data.weather[0].description;

        humidity.innerText =
            `${data.main.humidity}%`;

        feelsLike.innerText =
            `${Math.round(data.main.feels_like)}°C`;

        pressure.innerText =
            `${data.main.pressure} hPa`;

        visibility.innerText =
            `${(data.visibility / 1000).toFixed(1)} km`;

        wind.innerText =
            `${(data.wind.speed * 3.6).toFixed(1)} km/h`;

        const sunriseTime =
            new Date(data.sys.sunrise * 1000);

        sunrise.innerText =
            sunriseTime.toLocaleTimeString([], {

                hour: "2-digit",

                minute: "2-digit"

            });

        weatherIcon.src =
            `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;

        saveSearch(data.name);

        updateWeatherBackground(data.weather[0].main.toLowerCase());

        updateSkyObjects(
            data.sys.sunrise,
            data.sys.sunset,
            data.timezone
        );

        getForecast(data.name);

    }

    catch (error) {

        console.error(error);

        alert("Unable to fetch weather.");

    }

    finally {

        locationBtn.disabled = false;

        locationBtn.innerText = "📍 Use My Location";

    }

}



// ===============================
// LOCATION ERROR
// ===============================

function errorLocation(error) {

    console.log(error);

    locationBtn.disabled = false;

    locationBtn.innerText = "📍 Use My Location";

    alert("Unable to get your location.");

}

// ===============================
// WEATHER ANIMATIONS
// ===============================

function updateWeatherBackground(weather){

    const weatherClasses = [
        "clear",
        "clouds",
        "rain",
        "snow",
        "thunderstorm",
        "mist"
    ];

    document.body.classList.remove(...weatherClasses);

    if(weatherClasses.includes(weather)){
        document.body.classList.add(weather);
    }else{
        document.body.classList.add("mist");
    }

    weatherScene.innerHTML =
        '<div id="lightning" class="lightning"></div>';

    if(lightningInterval){
        clearInterval(lightningInterval);
        lightningInterval = null;
    }

    switch(weather){

        case "clear":

            if(Math.random()>.75){

                createRainbow();

            }

            break;

        case "clouds":
            createClouds();
            createWindParticles();
            break;

        case "rain":
            createClouds();
            createRain();
            createRainSplashes();
            createWindParticles();

            if(Math.random()>.55){

                createRainbow();

            }   

            break;

        case "thunderstorm":
            createClouds();
            createRain();
            createRainSplashes();
            createLightning();
            createWindParticles();
            break;

        case "snow":
            createClouds();
            createSnow();
            break;

        case "mist":
            createMist();
            createWindParticles();
            break;

        default:
            createClouds();

    }

}


// ===============================
// CLOUDS
// ===============================

function createClouds() {

    for (let i = 0; i < 12; i++) {

        const cloud = document.createElement("div");

        cloud.className = "cloud";

        cloud.style.top =
            (20 + Math.random() * 320) + "px";

        cloud.style.left = "-500px";

        cloud.style.opacity =
            0.45 + Math.random() * 0.35;

        cloud.style.animationDuration =
            (35 + Math.random() * 35) + "s";

        cloud.style.animationDelay =
            (-Math.random() * 40) + "s";

        cloud.style.transform =
            `scale(${0.7 + Math.random() * 0.8})`;

        weatherScene.appendChild(cloud);

    }

}

// ===============================
// RAIN
// ===============================

function createRain() {

    for (let i = 0; i < 220; i++) {

        const drop = document.createElement("div");

        drop.className = "rain-drop";

        drop.style.left =
            Math.random() * 100 + "vw";

        drop.style.top =
            Math.random() * -100 + "vh";

        drop.style.animationDuration =
            (0.45 + Math.random() * 0.55) + "s";

        drop.style.animationDelay =
            Math.random() * 2 + "s";

        weatherScene.appendChild(drop);

    }

}

// ===============================
// CINEMATIC FOG
// ===============================

function createMist(){

    for(let i=0;i<6;i++){

        const fog=document.createElement("div");

        fog.className="fog-layer";

        fog.style.top=
            (40+i*70)+"px";

        fog.style.opacity=
            .12+Math.random()*.15;

        fog.style.animationDuration=
            (25+Math.random()*20)+"s";

        fog.style.animationDelay=
            (-Math.random()*20)+"s";

        weatherScene.appendChild(fog);

    }

}

// ===============================
// LIGHTNING
// ===============================

function createLightning() {

    if (lightningInterval) {
        clearInterval(lightningInterval);
    }

    const flash = document.getElementById("lightning");

    lightningInterval = setInterval(() => {

        if (Math.random() > 0.35) return;

        // Flash screen
        flash.classList.add("flash");

        setTimeout(() => {
            flash.classList.remove("flash");
        }, 180);

        // Create bolt
        const bolt = document.createElement("div");

        bolt.className = "lightning-bolt";

        bolt.style.left =
            (10 + Math.random() * 80) + "vw";

        bolt.style.height =
            (250 + Math.random() * 350) + "px";

        weatherScene.appendChild(bolt);

        requestAnimationFrame(() => {
            bolt.classList.add("show");
        });

        setTimeout(() => {

            bolt.remove();

        },300);

        // 30% chance of second strike

        if(Math.random() < .3){

            setTimeout(()=>{

                flash.classList.add("flash");

                const bolt2=document.createElement("div");

                bolt2.className="lightning-bolt";

                bolt2.style.left=
                    bolt.style.left;

                bolt2.style.height=
                    bolt.style.height;

                weatherScene.appendChild(bolt2);

                requestAnimationFrame(()=>{
                    bolt2.classList.add("show");
                });

                setTimeout(()=>{

                    flash.classList.remove("flash");

                    bolt2.remove();

                },220);

            },180);

        }

    },3500);

}

// ===============================
// 5 DAY FORECAST
// ===============================

async function getForecast(city) {

    const url = `/api/forecast?city=${encodeURIComponent(city)}`;

    try {

        const response = await fetch(url);

        const data = await response.json();

        forecastContainer.innerHTML = "";

        const dailyForecast = data.list.filter(item =>
            item.dt_txt.includes("12:00:00")
        );

        dailyForecast.forEach(day => {

            const date = new Date(day.dt_txt);

            const dayName = date.toLocaleDateString("en-US", {
                weekday: "short"
            });

            forecastContainer.innerHTML += `

                <div class="forecast-card">

                    <span>${dayName}</span>

                    <span>${Math.round(day.main.temp)}°C</span>

                    <span>${day.weather[0].main}</span>

                </div>

            `;

        });

    }

    catch (error) {

        console.error(error);

    }

}

// ===============================
// SEARCH HISTORY
// ===============================

function saveSearch(city) {

    let history =
        JSON.parse(localStorage.getItem("weatherHistory")) || [];

    history = history.filter(item => item !== city);

    history.unshift(city);

    history = history.slice(0, 5);

    localStorage.setItem(
        "weatherHistory",
        JSON.stringify(history)
    );

    displayHistory();

}



// ===============================
// DISPLAY HISTORY
// ===============================

function displayHistory() {

    const history =
        JSON.parse(localStorage.getItem("weatherHistory")) || [];

    historyContainer.innerHTML = "";

    history.forEach(city => {

        historyContainer.innerHTML += `

            <div class="history-item"
                 onclick="searchHistory('${city}')">

                ${city}

            </div>

        `;

    });

}



// ===============================
// SEARCH FROM HISTORY
// ===============================

function searchHistory(city) {

    cityInput.value = city;

    searchWeather();

}



// ===============================
// LOAD HISTORY
// ===============================

displayHistory();

/*=========================================
        DAY / NIGHT SYSTEM
=========================================*/

function updateDayNight(sunrise, sunset, timezone){

    document.body.classList.remove("day","night");

    const utcNow =
        Math.floor(Date.now()/1000);

    const localNow =
        utcNow + new Date().getTimezoneOffset()*60 + timezone;

    if(localNow >= sunrise && localNow < sunset){

        document.body.classList.add("day");

    }else{

        document.body.classList.add("night");

    }

}

/*=========================================
            SUN
=========================================*/

function createSun(){

    const sun=document.createElement("div");

    sun.className="sun";

    weatherScene.appendChild(sun);

}

/*=========================================
            MOON
=========================================*/

function createMoon(){

    const moon=document.createElement("div");

    moon.className="moon";

    weatherScene.appendChild(moon);

}

/*=========================================
            STARS
=========================================*/

function createStars(){

    for(let i=0;i<120;i++){

        const star=document.createElement("div");

        star.className="star";

        star.style.left=Math.random()*100+"vw";

        star.style.top=Math.random()*55+"vh";

        star.style.animationDelay=
            Math.random()*2+"s";

        star.style.animationDuration=
            (1+Math.random()*2)+"s";

        weatherScene.appendChild(star);

    }

}

/*=========================================
      SHOW DAY / NIGHT OBJECTS
=========================================*/

function updateSkyObjects(sunrise, sunset, timezone){

    updateDayNight(sunrise, sunset, timezone);

    document.querySelectorAll(".sun,.moon,.star").forEach(el=>el.remove());

    if(document.body.classList.contains("night")){
        createMoon();
        createStars();
    }else{
        createSun();
    }
}

// ===============================
// RAIN SPLASHES
// ===============================

function createRainSplashes(){

    for(let i=0;i<90;i++){

        const splash=document.createElement("div");

        splash.className="rain-splash";

        splash.style.left=Math.random()*100+"vw";

        splash.style.animationDelay=
            Math.random()*2+"s";

        splash.style.animationDuration=
            (.35+Math.random()*.35)+"s";

        weatherScene.appendChild(splash);

        requestAnimationFrame(()=>{

            splash.classList.add("show");

        });

        setInterval(()=>{

            splash.classList.remove("show");

            splash.offsetWidth;

            splash.classList.add("show");

        },700+Math.random()*1200);

    }

}

// ===============================
// WIND PARTICLES
// ===============================

function createWindParticles(){

    for(let i=0;i<45;i++){

        const wind=document.createElement("div");

        wind.className="wind";

        wind.style.top=
            Math.random()*100+"vh";

        wind.style.left=
            (-200-Math.random()*500)+"px";

        wind.style.animationDuration=
            (4+Math.random()*5)+"s";

        wind.style.animationDelay=
            (-Math.random()*8)+"s";

        wind.style.opacity=
            .15+Math.random()*.35;

        wind.style.transform=
            `scale(${0.7+Math.random()*1.2})`;

        weatherScene.appendChild(wind);

    }

}

// ===============================
// RAINBOW
// ===============================

function createRainbow(){

    const rainbow=document.createElement("div");

    rainbow.className="rainbow";

    weatherScene.appendChild(rainbow);

}

// ===============================
// CINEMATIC SNOW
// ===============================

function createSnow(){

    for(let i=0;i<180;i++){

        const snow=document.createElement("div");

        snow.className="snowflake";

        const size=2+Math.random()*7;

        snow.style.width=size+"px";
        snow.style.height=size+"px";

        snow.style.left=Math.random()*100+"vw";

        snow.style.top=(-Math.random()*100)+"vh";

        snow.style.opacity=.4+Math.random()*.6;

        snow.style.animationDuration=
            (8+Math.random()*8)+"s";

        snow.style.animationDelay=
            (-Math.random()*15)+"s";

        snow.style.setProperty(
            "--drift",
            (-120+Math.random()*240)+"px"
        );

        weatherScene.appendChild(snow);

    }

}

