import prisma from "../prismaClient.js";

export const registerSupplier = async (req, res) => {
  const { nome, cnpj, email, telefone, website, categoria, rua, bairro, cidade, estado, pais, cep, descricao } = req.body;

  if (!nome || !cnpj || !email) {
    return res.status(400).json({ message: "Preencha todos os campos obrigatórios" });
  }

  try {
    const newSupplier = await prisma.supplier.create({
      data: {
        nome,
        cnpj,
        email,
        telefone,
        website,
        categoria,
        rua,
        bairro,
        cidade,
        estado,
        pais,
        cep,
        descricao
      },
    });

    res.status(201).json(newSupplier);
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

export const searchSuppliers = async (req, res) => {
  try {
    const suppliers = await prisma.supplier.findMany();
    return res.status(200).json(suppliers);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao buscar fornecedores", error: error.message });
  }
};

export const deleteSupplier = async (req, res) => {
  const { id } = req.params;
  try {
    const supplier = await prisma.supplier.delete({
      where: { id: parseInt(id) },
    });
    return res.status(200).json(supplier);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao deletar o fornecedor", error: error.message });
  }
};

export const updateSupplier = async (req, res) => {
  const { id } = req.params;
  const { nome, cnpj, email, telefone, website, categoria, rua, bairro, cidade, estado, pais, cep, descricao } = req.body;
  try {
    const supplier = await prisma.supplier.update({
      where: { id: parseInt(id) },
      data: {
        nome,
        cnpj,
        email,
        telefone,
        website,
        categoria,
        rua,
        bairro,
        cidade,
        estado,
        pais,
        cep,
        descricao
      },
    });
    return res.status(200).json(supplier);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao atualizar o fornecedor", error: error.message });
  }
};
