const express = require("express");
const router = express.Router();

// Require the controllers
const open_controller = require("../controllers/open.controller");

// Test the API
router.get("/test", open_controller.test);

// Search for a pattern
router.get("/search", open_controller.search);

// Get the PUBLIC destination list
router.get("/list_destinations", open_controller.available_list);

// Get the PUBLIC destination list info
router.get("/list_destinations/:id", open_controller.list_details);

// Get the policy info
router.get("/policy", open_controller.policy_info); 

// Get the AUP policy info
router.get("/AUP/policy", open_controller.aup_polify);

// Get the DCMA policy info
router.get("/DCMA/policy", open_controller.dcma_policy); 

// Export the router
module.exports = router;