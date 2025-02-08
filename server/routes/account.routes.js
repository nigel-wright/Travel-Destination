const express = require("express");
const router = express.Router();

// Require the controllers
const api_controller = require("../controllers/api.controller");
const account_controller = require("../controllers/account.controller");

// Test the API
router.get("/test", account_controller.test);

// Get an old account on login
router.post("/login", account_controller.login);

// POST a new account from register
router.post("/register", account_controller.register);

// Verify an email for registration
router.post("/verify_email", account_controller.verify_email);

// Change the password for a given user
router.put("/change_password", api_controller.verifyToken, account_controller.change_password);

// Export the router
module.exports = router;