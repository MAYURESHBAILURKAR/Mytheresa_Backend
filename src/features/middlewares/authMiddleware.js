const jwt = require("jsonwebtoken");
const UserModel = require("../users/user.model");
require("dotenv").config();

const authMiddleware = async (req, res, next) => {
  const token = req.headers.token;
  
  if (!token) {
    return res.status(401).send({ message: "Token not found" });
  }
  try {
    const decoded = jwt.verify(token, process.env.signToken);
    if (!decoded) {
      return res.status(401).send({ message: "User not Authenticated" });
    }
    const userId = decoded.id;
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(401).send({ message: "User not Authenticated" });
    }
    req.userId = userId;
    // console.log(req.userId);
    next();
  } catch (error) {
    return res.status(401).send({ error: error, desc: "Auth ERROR" });
  }
};

module.exports = authMiddleware;
