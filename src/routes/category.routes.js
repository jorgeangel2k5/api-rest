import Router from "express";
import {
  addCategory,
  getCategories,
  updateCategory,
} from "../controllers/category.controller.js";
import { authenticate } from "../middlewares/auth.js";

const router = Router();

router.get("/", getCategories); //traer las categorías
router.post("/", authenticate, addCategory); //crear categoría
router.put("/:id", authenticate, updateCategory); //actualizar categoría
// router.delete("/:id", () => {}); //Inactivar categoría

export default router;
