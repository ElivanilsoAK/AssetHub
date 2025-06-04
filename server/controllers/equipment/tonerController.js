// server/controllers/equipment/tonerController.js
const Toner = require('../../models/Toner'); // Certifique-se de que o modelo está correto
const { Op } = require('sequelize');

// Função para obter todos os toners
exports.getAllToners = async (req, res) => {
  try {
    const { search, color, status } = req.query;
    let whereClause = {};

    if (search) {
      whereClause = {
        ...whereClause,
        [Op.or]: [
          { model: { [Op.iLike]: `%${search}%` } },
          { identificationCode: { [Op.iLike]: `%${search}%` } },
          { compatiblePrinters: { [Op.iLike]: `%${search}%` } }, // Busca também em impressoras compatíveis
          { notes: { [Op.iLike]: `%${search}%` } },
        ],
      };
    }

    if (color) {
      whereClause.color = color;
    }

    if (status) {
      whereClause.status = status;
    }

    const toners = await Toner.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json(toners);
  } catch (error) {
    console.error('Erro ao buscar toners:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao buscar toners.' });
  }
};

// Função para obter toner por ID
exports.getTonerById = async (req, res) => {
  try {
    const toner = await Toner.findByPk(req.params.id);
    if (!toner) {
      return res.status(404).json({ message: 'Toner não encontrado.' });
    }
    res.status(200).json(toner);
  } catch (error) {
    console.error('Erro ao buscar toner por ID:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao buscar toner.' });
  }
};

// Função para criar um novo toner
exports.createToner = async (req, res) => {
  try {
    const newToner = await Toner.create(req.body);
    res.status(201).json(newToner);
  } catch (error) {
    console.error('Erro ao criar toner:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao criar toner.' });
  }
};

// Função para atualizar um toner existente
exports.updateToner = async (req, res) => {
  try {
    const [updatedRows] = await Toner.update(req.body, {
      where: { id: req.params.id }
    });
    if (updatedRows === 0) {
      return res.status(404).json({ message: 'Toner não encontrado para atualização.' });
    }
    res.status(200).json({ message: 'Toner atualizado com sucesso!' });
  } catch (error) {
    console.error('Erro ao atualizar toner:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao atualizar toner.' });
  }
};

// Função para deletar um toner
exports.deleteToner = async (req, res) => {
  try {
    const deletedRows = await Toner.destroy({
      where: { id: req.params.id }
    });
    if (deletedRows === 0) {
      return res.status(404).json({ message: 'Toner não encontrado para exclusão.' });
    }
    res.status(200).json({ message: 'Toner excluído com sucesso!' });
  } catch (error) {
    console.error('Erro ao excluir toner:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao excluir toner.' });
  }
};