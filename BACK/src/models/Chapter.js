const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const chapterSchema = mongoose.Schema({
    number: { type: Number, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    labelFR: { type: String, required: true },
    labelEN: { type: String, required: true },
    base64Icon: { type: String, required: true },
    dateStart: { type: Number, required: true },
    dateEnd: { type: Number, required: true },
    courseID: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', index: true },
    courseNB: { type: Number, required: true }
});

chapterSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Chapter', chapterSchema);
