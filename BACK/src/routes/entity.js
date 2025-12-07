const express = require('express');
const router = express.Router();
const entityCtrl = require('../controllers/entity');

router.get('/:id', entityCtrl.getByID);

module.exports = router;