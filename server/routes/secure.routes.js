const express = require("express");
const router = express.Router();

// Require the controllers
const secure_controller = require("../controllers/secure.controller");
const api_controller = require("../controllers/api.controller");

// Test the API
router.get("/test", secure_controller.test);

// Used to create lists for secure users
router.post("/create_list", api_controller.verifyToken, secure_controller.create_list); 

// Used to get a lists for secure users
router.get("/get_list/:id", api_controller.verifyToken, secure_controller.get_list); 

// Used to update lists for secure users
router.patch("/add_destination", api_controller.verifyToken, secure_controller.add_destination); 

// Used to update a lists for secure users
router.patch("/update_list", api_controller.verifyToken, secure_controller.update_list); 

// Used to delete a lists for secure users
router.delete("/delete_list", api_controller.verifyToken, secure_controller.delete_list); 

// Used to delete a specific destination from a list
router.delete("/list/item", api_controller.verifyToken, secure_controller.remove_destination); 

// Used to create a review on a list
router.post("/add_review", api_controller.verifyToken, secure_controller.add_review); 

// Used to get a review on a list
router.get("/get_review/:id", api_controller.verifyToken, secure_controller.get_review); 

// Export the router
module.exports = router;