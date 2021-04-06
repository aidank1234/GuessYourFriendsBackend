module.exports = app => {
    const question = require("../controllers/question.controller.js");

    let router = require("express").Router();

    // Create a new Question
    router.post("/create", question.insert_batch_questions);

    // Get questions from database by question set and # of rounds
    router.get("/", question.get_questions_for_set);


    app.use('/api/question', router);
};
