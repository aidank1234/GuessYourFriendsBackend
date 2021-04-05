const db = require("../models");
const Game = db.game;
const jwt = require('jsonwebtoken');

function makeJoinCode(length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
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

    let joinCode = "";
    const tmpJoin = makeJoinCode(5);
    Game.findOne({joinCode: tmpJoin})
        .then(game => {
            if (game == null) {
                joinCode = tmpJoin;
                // Create a Game
                const game = new Game({
                    joinCode: joinCode,
                    deviceIds: [req.body.hostDeviceId]
                });

                // Save game in the database
                game
                    .save(game)
                    .then(data => {
                        // Return new game data and jwt
                        res.json({game: data, token: jwt.sign({_id: game._id, joinCode: game.joinCode}, 'GYFServer')});
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

    Game.findOneAndUpdate({joinCode: req.body.joinCode}, {$push: {deviceIds: req.body.newDeviceId}})
        .then(data => {
            res.json({game: data, token: jwt.sign({_id: data._id, joinCode: data.joinCode}, 'GYFServer')});
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
          res.json({game: data, token: jwt.sign({_id: data._id, joinCode: data.joinCode}, 'GYFServer')});
      })
      .catch(err => {
          res.status(500).send({
              message: err.message || "An error occurred while getting the game"
          });
      });
};
