const express = require('express');
const router = express.Router();
const POICtrl = require('../controllers/POI');

router.get('/:id', POICtrl.getByID);
router.post('/', POICtrl.create);
router.post('/many', POICtrl.createMany);

module.exports = router;