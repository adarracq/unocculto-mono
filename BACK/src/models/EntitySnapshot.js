const mongoose = require('mongoose');

const EntitySnapshotSchema = mongoose.Schema({
    entityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Entity', required: true },
    year: { type: Number, required: true, index: true },
    geometry: {
        type: {
            type: String,
            enum: ['Polygon', 'MultiPolygon'],
            required: true
        },
        coordinates: {
            type: [[[[Number]]]],
            required: true
        }
    }
});

// Index géospatial
EntitySnapshotSchema.index({ geometry: '2dsphere' });

module.exports = mongoose.model('EntitySnapshot', EntitySnapshotSchema);