// Importar el módulo ftp
const path = require('path');
const fs = require('fs');
var ftp = require("ftp");

// Crear un cliente FTP
var client = new ftp();

// Conectarse al servidor FTP
client.connect({
    host: "ftpupload.net", // El host del servidor FTP
    user: "if0_35425454", // El nombre de usuario del servidor FTP
    password: "oyeewyPciUh3F", // La contraseña del servidor FTP
    port: "21",
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
