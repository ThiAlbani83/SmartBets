import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.routes.js";
import productsRoutes from "./routes/products.routes.js";
import suppliersRoutes from "./routes/suppliers.routes.js";
import ordersRoutes from "./routes/orders.routes.js";
import filesRoutes from "./routes/files.routes.js";

dotenv.config();

const app = express();

// Domínios que você quer liberar
const allowedOrigins = [
  "http://localhost:5173",
  "http://89.116.74.250:5173",
];

// Opções de CORS
const corsOptions = {
  origin: (origin, callback) => {
    // origin === undefined em chamadas same-origin ou via curl/postman
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Não permitido pelo CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true, 
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    // Se você realmente usa esses headers no cliente, adicione-os aqui:
    "X-API-SECRET",
    "X-API-KEY",
  ],
  optionsSuccessStatus: 204, // para navegadores antigos
};

app.use(cors(corsOptions));
// Garante que o Express responda ao preflight OPTIONS em TODAS as rotas:
app.options("*", cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

// Servir arquivos estáticos
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/files", express.static(path.join(__dirname, "../frontend/files")));

// Rotas da API
app.use("/api/auth", authRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/suppliers", suppliersRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/sigap", filesRoutes);

export default app;
