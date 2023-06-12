function getLeftLight() {
    var ip = document.getElementById("left-ip").value;
    var port = document.getElementById("left-port").value;
    return new Light(ip, parseInt(port));
}

function getRightLight() {
    var ip = document.getElementById("right-ip").value;
    var port = document.getElementById("right-port").value;
    return new Light(ip, parseInt(port));
}

async function configureLight(light, profile) {
    return light.setLight(profile.brightness, profile.color);
}

async function displayResults(leftResp, rightResp) {
    document.getElementById("left-result").innerText = JSON.stringify(await leftResp);
    document.getElementById("right-result").innerText = JSON.stringify(await rightResp);
}

function configureButtons() {
    var profileButtonsHolder = document.getElementById("profile-buttons-holder");
    for (const [name, profile] of Object.entries(lightProfiles)) {
        var button = document.createElement("button");
        button.setAttribute("class", "profile-button");
        button.setAttribute("value", name);
        button.appendChild(document.createTextNode(name));
        button.addEventListener("click", async () => {
            var leftResp = configureLight(getLeftLight(), profile.left);
            var rightResp = configureLight(getRightLight(), profile.right);
            displayResults(leftResp, rightResp);
        });
        profileButtonsHolder.appendChild(button);
    }
}

function initialize() {
    configureButtons();

    displayResults(getLeftLight().getLight(), getRightLight().getLight());
}

initialize();
