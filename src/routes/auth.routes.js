import Router from "express";
import { authenticate } from "../middlewares/auth.js";
import { registerValidation } from "../middlewares/validators.js";

import {
  getUsers,
  login,
  register,
  verifyEmail,
} from "../controllers/auth.controller.js";

const router = Router();

router.get("/", authenticate, getUsers);
router.post("/register", registerValidation(), register);
router.post("/login", login);
router.post("/verify-email", verifyEmail);

export default router;
