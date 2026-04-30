const jwt = require("jsonwebtoken");
const prisma = require("../db");

const authenticate = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "Authentication required." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) return res.status(401).json({ message: "User not found." });
    
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token." });
  }
};

const requireRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: "Access forbidden: insufficient permissions." });
    }
    next();
  };
};

module.exports = { authenticate, requireRole };
