module.exports = app => {
    const questionSet = require("../controllers/questionSet.controller.js");

    let router = require("express").Router();

    // Create a new Question
    router.post("/", questionSet.create_question_set);

    // Get all question sets
    router.get("/", questionSet.get_question_sets);


    app.use('/api/questionSet', router);
};
