import { validationResult, check } from "express-validator";
import User from "../models/User.js";
import Categoria from "../models/category.js";

export const handleValidationErrors = (req, res, next) => {
  //preguntar si no hay errores
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      ok: false,
      errors: errors.mapped(),
    });
  }
  next();
};

//validar Registro
export const registerValidation = () => [
  check("username")
    .notEmpty()
    .withMessage("El nombre de usuario no puede estar vacío")
    .custom(async (value) => {
      const user = await User.findOne({ username: value });
      if (user) {
        throw new Error("El usuario ya existe");
      }
    }),
  //validar email
  check("email")
    .isEmail()
    .withMessage("Ingresar un email válido")
    .custom(async (value) => {
      const user = await User.findOne({ email: value });
      if (user) {
        throw new Error("El email ya está registrado");
      }
    })
    .normalizeEmail(),
  //validar password
  // check("password")
  //   .isLength({ min: 6 })
  //   .withMessage("La contraseña debe tener como mínimo 6 caracteres")
  //   .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
  //   .withMessage("La contraseña debe tener mayúsculas, minúsculas y números"),
  // handleValidationErrors,
];

//Validar Login
export const loginValidation = () => [
  check("email")
    .trim()
    .isEmail()
    .withMessage("Por favor, ingrese un email válido")
    .normalizeEmail(),

  // handleValidationErrors,
];

export const validationPassword = () => [
  check("password")
    .notEmpty()
    .withMessage("La contraseña es requerida")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener como mínimo 6 caracteres")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("La contraseña debe tener mayúsculas, minúsculas y números"),
  // handleValidationErrors,
];

//validación de código email
export const verifyEmailValidation = () => [
  check("code")
    .notEmpty()
    .withMessage("El código de verificación es necesario")
    .trim()
    .isLength({ min: 6, max: 6 })
    .withMessage("El código debe tener 6 dígitos")
    .isNumeric()
    .withMessage("El código debe ser un número"),
  check("email")
    .notEmpty()
    .withMessage("El correo es requerido")
    .trim()
    .isEmail()
    .withMessage("Ingrese un email válido")
    .custom(async (value) => {
      const user = await User.findOne({ email: value });
      if (user.emailVerifed) {
        throw new Error("El email ya está verificado");
      }
    })
    .normalizeEmail(),
  handleValidationErrors,
];

//Validar rol de admin
export const validarRolAdmin = (req, res, next) => {
  const rol = req.user.role;

  if (rol !== "admin") {
    return res.status(401).json({
      ok: false,
      message: "No tiene permisos para estra acción",
    });
  }

  next();
};

//validar categoría por su id
export const validarCategoriaPorId = async (id) => {
  const existeCategoria = await Categoria.findById(id);

  if (!existeCategoria) {
    throw new Error("No existe una categoría con ese id");
  }
};
