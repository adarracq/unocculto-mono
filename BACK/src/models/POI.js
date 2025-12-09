const mongoose = require('mongoose');

const POISchema = mongoose.Schema({
    name: { type: String, required: true, unique: true },
    labelFR: { type: String, required: true },
    labelEN: { type: String, required: true },
    location: {
        type: { type: String, enum: ['Point'], required: true, default: 'Point' },
        coordinates: { type: [Number], required: true },
        labelFR: { type: String, required: false },
        labelEN: { type: String, required: false }
    },
    dateStart: { type: Number, required: true },
    dateEnd: { type: Number, required: false },
    chapterID: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter', index: true, required: true },
    courseID: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', index: true, required: true },
    themes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Theme' }],
    entityID: { type: mongoose.Schema.Types.ObjectId, ref: 'Entity', required: false },
    content: {
        intro: { type: String, required: false },
        bodyMarkdown: { type: String, required: false },
        media: {
            type: { type: String, enum: ['image', 'video', 'audio'], required: false },
            uri: { type: String, required: false }
        }
    },
    quiz: [{
        question: { type: String, required: false },
        answers: [{
            text: { type: String, required: false },
            isCorrect: { type: Boolean, required: false }
        }],
        explanation: { type: String, required: false }
    }]
});

// Index spatial pour trouver "les POI autour de moi" ou "dans l'écran"
POISchema.index({ location: '2dsphere' });

module.exports = mongoose.model('POI', POISchema);
