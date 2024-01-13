const jwt = require("jsonwebtoken");
const CustomAPIError = require("../errors/custom-error");

const login = async (req, res) => {
  const { username, password } = req.body;

  //HOW TO CHECK IF THERE IS PROPER VALUES.
  // mongoose validation
  // Joi Library
  // Check in the controller
  if (!username || !password) {
    throw new CustomAPIError("Please provide email and password", 400);
  }

  // just for demo, normally provided by DB.
  const id = new Date().getDate();

  // try to keep payload small, it gives better experience for user.
  const token = jwt.sign({ id, username }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  }); // we don't provide password. in general, it's id and username.

  res.status(200).json({ msg: "user created", token });
};

const dashboard = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new CustomAPIError("No token provided", 401);
  }

  const token = authHeader.split(" ")[1];

  // Check if token is expired.
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); //we have to pass token & secret string.

    const luckyNumber = Math.floor(Math.random() * 100);

    res.status(200).json({
      msg: `Hello, ${decoded.username}`,
      secret: `Here is your authorized data, your luck number is ${luckyNumber}`,
    });
  } catch (error) {
    throw new CustomAPIError("Not authorized to access this route", 401);
  }
};

module.exports = { login, dashboard };
