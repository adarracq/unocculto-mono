const express = require('express');
const router = express.Router();
const entitySnapshotsCtrl = require('../controllers/entitySnapshots');

// GET /api/entitySnapshots/:year
// Exemple: /api/entitySnapshots/-200 -> Renvoie tous les territoires de l'an -200
router.get('/year/:year', entitySnapshotsCtrl.getSnapshotsByYear);
router.get('/', entitySnapshotsCtrl.getAll);
router.post('/', entitySnapshotsCtrl.create);

module.exports = router;