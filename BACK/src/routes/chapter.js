const express = require('express');
const router = express.Router();
const chapterCtrl = require('../controllers/chapter');

router.get('/:id', chapterCtrl.getByID);
router.get('/', chapterCtrl.getAll);
router.get('/course/:courseID', chapterCtrl.getByCourseID);
router.post('/', chapterCtrl.create);
router.get('/:chapterID/:userID', chapterCtrl.getChapterStats);

module.exports = router;