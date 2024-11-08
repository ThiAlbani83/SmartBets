import prisma from "../prismaClient.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createOrder = async (req, res) => {
  const {
    produto,
    quantidade,
    fornecedores,
    responsavel,
    enviarPara,
    motivoCompra,
  } = req.body;
  const files = req.files;

  try {
    const newOrder = await prisma.order.create({
      data: {
        produto,
        quantidade: parseInt(quantidade),
        fornecedores: JSON.stringify(fornecedores),
        responsavel,
        enviarPara,
        motivoCompra,
        status: "Pendente",
      },
    });
    if (files && files.length > 0) {
      const uploadDir = path.join(__dirname, "../../frontend/files");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      for (const file of files) {
        const fileExtension = path.extname(file.originalname);
        const uniqueFileName = `${path.basename(
          file.originalname,
          fileExtension
        )}_${uuidv4()}${fileExtension}`;
        const filePath = path.join(uploadDir, uniqueFileName);
        fs.renameSync(file.path, filePath);

        await prisma.orderOrcamento.create({
          data: {
            orderId: newOrder.id,
            fileName: uniqueFileName,
          },
        });
      }
    }
    res.status(201).json(newOrder);
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

// Serve files
export const getFile = (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, "../../frontend/files", filename);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).json({ message: "File not found" });
    }
    res.download(filePath);
  });
};

export const getOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany();
    return res.status(200).json(orders);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erro ao buscar pedidos", error: error.message });
  }
};

export const updateOrder = async (req, res) => {
  const { id } = req.params;
  const { status, enviarPara } = req.body; // Ensure these are strings
  try {
    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(id) },
      data: { 
        status,       // Directly assign status
        enviarPara    // Directly assign enviarPara
      }
    });
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await prisma.order.delete({
      where: { id: parseInt(id) },
    });
    return res.status(200).json(order);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erro ao deletar o pedido", error: error.message });
  }
};

export const getActiveOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        status: {
          in: ["Pendente", "Em Análise"],
        },
      },
      include: { orcamentos: true },
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { orcamentos: true },
    });
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCompletedOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        status: {
          in: ["Aprovado", "Reprovado"],
        },
      },
      include: { orcamentos: true },
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
