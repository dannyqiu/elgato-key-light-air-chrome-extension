var lightProfiles = {
    dawn: {
        left: {
            brightness: 5,
            color: 5000,
        },
        right: {
            brightness: 20,
            color: 5000,
        },
    },
    morning: {
        left: {
            brightness: 10,
            color: 6000,
        },
        right: {
            brightness: 45,
            color: 6000,
        },
    },
    morning2: {
        left: {
            brightness: 30,
            color: 6500,
        },
        right: {
            brightness: 60,
            color: 6500,
        },
    },
    morning3: {
        left: {
            brightness: 40,
            color: 7000,
        },
        right: {
            brightness: 70,
            color: 7000,
        },
    },
    afternoon: {
        left: {
            brightness: 5,
            color: 5500,
        },
        right: {
            brightness: 30,
            color: 5500,
        },
    },
    dusk: {
        left: {
            brightness: 3,
            color: 5500,
        },
        right: {
            brightness: 15,
            color: 5500,
        },
    },
    night: {
        left: {
            brightness: 20,
            color: 4000,
        },
        right: {
            brightness: 40,
            color: 4000,
        },
    },
    brightbrightbright: {
        left: {
            brightness: 100,
            color: 7000,
        },
        right: {
            brightness: 100,
            color: 7000,
        },
    },
    off: {
        left: {
            brightness: 0,
        },
        right: {
            brightness: 0,
        },
    },
};

async function sendRequest(ip, req) {
    var port = 9123;
    var endpoint = "/elgato/lights";
    return fetch(`http://${ip}:${port}${endpoint}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: req,
    })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            return data;
        });
}

function makeRequest(brightness, color) {
    if (brightness == 0) {
        var data = {"on": 0}
    } else {
        var data = {
            "on": 1,
            "brightness": brightness,
            "temperature": Math.round(1e6 / color),
        };
    }
    return JSON.stringify({
        "numberOfLights": 1,
        "lights": [data],
    });
}

async function configureLeft(leftProfile) {
    var leftIp = document.getElementById("left-ip").value;
    var req = makeRequest(leftProfile.brightness, leftProfile.color);
    return sendRequest(leftIp, req);
}

async function configureRight(rightProfile) {
    var rightIp = document.getElementById("right-ip").value;
    var req = makeRequest(rightProfile.brightness, rightProfile.color);
    return sendRequest(rightIp, req);
}

function configureButtons() {
    var profileButtonsHolder = document.getElementById("profile-buttons-holder");
    for (const [name, profile] of Object.entries(lightProfiles)) {
        var button = document.createElement("button");
        button.setAttribute("class", "profile-button");
        button.setAttribute("value", name);
        button.appendChild(document.createTextNode(name));
        button.addEventListener("click", async () => {
            var leftResp = configureLeft(profile.left);
            var rightResp = configureRight(profile.right);
            document.getElementById("left-result").innerText = JSON.stringify(await leftResp);
            document.getElementById("right-result").innerText = JSON.stringify(await rightResp);
        });
        profileButtonsHolder.appendChild(button);
    }
}

configureButtons();
