const uniqueValidator = require('mongoose-unique-validator');

module.exports = mongoose => {
    const gameSchema = mongoose.Schema(
        {
            joinCode: {type: String, unique: true, required: true},
            deviceIds: {type: Set, unique: false, required: true}
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
