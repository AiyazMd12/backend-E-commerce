const userModel = require("../models/user");
const { generateToken } = require("../middleware/auth");

exports.validateUser = async (req, res) => {
  const userId = req.body.userId;

  try {
    const user = await userModel.findById(userId);

    if (!user || !user.isActive) {
      return res.status(403).json({ success: false, message: "User is not verified or does not exist" });
    }

    const token = generateToken(user);

    return res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (err) {
    console.log("Validate User Error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
