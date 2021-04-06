const db = require("../models");
const Question = db.question;

exports.insert_batch_questions = (req, res) => {
    // Validate request
    if (!req.body.questionSet) {
        res.status(400).send({message: "Content cannot be empty"});
        return;
    }
    if (!req.body.questionBatch) {
        res.status(400).send({message: "Content cannot be empty"});
        return;
    }

    let documents = [];
    for(let i=0; i<req.body.questionBatch.length; i++) {
        // Create a Question set
        const question = new Question({
            questionSet: req.body.questionSet,
            questionContent: req.body.questionBatch[i]
        });

        documents.push(question);
    }

    Question.insertMany(documents)
        .then(data => {
            res.json({questions: data});
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "An error occurred while inserting questions"
            });
        });

};

exports.get_questions_for_set = (req, res) => {
    // Validate request
    if (!req.body.questionSet) {
        res.status(400).send({message: "Content cannot be empty"});
        return;
    }
    // Validate request
    if (!req.body.numRounds) {
        res.status(400).send({message: "Content cannot be empty"});
        return;
    }

    Question.find({questionSet: req.body.questionSet})
        .then(questions => {
            let questionsCopy = questions.filter(() => true);
            let questionsToReturn = [];
            const numQuestions = req.body.numRounds * 5;
            for(let i = 0; i < numQuestions; i++) {
                let rand = Math.floor(Math.random() * questionsCopy.length);
                let item = questionsCopy[Math.floor(Math.random() * questionsCopy.length)];
                questionsToReturn.push(item);
                questionsCopy.splice(rand, 1);
            }
            res.json({questions: questionsToReturn});
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "An error occurred while getting questions"
            });
        });
};
