import User from "../models/User.js";
import { sendVerificationEmail } from "../config/nodemailer.js";
import { generateToken } from "../utils/jwt.js";

const getUsers = async (req, res) => {
  const users = await User.find();

  res.json({
    ok: true,
    users,
  });
};

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    //Crear el usuario
    const user = new User({ username, email, password });

    //Generar el código de verificación
    const verificationCode = user.generateVerificationCode();
    // console.log(verificationCode);
    //Guardar el usuario
    await user.save();

    //Enviar el mail de verificación
    await sendVerificationEmail(email, username, verificationCode);
    //mandar respuesta
    return res.status(201).json({
      ok: true,
      msg: "Usuario creado!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        ok: false,
        message: "Credenciales incorrectas",
      });
    }

    //chequear que el password coincida
    const isPasswordValid = user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(403).json({
        ok: false,
        message: "Credenciales incorrectas",
      });
    }

    //chequear si tiene el código verificado
    if (!user.emailVerifed) {
      return res.status(403).json({
        ok: false,
        message: "El email no está verificado",
      });
    }

    //generar el token de verificación
    const token = generateToken(user._id);
    //Guardar el token en las cookies
    //HttpOnly

    //Iniciar sesión
    return res.status(200).json({
      ok: true,
      message: "Login exitoso!!",
      token,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error.message,
    });
  }
};

//Verificar el código
const verifyEmail = async (req, res) => {
  try {
    const { code, email } = req.body;

    //1) buscar el usuario por su email
    const user = await User.findOne({ email });

    //verifico que el usuario exista
    if (!user) {
      return res.status(404).json({
        ok: false,
        message: "Usuario no encontrado",
      });
    }

    //Verifico el código
    if (user.verificationCode !== code) {
      return res.status(400).json({
        ok: false,
        message: "Código de verificación incorrecto",
      });
    }

    //verificar si el código expiró
    if (user.verificationCodeExpires < Date.now()) {
      return res.status(400).json({
        ok: false,
        message: "El código de verificación ya expiró",
      });
    }

    //marcar el email como verificado y realizar limpieza de código
    user.emailVerifed = true;
    user.verificationCode = null;
    user.verificationCodeExpires = null;

    //guardar los cambios
    await user.save();

    //devolver mensaje ok
    return res.status(200).json({
      ok: true,
      message: "Email verificado correctamente",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      error: error.message,
    });
  }
};

export { getUsers, register, login, verifyEmail };
