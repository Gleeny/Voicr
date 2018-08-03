class Bot {

    constructor(data) {
        /**
         * The ID of the bot
         * @type {string}
         */
        this.id = data.id;
        /**
         * The username of the bot
         * @type {string}
         */
        this.username = data.username;
        /**
         * The discriminiator of the bot
         * @type {string}
         */
        this.discriminiator = data.discriminiator;
        /**
         * The avatar id of the bot
         * @type {string}
         */
        this.avatar = data.avatar;
        /**
         * The description of the bot
         * @type {string}
         */
        this.description = data.description || "No description provided";
        /**
         * The website url of the bot
         * @type {string}
         */
        this.website = data.website || "No website provided";
        /**
         * The invite url to the support server for the bot
         * @type {string}
         */
        this.support = data.support || "No support server provided";
        /**
         * The invite url to invite the bot to a server
         * @type {string}
         */
        this.invite = data.invite || "No invite provided";
        /**
         * Whether or not the bot is online
         * @type {boolean}
         */
        this.online = data.online;
        /**
         * The amount of servers the bot is in
         * @type {number}
         */
        this.servers = data.servers;
        /**
         * Amount of times the bot was invited to a server
         * @type {number}
         */
        this.invites = data.invites;
        /**
         * Amount of votes the bot has recieved
         * @type {number}
         */
        this.votes = data.votes;
        /**
         * If this bot is premium (featured) or not
         * @type {boolean}
         */
        this.premium = data.premium;
        /**
         * array of the bot's owners, the first being the primary owner
         * @type {string[]}
         */
        this.owners = data.owners;
        /**
         * timestamp in which the bot can be voted on again (requires authentication)
         * @type {number}
         */
        this.nextVote = data.nextVote || 0;
    }

}

module.exports = Bot;
