import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import prisma from "../prismaClient.js";

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
  const { email, role } = req.body;
  // Gera um token com o e-mail e a função
  const token = jwt.sign({ email, role }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
  // Link de registro que será enviado por e-mail
  const inviteLink = `http://localhost:5173/signup/${token}`;

  // Configuração do Nodemailer para o servidor SMTP
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", // Ou Gmail: 'smtp.gmail.com'
    port: 587, // Porta para TLS
    secure: false, // true para 465, false para outras portas
    auth: {
      user: "tropicalize.br@gmail.com", // Seu email
      pass: "wkrd mfzl vdky mlim", // Sua senha de e-mail
    },
  });
  // Opções do e-mail (de quem, para quem, assunto, corpo do e-mail)
  let mailOptions = {
    from: '"Tropicalize" <tropicalize.br@gmail.com>', // Endereço de envio
    to: email, // Endereço do destinatário
    subject: "Convite para Registro", // Assunto do e-mail
    html: `
      <h3>Olá,</h3>
      <p>Você foi convidado a se registrar no nosso sistema. Clique no link abaixo para continuar:</p>
      <a href="${inviteLink}">Registrar-se</a>
    `,
  };

  try {
    // Enviar o e-mail
    await transporter.sendMail(mailOptions);
    res.json({ message: "Convite enviado com sucesso!" });
  } catch (error) {
    console.error("Erro ao enviar o e-mail:", error);
    res.status(500).json({ message: "Erro ao enviar convite" });
  }
};