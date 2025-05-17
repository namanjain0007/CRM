const db = require("../../database/postgres");
const bcrypt = require("bcryptjs");
const {
  findUserByEmail,
  generateFormToken,
} = require("../../Models/user_model"); //import findUserByEmail function from user_model.js

// CREATE
exports.createUser = async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: "No data provided" });
  }
  const { name, email, password_hash, role } = req.body;

  if (!name || !email || !password_hash || !role) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const user = await findUserByEmail(email);
  if (user)
    return res.status(400).json({ message: "Admin_user already exists" });

  const hashedPassword = await bcrypt.hash(password_hash, 10);
  const form_token = generateFormToken();

  try {
    const result = await db.query(
      "INSERT INTO admin_users (name,email, password_hash,role,form_token) VALUES ($1,$2, $3,$4,$5) RETURNING *",
      [name, email, hashedPassword, role, form_token]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ ALL
exports.getAllUsers = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM admin_users");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ ONE
exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      "SELECT * FROM admin_users WHERE admin_id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Admin_user not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
exports.updateUser = async (req, res) => {
  if (
    // !req.body ||
    !req.body.name ||
    !req.body.email ||
    !req.body.password_hash ||
    !req.body.role
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (!req.body) return res.status(400).json({ error: "No data provided" });

  const { id } = req.params;

  const { name, email, password_hash, role } = req.body;

  try {
    const check = await db.query(
      "SELECT * FROM admin_users WHERE admin_id = $1",
      [id]
    );
    if (check.rows.length === 0) {
      return res.status(404).json({ error: "Admin_user not found" });
    }

    const hashedPassword = await bcrypt.hash(password_hash, 10);

    const result = await db.query(
      "UPDATE admin_users SET name = $1, email = $2,password_hash=$3,role=$4 WHERE admin_id = $5 RETURNING *",
      [
        name || check.rows[0].name,
        email || check.rows[0].email,
        hashedPassword,
        role || check.rows[0].role,
        id,
      ]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      "DELETE FROM admin_users WHERE admin_id = $1",
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Admin_user not found" });
    }
    res.json({ message: "Admin_user deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
