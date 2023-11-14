const path = require('path');
const Players = require('../services/players');

const controller = {
    home: (req, res) => {
        Players.list();
        res.sendFile(path.resolve(__dirname,'../views/home.html'));
    },
    apiPlayers: (req, res) => {
        res.send(Players.list().list);
    }
}

module.exports = controller;