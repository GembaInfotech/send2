const jwt = require("jsonwebtoken");

/**
 * NOTE: This middleware for decoding JWT is not necessary when using Passport's JWT strategy.
 * Passport handles token decoding and user extraction automatically.
 */

const decodeToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log(authHeader);
  const token = authHeader.split(" ")[1];
  
  // console.log(token)
  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    req.userId = decoded.id;
    console.log(req.userId);
    
    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = decodeToken;
