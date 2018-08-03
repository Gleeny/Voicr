class Vote {

    constructor(data) {
        /**
         * The ID of the voter
         * @type {string}
         */
        this.id = data.id;
        /**
         * The amount of times the voter has voted for this bot
         * @type {number}
         */
        this.count = data.count;
        /**
         * Timestamp of the last time this user voted for this bot
         * @type {number}
         */
        this.lastVote = data.lastVote;
        /**
         * Timestamp of when the user will be able to vote for this bot again
         * @type {number}
         */
        this.nextVote = data.nextVote;
    }

}

module.exports = Vote;
