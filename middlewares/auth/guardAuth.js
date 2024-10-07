const jwt = require("jsonwebtoken");
const guardModel = require("../../models/guard.model");

const guardAuthentication = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    req.guardId = decoded.id;

    const guard = await guardModel.findById(req.guardId);

    if (!guard) {
      return res.status(404).json({ message: "Guard not found" });
    }

    req.guard = guard;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = guardAuthentication;
