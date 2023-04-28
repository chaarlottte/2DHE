class Leaderboard {
    constructor(playerList) {
        this.stats = {};
        this.playerList = playerList;
    }

    addPlayerKill = (playerId) => {
        if(this.stats[playerId] == null) {
            this.createPlayerData(playerId);
        } 

        this.stats[playerId].kills += 1;
        this.stats[playerId].speed += this.playerList[playerId].speed;
    }

    createPlayerData = (playerId) => {
        if(this.stats[playerId] == null) {
            this.stats[playerId] = {
                kills: 0,
                speed: this.playerList[playerId].speed
            }
        }
    }
}

if (typeof module !== "undefined" && module.exports) {
    module.exports.Leaderboard = Leaderboard;
}