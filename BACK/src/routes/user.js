const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const auth = require('../middlewares/auth');


router.post('/loginOrSignup', userCtrl.loginOrSignup);
router.post('/code', userCtrl.verifyEmailCode);
router.get('/:email', userCtrl.getUserByEmail);
router.get('/id/:id', auth, userCtrl.getUserById);
router.put('/', auth, userCtrl.updateUser);
router.put('/expoPushToken', userCtrl.updateExpoPushToken);
router.get('/verifyPseudo/:pseudo', auth, userCtrl.verifyPseudo);
router.delete('/:id', auth, userCtrl.deleteUser);

module.exports = router;