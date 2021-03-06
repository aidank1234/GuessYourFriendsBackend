const db = require("../models");
const Game = db.game;
const questionsController = require('./question.controller');

function makeJoinCode(length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

// Create and save a new User
exports.create = (req, res) => {
    // Validate request
    if (!req.body.hostDeviceId) {
        res.status(400).send({message: "Content cannot be empty"});
        return;
    }
    if (!req.body.questionSet) {
        res.status(400).send({message: "Content cannot be empty"});
        return;
    }
    if (req.body.hostDeviceId.length < 3) {
        res.status(400).send({message: "Nickname must be longer than 3 characters"});
        return;
    }
    if (!req.body.hostDeviceId.replace(/\s/g, '').length) {
        res.status(400).send({message: "Nickname must not only be whitespace"});
        return;
    }

    let joinCode = "";
    const tmpJoin = makeJoinCode(5);
    Game.findOne({joinCode: tmpJoin})
        .then(game => {
            if (game == null) {
                joinCode = tmpJoin;
                questionsController.get_questions_for_set(req.body.questionSet, 3)
                    .then(questions => {
                        // Create a Game
                        const game = new Game({
                            joinCode: joinCode,
                            deviceIds: [req.body.hostDeviceId],
                            questionSet: req.body.questionSet,
                            questions: questions
                        });

                        // Save game in the database
                        game
                            .save(game)
                            .then(data => {
                                // Return new game data and jwt
                                res.json({game: data});
                            })
                            .catch(err => {
                                res.status(500).send({
                                    message: err.message || "An error occurred while creating the new game"
                                });
                            });
                    })
                    .catch(err => {
                        res.status(500).send({
                            message: err.message || "An error occurred while creating the new game"
                        });
                    });
            } else {
                create(req, res);
                return;
            }
        })
        .catch(err => {
            res.status(500).send({message: err.message || "Error generating join code"});
        });
};

exports.joinGame = (req, res) => {
    // Validate request
    if (!req.body.joinCode || !req.body.newDeviceId) {
        res.status(400).send({message: "Content cannot be empty"});
        return;
    }
    if (req.body.newDeviceId.length < 3) {
        res.status(400).send({message: "Nickname must be longer than 3 characters"});
        return;
    }
    if (!req.body.newDeviceId.replace(/\s/g, '').length) {
        res.status(400).send({message: "Nickname must not only be whitespace"});
        return;
    }

    Game.findOneAndUpdate({started: false, joinCode: req.body.joinCode, deviceIds: { "$nin": [req.body.newDeviceId] }}, {$addToSet: {deviceIds: req.body.newDeviceId}})
        .then(data => {
            res.json({game: data});
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({
                message: err.message || "An error occurred while joining game"
            });
        });
};

exports.getGameForJoinCode = (req, res) => {
  if(!req.body.joinCode) {
      res.status(400).send({message: "Content cannot be empty"});
      return;
  }

  Game.findOne({joinCode: req.body.joinCode})
      .then(data => {
          res.json({game: data});
      })
      .catch(err => {
          res.status(500).send({
              message: err.message || "An error occurred while getting the game"
          });
      });
};

exports.add_to_ready = (req, res) => {
    if(!req.body.joinCode || !req.body.deviceId) {
        res.status(400).send({message: "Content cannot be empty"});
        return;
    }

    Game.findOneAndUpdate({joinCode: req.body.joinCode, readyPlayers: { "$nin": [req.body.deviceId] }}, {$addToSet: {readyPlayers: req.body.deviceId}})
        .then(data => {
            res.json({game: data});
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "An error occurred while setting player to ready"
            });
        });
};

exports.start_game = (req, res) => {
    if(!req.body.joinCode || !req.body.hostDeviceId) {
        res.status(400).send({message: "Content cannot be empty"});
        return;
    }
    let t = new Date();
    t.setSeconds(t.getSeconds() + 10);
    Game.findOneAndUpdate({joinCode: req.body.joinCode}, {started: true, gameStartTime: t, $addToSet: {readyPlayers: req.body.hostDeviceId}})
        .then(data => {
            res.json({game: data});
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "An error occurred while setting player to ready"
            });
        });
};

exports.vote = (req, res) => {
  if(!req.body.deviceId) {
      res.status(400).send({message: "Device id cannot be empty"});
      return;
  } else if(!req.body.votedFor) {
      res.status(400).send({message: "Voted for cannot be empty"});
      return;
  } else if(req.body.questionNumber === undefined) {
      res.status(400).send({message: "Question number cannot be empty"});
      return;
  } else if (!req.body.joinCode) {
      res.status(400).send({message: "Join code cannot be empty"});
      return;
  }

  Game.findOneAndUpdate({joinCode: req.body.joinCode},
      {
          $push: {votesByQuestion: {questionNumber: req.body.questionNumber, voter: req.body.deviceId, votedFor: req.body.votedFor}},
          nextQuestionStartTime: null,
      })
      .then(data => {
          res.json({game: data});
      })
      .catch(err => {
          res.status(500).send({
              message: err.message || "An error occurred while submitting vote"
          });
      });
};

exports.check_ready_next_question = (req, res) => {
  if(!req.body.joinCode || req.body.questionNumber === undefined) {
      res.status(400).send({message: "Content cannot be empty"});
      return;
  }

  Game.findOne({joinCode: req.body.joinCode, nextQuestionStartTime: null})
      .then(data => {
          if(data) {
              let counter = 0;
              for(let i=0; i<data.votesByQuestion.length; i++) {
                  if(data.votesByQuestion[i].questionNumber === req.body.questionNumber) {
                      counter = counter + 1;
                  }
              }
              if(counter === data.deviceIds.length) {
                  let t = new Date();
                  t.setSeconds(t.getSeconds() + 5);
                  Game.findOneAndUpdate({joinCode: req.body.joinCode}, {nextQuestionStartTime: t, gameStartTime: null}, {new: true})
                      .then(newData => {
                          res.json({game: newData});
                      })
                      .catch(err => {
                          res.status(500).send({
                              message: err.message || "An error occurred while waiting for all votes"
                          });
                      })
              } else {
                  res.json({game: data});
              }
          } else {
              Game.findOne({joinCode: req.body.joinCode})
                  .then(newData => {
                      res.json({game: newData});
                  })
                  .catch(err => {
                      res.status(500).send({
                          message: err.message || "An error occurred while waiting for all votes"
                      });
                  });
          }
      })
      .catch(err => {
          res.status(500).send({
              message: err.message || "An error occurred while waiting for all votes"
          });
      });
};

exports.move_to_scores = (req, res) => {
    if(!req.body.joinCode) {
        res.status(400).send({message: "Content cannot be empty"});
        return;
    }
    let t = new Date();
    t.setSeconds(t.getSeconds() + 5);
    Game.findOneAndUpdate({joinCode: req.body.joinCode}, {showScoreTime: t}, {new: true})
        .then(newData => {
            res.json({game: newData});
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "An error occurred while moving to scores screen"
            });
        });
};

exports.move_to_next_round = (req, res) => {
    if(!req.body.joinCode) {
        res.status(400).send({message: "Content cannot be empty"});
        return;
    }
    let t = new Date();
    t.setSeconds(t.getSeconds() + 5);
    Game.findOneAndUpdate({joinCode: req.body.joinCode}, {
        gameStartTime: t,
        showScoreTime: null
    }, {
        new: true
    })
        .then(newData => {
            res.json({game: newData});
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "An error occurred while moving to next round"
            });
        });

};
