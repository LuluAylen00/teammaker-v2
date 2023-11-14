const path = require('path');
const fs = require('fs');

let file = path.resolve(__dirname, "../data/new-data.json");

const service = {
    read: () => {
        let data = fs.readFileSync(file)
        return JSON.parse(data);
    },
    list: () => {
        let iniData = service.read()
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
    findJson: (id) => {
        return model.read().find(p => p.id == id);
    },
}

module.exports = service;