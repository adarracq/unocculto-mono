const express = require('express');
const router = express.Router();
const themeCtrl = require('../controllers/theme');

router.get('/:id', themeCtrl.getByID);
router.get('/', themeCtrl.getAll);
router.post('/', themeCtrl.createTheme);

module.exports = router;