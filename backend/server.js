//import environment variables from .env file
require("dotenv").config();

//import express framework
const express = require("express");
//import cors middleware to allow cross origin requests
const cors = require("cors");
const app = express();

app.use(cors());

//middleware to parse json data
app.use(express.json());

//import admin user routes
const adminUserRoutes = require("./router/admin/admin_user_routes");
//import leads routes
const leadsRoutes = require("./router/leads/leads_routes");

//admin user CRUD routes
app.use("/admin", adminUserRoutes);

//leads CRUD routes
app.use("/leads", leadsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at ${process.env.DB_HOST}:${PORT}`);
  console.log(`http://localhost:${PORT}`);
});
