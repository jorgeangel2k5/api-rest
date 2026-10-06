import Router from "express";

import {
  getUsers,
  login,
  register,
  verifyEmail,
} from "../controllers/auth.controller.js";

const router = Router();

router.get("/", getUsers);
router.post("/register", register);
router.post("/login", login);
router.post("/verify-email", verifyEmail);

export default router;
