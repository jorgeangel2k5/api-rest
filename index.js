import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { dbConnect } from "./src/config/database.js";
import authRoutes from "./src/routes/auth.routes.js";
const app = express();
const PORT = 4500;

app.use(express.json());
app.use(cors());
app.use(cookieParser());

//Rutas
app.use("/api/auth", authRoutes);
// app.use("/category",)
await dbConnect();

app.listen(PORT, () => console.log(`Server online en puerto: ${PORT}`));
