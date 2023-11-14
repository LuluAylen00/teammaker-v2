const express = require("express");
const router = express.Router();

const mainController = require("../controllers/main-controller");

router.get('/', mainController.home);

router.get('/api/players', mainController.apiPlayers);

module.exports = router;