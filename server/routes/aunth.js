const express = require('express');
const aunthController = require('../controllers/auntControllers');

const router = express.Router();

router.post('/login', aunthController.login);

router.post('/signup', aunthController.signup);

module.exports = router;
