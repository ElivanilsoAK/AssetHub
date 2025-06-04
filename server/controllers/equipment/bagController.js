const Bag = require('../../models/Bag'); // Certifique-se de que o caminho para o modelo está correto
const { Op } = require('sequelize'); // Importe Op para operadores de busca

// Função para obter todas as mochilas (com busca e filtros, se implementado)
exports.getAllBags = async (req, res) => {
  try {
    const { search, type, status } = req.query; // Obtenha parâmetros de consulta
    let whereClause = {};

    if (search) {
      whereClause = {
        ...whereClause,
        [Op.or]: [
          { brand: { [Op.iLike]: `%${search}%` } },
          { model: { [Op.iLike]: `%${search}%` } },
          { identificationCode: { [Op.iLike]: `%${search}%` } },
          { color: { [Op.iLike]: `%${search}%` } },
          { notes: { [Op.iLike]: `%${search}%` } },
        ],
      };
    }

    if (type) {
      whereClause.type = type;
    }

    if (status) {
      whereClause.status = status;
    }

    const bags = await Bag.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json(bags);
  } catch (error) {
    console.error('Erro ao buscar mochilas:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao buscar mochilas.' });
  }
};

// Função para obter mochila por ID
exports.getBagById = async (req, res) => {
  try {
    const bag = await Bag.findByPk(req.params.id);
    if (!bag) {
      return res.status(404).json({ message: 'Mochila não encontrada.' });
    }
    res.status(200).json(bag);
  } catch (error) {
    console.error('Erro ao buscar mochila por ID:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao buscar mochila.' });
  }
};

// Função para criar uma nova mochila
exports.createBag = async (req, res) => {
  try {
    const newBag = await Bag.create(req.body);
    res.status(201).json(newBag);
  } catch (error) {
    console.error('Erro ao criar mochila:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao criar mochila.' });
  }
};

// Função para atualizar uma mochila existente
exports.updateBag = async (req, res) => {
  try {
    const [updatedRows] = await Bag.update(req.body, {
      where: { id: req.params.id }
    });
    if (updatedRows === 0) {
      return res.status(404).json({ message: 'Mochila não encontrada para atualização.' });
    }
    res.status(200).json({ message: 'Mochila atualizada com sucesso!' });
  } catch (error) {
    console.error('Erro ao atualizar mochila:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao atualizar mochila.' });
  }
};

// Função para deletar uma mochila
exports.deleteBag = async (req, res) => {
  try {
    const deletedRows = await Bag.destroy({
      where: { id: req.params.id }
    });
    if (deletedRows === 0) {
      return res.status(404).json({ message: 'Mochila não encontrada para exclusão.' });
    }
    res.status(200).json({ message: 'Mochila excluída com sucesso!' });
  } catch (error) {
    console.error('Erro ao excluir mochila:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao excluir mochila.' });
  }
};