const express = require('express');
const app = express();
const {resolve} = require('path');

const port = 3418;
app.listen(port, () => {
    console.log("Escuchando en puerto "+port);
});

// Middleware (app.use)
// Estos dos permiten procesar los formularios que se le envíen al servidor
app.use(express.urlencoded({extended: false}));
app.use(express.json());

const publicPath = resolve(__dirname, '../public');
const staticPath = express.static(publicPath);
app.use(staticPath);

const mainRouter = require('./routes/main-router');
app.use(mainRouter);