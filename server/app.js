import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import productsRoutes from "./routes/products.routes.js";
import suppliersRoutes from "./routes/suppliers.routes.js";
import ordersRoutes from "./routes/orders.routes.js";
import filesRoutes from "./routes/files.routes.js";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";

dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://89.116.74.250:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Permitir origens no array ou origem ausente (caso de clientes sem origin como Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);

app.use(express.json());
app.use(cookieParser());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/files", express.static(path.join(__dirname, "../frontend/files")));

// Rotas
app.use("/api/auth", authRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/suppliers", suppliersRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/sigap", filesRoutes);

export default app;
