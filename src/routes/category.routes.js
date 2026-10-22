import Router from "express";
import { check } from "express-validator";
import {
  addCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../controllers/category.controller.js";
import { authenticate } from "../middlewares/auth.js";
import {
  handleValidationErrors,
  validarRolAdmin,
  validarCategoriaPorId,
} from "../middlewares/validators.js";

const router = Router();

router.get("/", getCategories); //traer las categorías
router.post(
  "/",
  [
    authenticate,
    validarRolAdmin,
    check("nombre").notEmpty().withMessage("El nombre es obligatorio"),
    handleValidationErrors,
  ],
  addCategory,
); //crear categoría
router.put(
  "/:id",
  [
    authenticate,
    validarRolAdmin,
    check("id").isMongoId().withMessage("El id debe ser válido"),
    check("nombre").notEmpty().withMessage("El nombre es obligatorio"),
    check("id").custom(validarCategoriaPorId),
    handleValidationErrors,
  ],
  updateCategory,
); //actualizar categoría
router.delete(
  "/:id",
  [
    authenticate,
    validarRolAdmin,
    check("id").isMongoId().withMessage("El id debe ser válido"),
    check("id").custom(validarCategoriaPorId),
    handleValidationErrors,
  ],
  deleteCategory,
); //Inactivar categoría

export default router;
