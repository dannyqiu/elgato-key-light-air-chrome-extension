/**
 * Returns a hash code from a string
 * @param  {String} str The string to hash.
 * @return {Number}    A 32bit integer
 * @see http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
 */
function hashCode(str) {
    let hash = 0;
    for (let i = 0, len = str.length; i < len; i++) {
        let chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

class Light {
    constructor(ip, port) {
        this.ip = ip;
        this.port = port;
        this.id = Math.abs(hashCode(ip) ^ port);
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
        await registerOriginHeaderRemoval(this.id, url);
        return fetch(req, {referrerPolicy: "no-referrer"})
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

async function registerOriginHeaderRemoval(id, url) {
  const rules = [{
    id: id,
    action: {
      type: 'modifyHeaders',
      requestHeaders: [{ header: 'Origin', operation: 'remove' }],
    },
    condition: {
      requestMethods: ['put'],
      urlFilter: `|${url}`
    },
  }];
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: rules.map(r => r.id),
    addRules: rules,
  });
  console.log(await chrome.declarativeNetRequest.getDynamicRules());
}