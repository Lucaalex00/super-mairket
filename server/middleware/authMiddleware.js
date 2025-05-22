import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("_id");
      next();
    } catch (error) {
      return res
        .status(401)
        .json({ message: "Non autorizzato, token non valido" });
    }
  } else {
    return res.status(401).json({ message: "Non autorizzato, token mancante" });
  }
};

export default protect;
