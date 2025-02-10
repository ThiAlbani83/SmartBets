import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const prisma = new PrismaClient();

export const getXMLFile = (req, res) => {
  res.setHeader("Content-Type", "application/xml");
  const filePath = path.join(__dirname, "../../frontend/files/data.xml");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.log("File read error:", err);
      return res.status(404).json({ message: "XML file not found" });
    }
    res.send(data);
  });
};

export const uploadFile = async (req, res) => {
  const { company, category } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    const newFile = await prisma.sigapFiles.create({
      data: {
        nomeArquivo: file.originalname,
        data: new Date(),
        empresa: company,
        tipoArquivo: category,
        auditado: false,
        linkXML: `/uploads/${file.filename}`,
      },
    });

    // Return the created file data
    res.status(201).json({ 
      message: "File uploaded successfully", 
      file: newFile 
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const listFiles = async (req, res) => {
  const { category, company } = req.query;

  try {
    const files = await prisma.sigapFiles.findMany({
      where: {
        tipoArquivo: category,
        empresa: company,
      },
    });

    res.status(200).json(files);
  } catch (error) {
    console.error("Error listing files:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};