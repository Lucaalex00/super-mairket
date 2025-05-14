import jwt from "jsonwebtoken";
import User from "../models/userModel.js"; // importa il tuo modello utente

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // ✅ Carica l'utente dal DB, escludendo la password
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(404).json({ message: "Utente non trovato" });
      }

      req.user = user;
      next();
    } catch (err) {
      console.error("Token non valido:", err);
      return res
        .status(401)
        .json({ message: "Token non valido, accesso negato" });
    }
  } else {
    return res
      .status(401)
      .json({ message: "Non autorizzato, token non trovato" });
  }
  // Se il token non è presente
  if (!token) {
    res.status(401).json({ message: "Non autorizzato, token non trovato" });
  }
};
