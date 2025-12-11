const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const entitySchema = mongoose.Schema({
    name: { type: String, required: true, unique: true },
    labelFR: { type: String, required: true },
    labelEN: { type: String, required: true },
    descriptionMarkDownFR: { type: String, required: true },
    descriptionMarkDownEN: { type: String, required: true },
    dateStart: { type: Number, required: true },
    dateEnd: { type: Number, required: true },
    availableSnapshots: { type: [Number], required: true },
    type: { type: String, required: true },
});

entitySchema.plugin(uniqueValidator);

module.exports = mongoose.model('Entity', entitySchema);