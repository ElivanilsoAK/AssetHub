// server/controllers/equipment/mobileDeviceController.js
const MobileDevice = require('../../models/MobileDevice'); // Certifique-se de que o modelo está correto
const { Op } = require('sequelize');

// Função para obter todos os dispositivos móveis
exports.getAllMobileDevices = async (req, res) => {
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
          { operatingSystem: { [Op.iLike]: `%${search}%` } },
          { serialNumber: { [Op.iLike]: `%${search}%` } },
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

    const devices = await MobileDevice.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json(devices);
  } catch (error) {
    console.error('Erro ao buscar dispositivos móveis:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao buscar dispositivos móveis.' });
  }
};

// Função para obter dispositivo móvel por ID
exports.getMobileDeviceById = async (req, res) => {
  try {
    const device = await MobileDevice.findByPk(req.params.id);
    if (!device) {
      return res.status(404).json({ message: 'Dispositivo móvel não encontrado.' });
    }
    res.status(200).json(device);
  } catch (error) {
    console.error('Erro ao buscar dispositivo móvel por ID:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao buscar dispositivo móvel.' });
  }
};

// Função para criar um novo dispositivo móvel
exports.createMobileDevice = async (req, res) => {
  try {
    const newDevice = await MobileDevice.create(req.body);
    res.status(201).json(newDevice);
  } catch (error) {
    console.error('Erro ao criar dispositivo móvel:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao criar dispositivo móvel.' });
  }
};

// Função para atualizar um dispositivo móvel existente
exports.updateMobileDevice = async (req, res) => {
  try {
    const [updatedRows] = await MobileDevice.update(req.body, {
      where: { id: req.params.id }
    });
    if (updatedRows === 0) {
      return res.status(404).json({ message: 'Dispositivo móvel não encontrado para atualização.' });
    }
    res.status(200).json({ message: 'Dispositivo móvel atualizado com sucesso!' });
  } catch (error) {
    console.error('Erro ao atualizar dispositivo móvel:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao atualizar dispositivo móvel.' });
  }
};

// Função para deletar um dispositivo móvel
exports.deleteMobileDevice = async (req, res) => {
  try {
    const deletedRows = await MobileDevice.destroy({
      where: { id: req.params.id }
    });
    if (deletedRows === 0) {
      return res.status(404).json({ message: 'Dispositivo móvel não encontrado para exclusão.' });
    }
    res.status(200).json({ message: 'Dispositivo móvel excluído com sucesso!' });
  } catch (error) {
    console.error('Erro ao excluir dispositivo móvel:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao excluir dispositivo móvel.' });
  }
};