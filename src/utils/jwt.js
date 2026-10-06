import jwt from "jsonwebtoken";

//función generar el token
export const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

//función verificar token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_EXPIRES);
  } catch (error) {
    throw new Error("Token inválido o expirado");
  }
};
