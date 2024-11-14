import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import prisma from "../prismaClient.js";
import nodemailer from "nodemailer";

console.log("Auth controller loaded");

export const registerUser = async (req, res) => {
  const { email, password, name, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role,
      },
    });
    return res.status(201).json({
      success: true,
      user: newUser,
    });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

export const toggleUserStatus = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: { active: !user.active },
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao atualizar status do usuário", error });
  }
};
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Usuário não encontrado" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Senha incorreta" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 3600000, // 1 hour
    });

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: "Erro do servidor", error });
  }
};

export const logoutUser = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logout feito com sucesso" });
};

export const checkAuth = (req, res) => {
  const userId = req.userId; // Esse valor foi inserido pelo middleware verifyToken

  if (!userId) {
    return res.status(401).json({ message: "Não autorizado" });
  }

  if (!isValidUserId(userId)) {
    return res.status(401).json({ message: "ID do usuário inválido" });
  }

  res.status(200).json({
    message: "Usuário autenticado",
    user: {
      id: userId,
    },
  });
};

export const inviteUser = async (req, res) => {
  const { email, role, name } = req.body;
  const token = jwt.sign({ email, role, name }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
  const inviteLink = `http://localhost:5173/register/${token}`;

  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "tropicalize.br@gmail.com",
      pass: "wkrd mfzl vdky mlim",
    },
  });

  let mailOptions = {
    from: '"Tropicalize" <tropicalize.br@gmail.com>',
    to: email,
    subject: "Convite para Registro",
    html: `
      <h3>Olá ${name},</h3>
      <p>Você foi convidado a se registrar no nosso sistema. Clique no link abaixo para continuar:</p>
      <a href="${inviteLink}">Registrar-se</a>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: "Convite enviado com sucesso!" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao enviar convite" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar usuários" });
  }
};

export const registerInvitedUser = async (req, res) => {
  const { token, password } = req.body;
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { email, role, name } = decoded;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: "User already exists" 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role,
      },
    });

    return res.status(201).json({
      success: true,
      user: newUser,
    });
  } catch (err) {
    console.error('Server error:', err); // Add this to see server-side error
    return res.status(400).json({ success: false, message: err.message });
  }
};
