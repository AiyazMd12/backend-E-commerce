const jwt = require("jsonwebtoken");

exports.generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      isAdmin: user.isAdmin || false,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

exports.validateUserToken = (req, res, next) => {
  let token = req.headers["authorization"];
  if (!token) return res.status(401).json({ success: false, message: "Unauthorized" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ success: false, message: "Unauthorized" });

    req.user = decoded;
    next();
  });
};

exports.validateAdminToken = (req, res, next) => {
  let token = req.headers["authorization"];
  if (!token) return res.status(401).json({ success: false, message: "Unauthorized" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err || !decoded.isAdmin) {
      return res.status(403).json({ success: false, message: "Admin access only" });
    }

    req.user = decoded;
    next();
  });
};
