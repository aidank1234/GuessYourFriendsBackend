module.exports = app => {
    const game = require("../controllers/game.controller.js");

    let router = require("express").Router();

    // Create a new Game and generate join code
    router.post("/", game.create);

    // Join game with join code and device ID
    router.post("/join", game.joinGame);

    // Get game with join code
    router.post("/get", game.getGameForJoinCode);

    // Set user to ready for the game
    router.post("/ready", game.add_to_ready);

    // Set game to started
    router.post("/start", game.start_game);

    router.post("/vote", game.vote);

    router.post("/nextQuestion", game.check_ready_next_question);

    router.post("/moveToScores", game.move_to_scores);

    router.post("/moveToNextRound", game.move_to_next_round);


    app.use('/api/game', router);
};
