const jwt = require('jsonwebtoken');

exports.authenticate = (req, res, next)=>{
    const token = req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
        return res.status(401).json({ message: "No token. Authorization denied." });
      }
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { userId, email }
        next();
      } catch (err) {
        return res.status(401).json({ message: "Invalid token." });
      }
}