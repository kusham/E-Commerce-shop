const express = require('express');
const { createUser, loginUser, getAllUsers } = require('../controllers/userControllers');

const router = express.Router();

router.post("/register", createUser)
router.post("/login", loginUser)
router.get("/allUsers", getAllUsers)

module.exports = router; 