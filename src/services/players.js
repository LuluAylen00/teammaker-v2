const path = require('path');
const fs = require('fs');
const fetch = require('node-fetch');
const ftp = require('../modules/ftp');

let file = path.resolve(__dirname, "../data/new-data.json");


let version 
async function getVersion(){
    fetch("https://ddragon.leagueoflegends.com/api/versions.json")
    .then(response => response.json())
    .then(data => {
        version = data[0]
        return data[0]
    });
};
getVersion();
let urls = {
    champList: () => {      
        return `http://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion.json`
    },
    masteries: (id, apikey) => {
        return `https://la2.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${id}?api_key=${apikey}`
    },
    summonner: (name, apikey) => {
        return `https://la2.api.riotgames.com/lol/summoner/v4/summoners/by-name/${name}?api_key=${apikey}`
    },
    active: (id, apikey) => {
        return `https://la2.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/${id}?api_key=${apikey}`
    },
    spells: () => {
        return `http://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/summoner.json`
    },
    icons: () => {
        return `http://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/profileicon.json`
    }
}

const service = {
    read: async () => {
        let data = fs.readFileSync(file);
        try {
            let fetchedData = await fetch('https://team-maker.infinityfreeapp.com/new-data.json')
            let newData = await fetchedData.json();
            // console.log(newData);
            if (newData) {
                return JSON.parse(newData);
            } else {
                throw new Error("Asd");
            }
        } catch (error) {
            return JSON.parse(data);
        }
    },
    write: async (data) => {
        try {
            Promise.all(data).then(values => {
                // console.log(data.length, values.length);
                fs.writeFileSync(file, JSON.stringify(values,0,2));
                ftp.deleteFile();
                // console.log("Subiendo...");
                ftp.uploadFile();
                // console.log("Teoricamente subido...");
            })
            // console.log("para guardar",await service.read());
        } catch (error) {
            console.log(error);
            return false;
        }
        return true;
    },
    list: async () => {
        let iniData = await service.read();
        // console.log("iniData", iniData);
        let data = {
            list: iniData,
            length: iniData.length,
            total: 0
        }
        iniData.forEach((p) => {
            data.total = data.total + p.lv
        })
        // console.log(data);
        return data
    },
    findJson: async (id) => {
        return await service.read().find(p => p.id == id);
    },
    masteriesUpdateProcess: async (apikey) => {
        let players = await service.read();
        // console.log(players.length);
        let acc = [];
        let newPlayers = players.map(async (p) => {
            if (p.name != "Random") {
                // console.log(p.name);
                p.masteries = await service.findMasteriesByName(p.invocador, apikey) || p.masteries || [];
                // console.log(p.masteries[0]);
            } else {
                p.masteries = [];
            }
            // acc.push(await p);
            return p;
        })
        // console.log(acc);
        // console.log(newPlayers);
        // newPlayers
        service.write(newPlayers);
    },
    findMasteriesByName: async (invocador, apikey) => {
        let player = await service.findByName(invocador, apikey)
        // console.log("player",player);
        
        if (player.id) {
           // console.log("Todo ok");
            
            var mastery = await service.findMasteries(player.id, apikey)
            //console.log(mastery);
            
            return mastery;
        } else {
            console.log(`El usuario ${invocador} no se encuentra`);
            return []
        }
    },
    findMasteries: async (id, apikey) => {
        let champList = await service.champList();

        let acc = []
            
        for (const prop in champList.data) {
            let newObj = {
                id: champList.data[prop].key,
                name: champList.data[prop].name,
                image: champList.data[prop].image.full,
            }
            acc.push(newObj);
        }

        var mastery = await fetch(urls.masteries(id, apikey)).then((data) => data.json()).catch((err) => { console.log(err)})
        
        let finalItem = []

        function numberWithCommas(x) {
            var parts = x.toString().split(".");
            parts[0]=parts[0].replace(/\B(?=(\d{3})+(?!\d))/g,".");
            return parts.join(",");
        }
        // console.log(mastery);
        if (!mastery.status) {
            // console.log(mastery);
            mastery.forEach((item, i) => {
                //console.log(item);
                
                let newObj = {
                    id: item.championId,
                    name: acc.find(c => c.id == item.championId).name,
                    mastery: item.championLevel || 0,
                    points: numberWithCommas(item.championPoints) || 0,
                    mPosition: {
                        selected: i+1 || mastery.length+1,
                        all: mastery.length
                    },
                    image: acc.find(c => c.id == item.championId).image
                }
                finalItem.push(newObj)
            })
        }
        return finalItem;
    },
    findByName: async function(name, apikey){ // Retorna un objeto simple con los datos del perfil
        let url = urls.summonner(name, apikey)
        return fetch(url).then((data) => data.json()).catch((err) => { return "error" })
    },
    champList: async function(){ // Lista de campeones
        return fetch(urls.champList()).then((data) => data.json()).catch((err) => { return "error" })
    },
}

module.exports = service;