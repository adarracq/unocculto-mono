const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const courseSchema = mongoose.Schema({
    number: { type: Number, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    labelFR: { type: String, required: true },
    labelEN: { type: String, required: true },
    descriptionFR: { type: String, required: true },
    descriptionEN: { type: String, required: true },
    base64Icon: { type: String, required: true },
});

courseSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Course', courseSchema);
