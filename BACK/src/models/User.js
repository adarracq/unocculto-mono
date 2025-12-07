const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    code: { type: Number, required: false },
    pseudo: { type: String, required: false },
    avatarID: { type: Number, required: false, default: 0 },
    unlockedAvatarIDs: { type: [Number], required: false, default: [0] },
    expoPushToken: { type: String, required: false },
    themes: { type: [String], required: false, default: [] },
    gems: { type: Number, required: false, default: 0 },
    points: { type: Number, required: false, default: 0 },
    dayStreak: { type: Number, required: false, default: 0 },
    lastCourseDate: { type: Date, required: false },
    POIsCompleted: { type: [String], required: false, default: [] },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);