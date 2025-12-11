const express = require('express');
const router = express.Router();
const entityCtrl = require('../controllers/entity');

router.get('/:id', entityCtrl.getByID);
router.get('/', entityCtrl.getAll);
router.post('/', entityCtrl.create);

module.exports = router;