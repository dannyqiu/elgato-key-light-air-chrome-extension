class Light {
    constructor(ip, port) {
        this.ip = ip;
        this.port = port;
    }

    async #sendRequest(path, method, body="") {
        var url =`http://${this.ip}:${this.port}${path}`;
        if (method == "GET") {
            var req = new Request(url);
        } else {
            var req = new Request(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: body,
            });
        }
        return fetch(req)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                return data;
            });
    }

    #makeLightsPutRequestBody(brightness, color) {
        if (brightness == 0) {
            var data = {"on": 0};
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

    async setLight(brightness, color) {
        var body = this.#makeLightsPutRequestBody(brightness, color);
        return this.#sendRequest("/elgato/lights", "PUT", body);
    }

    async getLight() {
        return this.#sendRequest("/elgato/lights", "GET");
    }
}

