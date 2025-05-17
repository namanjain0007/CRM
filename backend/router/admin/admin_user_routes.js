//import express framework
const express = require("express"); // import express
const router = express.Router(); // create router
const adminUserController = require("../../controllers/admin/admin_controller"); // import admin user controller

//admin users CRUD routes
router.post("/", adminUserController.createUser);
router.get("/", adminUserController.getAllUsers);
router.get("/:id", adminUserController.getUserById);
router.patch("/:id", adminUserController.updateUser);
router.delete("/:id", adminUserController.deleteUser);

module.exports = router;
