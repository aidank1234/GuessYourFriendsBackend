module.exports = app => {
    const game = require("../controllers/game.controller.js");

    let router = require("express").Router();

    // Create a new Game and generate join code
    router.post("/", game.create);

    // Join game with join code and device ID
    router.post("/join", game.joinGame);

    // Get game with join code
    router.post("/get", game.getGameForJoinCode);


    app.use('/api/game', router);
};
