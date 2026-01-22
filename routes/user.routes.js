const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// /api/signup
router.post('/signup', userController.signup);

// /api/login
router.post('/login', userController.login);

module.exports = router;