const pool = require("../../database/postgres"); //import pool from postgres.js

const createLead = async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: "No data provided" });
  }
  const {
    name,
    email,
    mobile,
    service,
    address,
    source_url,
    utm_params,
    form_token, //form_token is used to verify the form submission
  } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }
  if (!mobile) {
    return res.status(400).json({ error: "Mobile is required" });
  }
  if (!service) {
    return res.status(400).json({ error: "Service is required" });
  }
  if (!source_url) {
    return res.status(400).json({ error: "Source URL is required" });
  }
  if (!utm_params) {
    return res.status(400).json({ error: "UTM Params are required" });
  }

  if (!form_token) {
    return res.status(400).json({ error: "Form token is required" });
  }
  if (!address) {
    return res.status(400).json({ error: "Address is required" });
  }

  const admin = await pool.query(
    "SELECT admin_id,role FROM admin_users WHERE form_token = $1",
    [form_token]
  );

  if (admin.rows.length === 0) {
    return res.status(404).json({ error: "Admin_user not found" });
  }

  if (admin.rows[0].role !== "admin") {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const result = await pool.query(
      "INSERT INTO leads (name, email, mobile, service,address,source_url,utm_params,status,assigned_to) VALUES ($1, $2, $3, $4,$5,$6,$7,$8,$9) RETURNING *",
      [
        name,
        email,
        mobile,
        service,
        address,
        source_url,
        utm_params,
        "new", //status is set to "new" by default
        admin.rows[0].admin_id, //assigned_to is the admin_id of the admin user who created the lead. It is retrieved from the admin_users table using the form_token.
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllLeads = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM leads");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getLeadById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM leads WHERE lead_id = $1", [
      id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Lead not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateLead = async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: "No data provided" });
  }
  const { id } = req.params;

  const {
    name,
    email,
    mobile,
    service,
    address,
    source_url,
    utm_params,
    status,
    assigned_to,
  } = req.body;
  const oldData = await pool.query("SELECT * FROM leads WHERE lead_id = $1", [
    id,
  ]); //get old data from db to compare with new data

  const admin_id = await pool.query(
    "SELECT * FROM admin_users WHERE admin_id = $1",
    [assigned_to]
  );

  if (admin_id.rows.length === 0) {
    return res.status(404).json({ error: "Admin_user not found" });
  }
  // if (admin_id.rows[0].role !== "admin") {
  //   return res.status(401).json({ error: "Unauthorized" });
  // }

  try {
    const result = await pool.query(
      "UPDATE leads SET name = $1, email = $2, mobile = $3, service = $4,address=$5,source_url=$6,utm_params=$7,status=$8,assigned_to=$9 WHERE lead_id = $10 RETURNING *",
      [
        name || oldData.rows[0].name,
        email || oldData.rows[0].email,
        mobile || oldData.rows[0].mobile,
        service || oldData.rows[0].service,
        address || oldData.rows[0].address,
        source_url || oldData.rows[0].source_url,
        utm_params || oldData.rows[0].utm_params,
        status || oldData.rows[0].status,
        assigned_to || oldData.rows[0].assigned_to,
        id,
      ]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Lead not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteLead = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM leads WHERE lead_id = $1", [
      id,
    ]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Lead not found" });
    }
    res.json({ message: "Lead deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createLead,
  getAllLeads,
  getLeadById,
  updateLead,
  deleteLead,
};
