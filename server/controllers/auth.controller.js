import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import prisma from "../prismaClient.js";
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";

console.log("Auth controller loaded");

export const registerUser = async (req, res) => {
  const { email, password, name, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        id: uuidv4(),
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
      where: { id: userId },
    });
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
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
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        modules: {
          select: {
            module: {
              select: {
                id: true,
                name: true,
                description: true,
              },
            },
          },
        },
      },
    });

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

    // Clean user object before sending
    const userResponse = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      active: user.active,
      modules: user.modules.map((m) => m.module),
    };

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 3600000,
    });

    console.log("Login successful:", userResponse);
    res.status(200).json({ success: true, user: userResponse });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Erro do servidor", error: error.message });
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
  const { email, role, name, modules } = req.body;
  const token = jwt.sign(
    { email, role, name, modules },
    process.env.JWT_SECRET,
    {
      expiresIn: "24h",
    }
  );
  const inviteLink = `http://89.116.74.250:5173/register/${token}`;

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
    const { email, role, name, modules } = decoded;

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with module relationships in a single transaction
    const newUser = await prisma.$transaction(async (prisma) => {
      // Create the user first
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          role,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      // Create UserModule relationships if modules exist
      if (modules && modules.length > 0) {
        await prisma.userModule.createMany({
          data: modules.map((moduleId) => ({
            userId: user.id,
            moduleId: moduleId,
            assignedAt: new Date(),
          })),
        });
      }
      return user;
    });

    return res.status(201).json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error("Registration error:", err);
    return res.status(400).json({
      success: false,
      message: "Error registering user: " + err.message,
    });
  }
};

export const getUserModules = async (req, res) => {
  const userId = req.userId; // Assume this is set by a middleware

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        modules: { where: { active: true }, include: { module: true } },
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const activeModules = user.modules.map((userModule) => userModule.module);

    res.status(200).json(activeModules);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user modules", error });
  }
};
