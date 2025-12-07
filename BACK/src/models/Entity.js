const mongoose = require('mongoose');

const EntitySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    type: {
        type: String,
        enum: ['EMPIRE', 'TRIBE', 'KINGDOM', 'REPUBLIC', 'CULTURE'],
        default: 'EMPIRE'
    },
    primaryColor: {
        type: String,
        required: true,
        default: '#CCCCCC'
    },
    icon: { type: String },
    wikiUrl: { type: String },
}, {
    timestamps: true
});

module.exports = mongoose.model('Entity', EntitySchema);