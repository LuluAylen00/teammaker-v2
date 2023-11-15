const path = require('path');
const fs = require('fs');
const Players = require('../services/players');
const ftp = require('../modules/ftp');

const controller = {
    home: (req, res) => {
        Players.list();
        res.sendFile(path.resolve(__dirname,'../views/home.html'));
    },
    apiPlayers: async (req, res) => {
        let players = await Players.list();
        // console.log(players);
        res.send(players);
    },
    apiUpdateData: async (req, res) => {
        let players = await Players.list();
        players.map((player) => {
            if (player.id == req.body.id) {
                player.name = req.body.name;
                player.invocador = req.body.invocador;
                player.lineas = [
                    {
                        rol: "sup",
                        multiplicador: Number(req.body.sup)
                    },
                    {
                        rol: "jg",
                        multiplicador: Number(req.body.jg)
                    },
                    {
                        rol: "mid",
                        multiplicador: Number(req.body.mid)
                    },
                    {
                        rol: "adc",
                        multiplicador: Number(req.body.adc)
                    },
                    {
                        rol: "top",
                        multiplicador: Number(req.body.top)
                    }
                ],
                player.lv = Number(req.body.lv);
            }
            return player;
        })
        // ftp.readFile();
        // ftp.deleteFile();
        // ftp.uploadFile();
        res.send({status: 200})
    }
}

module.exports = controller;