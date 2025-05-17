const express = require("express");
const router = express.Router();
const leadsController = require("../../controllers/leads/leads_controller");

//leads CRUD routes
router.post("/", leadsController.createLead);
router.get("/", leadsController.getAllLeads);
router.get("/:id", leadsController.getLeadById);
router.patch("/:id", leadsController.updateLead);
router.delete("/:id", leadsController.deleteLead);

module.exports = router;
