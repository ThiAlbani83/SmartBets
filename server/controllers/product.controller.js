import prisma from "../prismaClient.js";

export const registerProduct = async (req, res) => {
  const { nomeProduto, fabricante, categoriaProduto, descricao } = req.body;

  if (!nomeProduto || !fabricante || !categoriaProduto) {
    return res
      .status(400)
      .json({ message: "Preencha todos os campos obrigatórios" });
  }

  try {
    const newProduct = await prisma.product.create({
      data: {
        nomeProduto,
        fabricante,
        categoriaProduto,
        descricao,
      },
    });

    res.status(201).json(newProduct);
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

export const searchProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        suppliers: {
          include: {
            supplier: true,
          },
        },
      },
    });
    return res.status(200).json(products);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erro ao buscar produtos", error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    // First delete all relationships in ProductSupplier
    await prisma.productSupplier.deleteMany({
      where: { productId: parseInt(id) },
    });

    // Then delete the product
    const product = await prisma.product.delete({
      where: { id: parseInt(id) },
    });

    return res.status(200).json(product);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erro ao deletar o produto", error: error.message });
  }
};
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { nomeProduto, fabricante, categoriaProduto, descricao } = req.body;

  try {
    // Update product with new relationships
    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        nomeProduto,
        fabricante,
        categoriaProduto,
        descricao,
      },
    });

    return res.status(200).json(product);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erro ao atualizar o produto", error: error.message });
  }
};
