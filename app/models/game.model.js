const uniqueValidator = require('mongoose-unique-validator');

module.exports = mongoose => {
    const gameSchema = mongoose.Schema(
        {
            joinCode: {type: String, unique: true, required: true},
            deviceIds: {type: Array, unique: false, required: true},
            started: {type: Boolean, unique: false, required: false, default: false},
            readyPlayers: {type: Array, unique: false, required: false, default: []},
            gameStartTime: {type: Date, unique: false, required: false, default: null},
            questionSet: {type: String, unique: false, required: true},
            questions: {type: Array, unique: false, required: true},
            votesByQuestion: {type: Array, unique: false, required: false, default: []},
            nextQuestionStartTime: {type: Date, unique: false, required: false, default: null},
            showScoreTime: {type: Date, unique: false, required: false, default: null}
        },
        {timestamps: true}
    );
    gameSchema.plugin(uniqueValidator, { message: '{PATH} has already been used.' });


    const Game = mongoose.model(
        "game",
        gameSchema
    );

    return Game;
};
