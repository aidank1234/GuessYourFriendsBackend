const db = require("../models");
const QuestionSet = db.questionSet;

exports.create_question_set = (req, res) => {
    // Validate request
    if (!req.body.name) {
        res.status(400).send({message: "Content cannot be empty"});
        return;
    }

    // Create a Question set
    const questionSet = new QuestionSet({
        name: req.body.name,
    });

    // Save question set in the database
    questionSet
        .save(questionSet)
        .then(data => {
            // Return new game data and jwt
            res.json({questionSet: data});
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "An error occurred while creating the new question set"
            });
        });
};

exports.get_question_sets = (req, res) => {
    QuestionSet.find({})
        .then(sets => {
            res.json({questionSets: sets});
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "An error occurred while getting the question sets"
            });
        });
};
