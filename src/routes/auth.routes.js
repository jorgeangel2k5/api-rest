import Router from "express";
import { authenticate } from "../middlewares/auth.js";
import {
  handleValidationErrors,
  loginValidation,
  registerValidation,
  validationPassword,
  verifyEmailValidation,
} from "../middlewares/validators.js";

import {
  getProfile,
  getUsers,
  login,
  logOut,
  register,
  resendCodeVerificationEmail,
  updatePassword,
  verifyEmail,
} from "../controllers/auth.controller.js";

const router = Router();

//Rutas públicas
router.post(
  "/register",
  registerValidation(),
  validationPassword(),
  handleValidationErrors,
  register,
);
router.post(
  "/login",
  loginValidation(),
  validationPassword(),
  handleValidationErrors,
  login,
);
router.post("/verify-email", verifyEmailValidation(), verifyEmail);

//Rutas protegidas
router.get("/", authenticate, getUsers);
router.post("/logout", authenticate, logOut);
router.get("/profile", authenticate, getProfile);

//Actualizar contraseña
router.put(
  "/password",
  loginValidation(),
  validationPassword(),
  handleValidationErrors,
  updatePassword,
);

// Reenviar código de verificación
router.post("/resend", loginValidation(), resendCodeVerificationEmail);
export default router;
