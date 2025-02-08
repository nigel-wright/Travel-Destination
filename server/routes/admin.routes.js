const express = require("express");
const router = express.Router();

// Require the controllers
const admin_controller = require("../controllers/admin.controller");
const api_controller = require("../controllers/api.controller");

// Test the API
router.get("/test", admin_controller.test);

// Used for getting users admin privilages
router.get("/privileges", api_controller.verifyToken, api_controller.adminCheck, admin_controller.get_privileges);

// Used to set new admin privilages
router.put("/privileges/set", api_controller.verifyToken, api_controller.adminCheck, admin_controller.set_privileges)

// Used to set new admin privilages
router.put("/hide/set", api_controller.verifyToken, api_controller.adminCheck, admin_controller.set_review)

// Used for diabling and marking of account
router.get("/disable", api_controller.verifyToken, api_controller.adminCheck, admin_controller.get_disabled);

// Used to set new admin privilages
router.put("/disable/set", api_controller.verifyToken, api_controller.adminCheck, admin_controller.set_disabled)

// Export the router
module.exports = router;
