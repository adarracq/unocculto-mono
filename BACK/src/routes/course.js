const express = require('express');
const router = express.Router();
const courseCtrl = require('../controllers/course');

router.get('/:id', courseCtrl.getByID);
router.get('/', courseCtrl.getAll);
router.post('/', courseCtrl.create);

module.exports = router;