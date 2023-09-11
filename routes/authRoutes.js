const { Router } = require('express');
const authController = require('../controllers/authController');
const slowDown = require("express-slow-down");

const router = Router();

//slow down the response to multiple requests from the same IP to protect from Brute force password guessing
const loginSpeedLimiter = slowDown({
    windowMs: 5 * 60 * 1000, 
    delayAfter: 5, 
    delayMs: 100
  });

//all routes here are under /auth route

router.post("/login", loginSpeedLimiter, authController.auth_login);

router.post("/signup", authController.auth_signup);

router.get("/logout", authController.logout);

module.exports = router;