const express = require('express');
const router = express.Router();
const POICtrl = require('../controllers/POI');

router.get('/:id', POICtrl.getByID);
router.get('/chapter/:chapterID', POICtrl.getByChapterID);
router.get('/course/:courseID', POICtrl.getByCourseID);
router.post('/', POICtrl.create);
router.post('/many', POICtrl.createMany);
router.get('/delete/all/pois', POICtrl.deleteAllPOIs);

module.exports = router;