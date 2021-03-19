module.exports = app => {
    const game = require("../controllers/game.controller.js");

    let router = require("express").Router();

    // Create a new Game and generate join code
    router.post("/", game.create);

    // Join game with join code and device ID
    router.post("/join", game.joinGame);


    app.use('/api/game', router);
};
