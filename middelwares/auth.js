const jwt = require("jsonwebtoken");
const db = require("../config/db"); // PostgreSQL connection

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Authorization header missing or malformed" });
    }

    const token = authHeader.split(" ")[1];

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) return res.status(401).json({ error: "Invalid token" });

    // Get user from DB
    const userResult = await db.query('SELECT id, name, email FROM "User" WHERE id=$1', [decoded.id]);
    if (!userResult.rows.length) return res.status(401).json({ error: "User not found" });

    req.user = userResult.rows[0]; // Attach user to request
    next();
  } catch (err) {
    console.error(err);
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    }
    res.status(401).json({ error: "Unauthorized" });
  }
};
