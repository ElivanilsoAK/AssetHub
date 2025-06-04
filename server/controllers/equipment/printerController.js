// server/controllers/equipment/printerController.js
const Printer = require('../../models/Printer'); // Certifique-se de que o modelo está correto
const { Op } = require('sequelize');

// Função para obter todas as impressoras
exports.getAllPrinters = async (req, res) => {
  try {
    const { search, type, status } = req.query;
    let whereClause = {};

    if (search) {
      whereClause = {
        ...whereClause,
        [Op.or]: [
          { brand: { [Op.iLike]: `%${search}%` } },
          { model: { [Op.iLike]: `%${search}%` } },
          { identificationCode: { [Op.iLike]: `%${search}%` } },
          { serialNumber: { [Op.iLike]: `%${search}%` } },
          { ipAddress: { [Op.iLike]: `%${search}%` } },
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

    const printers = await Printer.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json(printers);
  } catch (error) {
    console.error('Erro ao buscar impressoras:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao buscar impressoras.' });
  }
};

// Função para obter impressora por ID
exports.getPrinterById = async (req, res) => {
  try {
    const printer = await Printer.findByPk(req.params.id);
    if (!printer) {
      return res.status(404).json({ message: 'Impressora não encontrada.' });
    }
    res.status(200).json(printer);
  } catch (error) {
    console.error('Erro ao buscar impressora por ID:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao buscar impressora.' });
  }
};

// Função para criar uma nova impressora
exports.createPrinter = async (req, res) => {
  try {
    const newPrinter = await Printer.create(req.body);
    res.status(201).json(newPrinter);
  } catch (error) {
    console.error('Erro ao criar impressora:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao criar impressora.' });
  }
};

// Função para atualizar uma impressora existente
exports.updatePrinter = async (req, res) => {
  try {
    const [updatedRows] = await Printer.update(req.body, {
      where: { id: req.params.id }
    });
    if (updatedRows === 0) {
      return res.status(404).json({ message: 'Impressora não encontrada para atualização.' });
    }
    res.status(200).json({ message: 'Impressora atualizada com sucesso!' });
  } catch (error) {
    console.error('Erro ao atualizar impressora:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao atualizar impressora.' });
  }
};

// Função para deletar uma impressora
exports.deletePrinter = async (req, res) => {
  try {
    const deletedRows = await Printer.destroy({
      where: { id: req.params.id }
    });
    if (deletedRows === 0) {
      return res.status(404).json({ message: 'Impressora não encontrada para exclusão.' });
    }
    res.status(200).json({ message: 'Impressora excluída com sucesso!' });
  } catch (error) {
    console.error('Erro ao excluir impressora:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao excluir impressora.' });
  }
};