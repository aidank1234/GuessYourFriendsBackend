const uniqueValidator = require('mongoose-unique-validator');

module.exports = mongoose => {
    const questionSetSchema = mongoose.Schema(
        {
            name: {type: String, unique: true, required: true},
        },
        {timestamps: true}
    );
    questionSetSchema.plugin(uniqueValidator, { message: '{PATH} has already been used.' });


    const QuestionSet = mongoose.model(
        "questionSet",
        questionSetSchema
    );

    return QuestionSet;
};
