const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const themeSchema = mongoose.Schema({
    name: { type: String, required: true, unique: true },
    labelFR: { type: String, required: true },
    labelEN: { type: String, required: true },
    base64Icon: { type: String, required: true },
});

themeSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Theme', themeSchema);
