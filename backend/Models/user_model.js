const pool = require("../database/postgres");

const findUserByEmail = async (email) => {
  const result = await pool.query(
    "SELECT * FROM admin_users WHERE email = $1",
    [email]
  );
  return result.rows[0];
};

function generateFormToken(length = 16) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  console.log(token);
  return `form_${token}`;
}
module.exports = { findUserByEmail, generateFormToken };
