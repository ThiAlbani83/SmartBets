import jwt from "jsonwebtoken";

export const verificarToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Não autorizado - Token não fornecido" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.userId) {
      throw new Error("Token inválido");
    }

    req.userId = decoded.id;
    next();
  } catch (error) {
    console.log("Erro ao validar Token:", error);
    return res.status(401).json({ success: false, message: "Token inválido" });
  }
};
