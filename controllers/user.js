const User = require("../models/user");
const asyncHandler = require("express-async-handler");

const register = asyncHandler(async (req, res) => {
  const { email, password, firstname, lastname } = req.body;
  if (!email || !password || !lastname || !firstname)
    return res.status(400).json({
      sucess: false,
      mes: "Missing inputs",
    });

  const user = await User.findOne({
    email: email,
  });

  if (user) {
    throw new Error("User has existed! (User đã tồn tại!)"); // ném lỗi
  } else {
    const newUser = await User.create(req.body);
    return res.status(200).json({
      sucess: newUser ? true : false,
      mes: newUser
        ? "Register is successfully. Please go login"
        : "Something went wrong",
    });
  }
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({
      sucess: false,
      mes: "Missing inputs",
    });

  const response = await User.findOne({
    email: email,
  });

  if (response && (await response.isCorrectPassword(password))) {
    const { password, role, ...userData } = response.toObject();
    return res.status(200).json({
      success: true,
      userData,
    });
  } else {
    throw new Error("Invalid credentials (Xác thực không hợp lệ!)");
  }
});

module.exports = {
  register,
  login,
};
