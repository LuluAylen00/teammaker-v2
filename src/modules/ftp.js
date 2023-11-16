// Importar el módulo ftp
const path = require('path');
const fs = require('fs');
var ftp = require("ftp");
require('dotenv').config()

// Crear un cliente FTP
var client = new ftp();

// Conectarse al servidor FTP
client.connect({
    host: process.env.FTP_HOST,
    user: process.env.FTP_USER,
    password: process.env.FTP_PASSWORD,
    port: process.env.FTP_PORT
});

let filename = "new-data.json"

// Exportar el cliente FTP y los métodos para tratar archivos
module.exports = {
    client: client,
    readFile: function(){
        let filePath = `/htdocs/${filename}`;
        // client.get()
        // if (!file.includes('default')) {
            let data = client.get(filePath, function (err) {
                if (err) throw err; 
                console.log("Archivo eliminado con éxito"); 
            });
            console.log(data);
            return true;
        // } else {
        //   return false;
        // }
    },
    uploadFile: function () {
        console.log("Iniciando subida..");
        let filePath = `/htdocs/${filename}`;
        client.put(path.resolve(__dirname, '../data',filename), filePath, function (err) {
            if (err) throw err; 
            console.log("Archivo subido con éxito"); 
            // fs.unlinkSync(file.path)
            return true;
        });
        return ;
    },
    deleteFile: async function () {
        let filePath = `/htdocs/${filename}`;
        
        // if (!file.includes('default')) {
            client.delete(filePath, function (err) {
                if (err) throw err; 
                console.log("Archivo eliminado con éxito"); 
            });
          return true;
        // } else {
        //   return false;
        // }
    },
};
