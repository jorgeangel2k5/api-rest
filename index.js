import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { dbConnect } from "./src/config/database.js";
import authRoutes from "./src/routes/auth.routes.js";
import categoryRoutes from "./src/routes/category.routes.js";
import productoRoutes from "./src/routes/product.routes.js";
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());
app.use(cookieParser());

//Rutas
app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoutes);
//ruta de producto
app.use("/api/productos", productoRoutes);
await dbConnect();

app.listen(PORT, () => console.log(`Server online en puerto: ${PORT}`));
