const express = require('express');
const { createUser, loginUser, getAllUsers, getSingleUser } = require('../controllers/userControllers');

const router = express.Router();

router.post("/register", createUser)
router.post("/login", loginUser)
router.get("/allUsers", getAllUsers)
router.get("/:id", getSingleUser)


module.exports = router; 