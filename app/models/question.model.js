const uniqueValidator = require('mongoose-unique-validator');

module.exports = mongoose => {
    const questionSchema = mongoose.Schema(
        {
            questionSet: {type: String, unique: false, required: true},
            questionContent: {type: String, unique: true, required: true}
        },
        {timestamps: true}
    );
    questionSchema.plugin(uniqueValidator, { message: '{PATH} has already been used.' });


    const Question = mongoose.model(
        "question",
        questionSchema
    );

    return Question;
};
