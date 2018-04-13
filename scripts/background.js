var APIKEY = ''; //forecast.io api key
var latitude = 0;
var longitude = 0;
var weatherResp = [];
var time = null;
var GEOAPIKEY = ''; //google geocache api key
setInterval(function () {
    getTime();
}, 1000);



function getTime() {
    var d = new Date();
    var minutes = d.getMinutes()
    var hours = d.getHours()
    // var ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = (hours > 12) ? hours - 12 : hours;
    hours = (hours == 0) ? 12 : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    time = hours + ":" + minutes + " " 

}

chrome.runtime.onInstalled.addListener(function () {
    chrome.alarms.create("forecast", {
        delayInMinutes: 0,
        periodInMinutes: 10
    });
});

chrome.alarms.onAlarm.addListener(function (alarm) {
    console.log('getlocationalarm');
    getWeather();
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action == "getCurrentForecast") {
        console.log('gotmsg')
        console.log(weatherResp)
        
        sendResponse(weatherResp);

        
    }
});


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action == "getTime") {
        
        
        
        
        sendResponse(time);

        
        
    }
});


function getWeather(callback) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getData, showError);
        
    }

    if (callback) {
        callback();
    } else {
        console.log('no callback')
    }
}

function getGoogle(callback) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getCity, showError);
        
    }

    if (callback) {
        callback();
    } else {
        console.log('no callback')
    }
}

function getData(position) {

    latitude = position.coords.latitude;
    

    longitude = position.coords.longitude;
    
    
    getJSON('https://api.forecast.io/forecast/' + APIKEY + '/' +
        latitude + ',' + longitude + '?units=si&lang=en&exclude=minutely,hourly,daily,alerts,flags',
        function (data) {
            console.log(data)
            
            weatherResp[0] = data;
        });

    getJSON('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + ',' + longitude + '&sensor=true&key=' + GEOAPIKEY,
        function (data) {
            console.log(data)
            
            
            weatherResp[1] = data;
            
            //     callback(cityResp);
            // }

        });


    

}



function getCity(position) {
    latitude = position.coords.latitude;
    

    longitude = position.coords.longitude;
    console.log(latitude);
    console.log(longitude);
    getJSON('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + ',' + longitude + '&sensor=true&key=' + GEOAPIKEY,
        function (data) {
            console.log(data)
            
            
            cityResp = data;
            
            //     callback(cityResp);
            // }

        });


}

function getJSON(url, callback) {
    var x = new XMLHttpRequest();
    x.open('GET', url);
    x.responseType = 'json';
    x.onload = function () {
        callback(x.response);
    };
    x.send();
}


function showError(error) {
    var statusDiv = document.getElementById("status");

    switch (error.code) {
        case error.PERMISSION_DENIED:
            console.log("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            console.log("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            console.log("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            console.log("An unknown error occurred.");
            break;
    }
}