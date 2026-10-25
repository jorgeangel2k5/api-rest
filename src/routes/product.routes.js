import Router from "express";
import { check } from "express-validator";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import { authenticate } from "../middlewares/auth.js";
import {
  handleValidationErrors,
  validarCategoriaPorId,
} from "../middlewares/validators.js";
import Producto from "../models/Product.js";

const router = Router();

// Traer todos los productos (público)
router.get("/", getProducts);

// Crear producto (protegido con token y validaciones)
router.post(
  "/",
  [
    authenticate,
    check("nombre").notEmpty().withMessage("El nombre es obligatorio"),
    check("categoria").isMongoId().withMessage("El id de la categoría debe ser válido"),
    check("categoria").custom(validarCategoriaPorId),
    handleValidationErrors,
  ],
addProduct
);

// Actualiza producto
router.put(
  "/:id",
  [
    authenticate,
    check("id").isMongoId().withMessage("El id debe ser válido"),
    check("id").custom(async (id) => {
      const existeProd = await Producto.findById(id);
      if (!existeProd) {
        throw new Error("No existe un producto con ese id");
      }
    }),
    handleValidationErrors,
  ],
  updateProduct
);

// Eliminar producto
router.delete(
  "/:id",
  [
    authenticate,
    check("id").isMongoId().withMessage("El id debe ser válido"),
    check("id").custom(async (id) => {
      const existeProd = await Producto.findById(id);
      if (!existeProd) {
        throw new Error("No existe un producto con ese id");
      }
    }),
    handleValidationErrors,
  ],
  deleteProduct
);

export default router;