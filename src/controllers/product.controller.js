import Producto from "../models/Product.js";

// Traer todos los productos activos, el total, y los datos del usuario y categoría
const getProducts = async (req, res) => {
  try {
    const productos = await Producto.find({ estado: true })
      .populate("usuario", "email username role")
      .populate("categoria", "nombre");
    const total = await Producto.countDocuments({ estado: true });

    return res.status(200).json({
      ok: true,
      total,
      productos,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error.message,
    });
  }
};

// Crear producto
const addProduct = async (req, res) => {
  try {
    const { estado, usuario, ...body } = req.body;
    body.nombre = body.nombre.toUpperCase();

    const validarNombre = await Producto.findOne({ nombre: body.nombre });

    if (validarNombre) {
      return res.status(400).json({
        ok: false,
        message: `El producto ${body.nombre} ya existe`,
      });
    }

    body.usuario = req.user._id;

    const producto = new Producto(body);
    await producto.save();

    return res.status(201).json({
      ok: true,
      message: "¡Producto guardado!",
      producto,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error.message,
    });
  }
};

// Actualiza producto
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado, usuario, ...rest } = req.body;

    const existeProducto = await Producto.findById(id);

    if (!existeProducto) {
      return res.status(400).json({
        ok: false,
        message: `El id ${id} no existe`,
      });
    }

    if (!existeProducto.estado) {
      return res.status(400).json({
        ok: false,
        message: `El producto ${existeProducto.nombre} no está activo`,
      });
    }

    if (rest.nombre) {
      rest.nombre = rest.nombre.toUpperCase();
      const validarNombre = await Producto.findOne({ nombre: rest.nombre });
      if (validarNombre && validarNombre._id.toString() !== id) {
        return res.status(400).json({
          ok: false,
          message: `Ya existe un producto con el nombre ${rest.nombre}`,
        });
      }
    }

    rest.usuario = req.user._id;

    const producto = await Producto.findByIdAndUpdate(id, rest, {
      returnDocument: "after",
    }).populate("categoria", "nombre");

    return res.status(200).json({
      ok: true,
      message: "Producto actualizado",
      producto,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error.message,
    });
  }
};

// Borrado  de producto
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const existeProducto = await Producto.findById(id);

    if (!existeProducto) {
      return res.status(400).json({
        ok: false,
        message: `El id ${id} no existe`,
      });
    }

    if (!existeProducto.estado) {
      return res.status(400).json({
        ok: false,
        message: `El producto ya se encuentra inactivo`,
      });
    }

    const productoBorrado = await Producto.findByIdAndUpdate(
      id,
      { estado: false },
      { returnDocument: "after" }
    );

    return res.status(200).json({
      ok: true,
      message: "Producto eliminado",
      productoBorrado,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error.message,
    });
  }
};

export { getProducts, addProduct, updateProduct, deleteProduct };