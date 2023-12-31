const express = require("express");
const router = express.Router();

const mainController = require("../controllers/main-controller");

router.get('/', mainController.home);

router.get('/api/players', mainController.apiPlayers);

router.post('/api/edit', mainController.apiUpdateData);

router.post('/api/masteries', mainController.apiMasteriesUpdate)

module.exports = router;