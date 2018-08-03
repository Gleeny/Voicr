const Snekfetch = require("snekfetch");
const Package = require("../../package.json");
const Bot = require("./structures/Bot");
const Vote = require("./structures/Vote");

class Client {

    constructor(token, options = {}) {
        if ((token && token.constructor === Object) && typeof options === "undefined") {
            options = token;
            token = undefined;
        }

        if (token && typeof token !== "string") throw new TypeError("[INVALID_TOKEN]: Provided token is not a string");

        this.token = token;

        this.baseURL = options.url ? options.url : "https://listcord.com/api";

        this.userAgent = options.userAgent ? options.userAgent : `Listcord v${Package.version} (${Package.homepage})`;
    }

    getBots(sortType = "votes", limit = "50", offset = "0", search) {
        return this._request("GET", `bots/${sortType}/${limit}/${offset}`, {
            query: { q: search }
        });
    }

    getBot(botId) {
        return this._request("GET", `bot/${botId}`).then(bot => new Bot(bot));
    }

    getVotes(botId) {
        return this._request("GET", `bot/${botId}/votes`).then(votes => votes.map(vote => new Vote(vote)));
    }

    postStats(botId, guilds, shards) {
        return this._request("POST", `bot/${botId}/guilds`, {
            data: { guilds, shards }
        });
    }

    _request(method = "GET", endpoint, options = {}) {
        const request = new Snekfetch(method, `${this.baseURL}/${endpoint}`, {
            headers: { "User-Agent": this.userAgent, Authorization: this.token || "" },
            query: options.query || {},
            data: options.data || undefined
        });

        return request
            .then(res => res.body)
            .catch(error => {
                Error.captureStackTrace(error);
                throw error;
            });
    }

}

module.exports = Client;
