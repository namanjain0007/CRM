const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign(
    {
      admin_id: user.admin_id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

module.exports = generateToken;
