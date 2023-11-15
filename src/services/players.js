const path = require('path');
const fs = require('fs');
const fetch = require('node-fetch');

let file = path.resolve(__dirname, "../data/new-data.json");

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
        return await model.read().find(p => p.id == id);
    },
}

module.exports = service;