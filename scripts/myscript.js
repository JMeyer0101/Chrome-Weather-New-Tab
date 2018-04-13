function sendMessages() {
    getTime();
    getWeather();
    
}

function getWeather() {
    console.log('sendmsg')
    chrome.runtime.sendMessage({
        action: "getCurrentForecast"
    }, function (response) {
        if (response.length <2) {
            console.log('recallingmsg1');
            setTimeout(getWeather, 2000);
        } else {
            console.log("THING");
            console.log(response);
            buildTemp(response[0]);
            buildCityState(response[1]);
        }
    });
}

function getTime() {
    chrome.runtime.sendMessage({
        action: "getTime"
    }, function (response) {
        if (response == null) {
            setTimeout(getTime, 1000);
        } else {
            $('.clock').text(response);
        }
    });
}

document.addEventListener('DOMContentLoaded', sendMessages);
setInterval(function () {
    getTime();
}, 1000);

setInterval(function () {
    getWeather();
}, 10.1*60*1000);


function buildTemp(result) {
    var skycons = new Skycons({
        "color": "white"
    });
    skycons.add("icon1", result.currently.icon);
    skycons.play();
    $(".tempnum").text(Math.round(fToC(result.currently.temperature)) + "\xB0")

}

function buildCityState(data) {
    for (var i = 0; i < data.results.length; i++) {
        if (data.results[i].types[0] === "locality") {
            var city = data.results[i].address_components[0].short_name;
            // var state = data.results[i].address_components[2].short_name;
            // $("input[name='location']").val(city + ", " + state);
            $(".citystate").text(city);
            break;
        }
    }
}

function fToC(temp) {
    return (temp * 9 / 5 + 32)
}