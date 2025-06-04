const { Computer, User } = require('../../models');
const { Op } = require('sequelize');

// Obter todos os computadores
exports.getAllComputers = async (req, res) => {
  try {
    const { search, type, status, brand, sortBy, sortOrder } = req.query;
    
    // Construir condições de busca
    const whereConditions = {};
    
    // Adicionar filtro de busca
    if (search) {
      whereConditions[Op.or] = [
        { brand: { [Op.like]: `%${search}%` } },
        { model: { [Op.like]: `%${search}%` } },
        { serialNumber: { [Op.like]: `%${search}%` } },
        { processor: { [Op.like]: `%${search}%` } },
        { operatingSystem: { [Op.like]: `%${search}%` } }
      ];
    }
    
    // Adicionar filtros específicos
    if (type) whereConditions.type = type;
    if (status) whereConditions.status = status;
    if (brand) whereConditions.brand = { [Op.like]: `%${brand}%` };
    
    // Definir ordenação
    const order = [];
    if (sortBy) {
      order.push([sortBy, sortOrder === 'desc' ? 'DESC' : 'ASC']);
    } else {
      order.push(['updatedAt', 'DESC']);
    }
    
    const computers = await Computer.findAll({
      where: whereConditions,
      include: [{ model: User, attributes: ['id', 'name', 'email'] }],
      order
    });
    
    res.status(200).json(computers);
  } catch (error) {
    console.error('Erro ao buscar computadores:', error);
    res.status(500).json({ message: 'Erro ao buscar computadores', error: error.message });
  }
};

// Obter computador por ID
exports.getComputerById = async (req, res) => {
  try {
    const { id } = req.params;
    const computer = await Computer.findByPk(id, {
      include: [{ model: User, attributes: ['id', 'name', 'email'] }]
    });

    if (!computer) {
      return res.status(404).json({ message: 'Computador não encontrado' });
    }

    res.status(200).json(computer);
  } catch (error) {
    console.error('Erro ao buscar computador:', error);
    res.status(500).json({ message: 'Erro ao buscar computador', error: error.message });
  }
};

// Criar novo computador
exports.createComputer = async (req, res) => {
  try {
    const {
      type,
      brand,
      model,
      serialNumber,
      processor,
      memory,
      storage,
      operatingSystem,
      purchaseDate,
      warrantyExpiration,
      status,
      notes,
      userId
    } = req.body;

    // Verificar se já existe um computador com o mesmo número de série
    const existingComputer = await Computer.findOne({ where: { serialNumber } });
    if (existingComputer) {
      return res.status(400).json({ message: 'Já existe um computador com este número de série' });
    }

    const computer = await Computer.create({
      type,
      brand,
      model,
      serialNumber,
      processor,
      memory,
      storage,
      operatingSystem,
      purchaseDate,
      warrantyExpiration,
      status,
      notes,
      userId
    });

    res.status(201).json({
      message: 'Computador criado com sucesso',
      computer
    });
  } catch (error) {
    console.error('Erro ao criar computador:', error);
    res.status(500).json({ message: 'Erro ao criar computador', error: error.message });
  }
};

// Atualizar computador
exports.updateComputer = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      type,
      brand,
      model,
      serialNumber,
      processor,
      memory,
      storage,
      operatingSystem,
      purchaseDate,
      warrantyExpiration,
      status,
      notes,
      userId
    } = req.body;

    const computer = await Computer.findByPk(id);
    if (!computer) {
      return res.status(404).json({ message: 'Computador não encontrado' });
    }

    // Verificar se o número de série já está em uso por outro computador
    if (serialNumber !== computer.serialNumber) {
      const existingComputer = await Computer.findOne({ where: { serialNumber } });
      if (existingComputer) {
        return res.status(400).json({ message: 'Já existe um computador com este número de série' });
      }
    }

    await computer.update({
      type,
      brand,
      model,
      serialNumber,
      processor,
      memory,
      storage,
      operatingSystem,
      purchaseDate,
      warrantyExpiration,
      status,
      notes,
      userId
    });

    res.status(200).json({
      message: 'Computador atualizado com sucesso',
      computer
    });
  } catch (error) {
    console.error('Erro ao atualizar computador:', error);
    res.status(500).json({ message: 'Erro ao atualizar computador', error: error.message });
  }
};

// Excluir computador
exports.deleteComputer = async (req, res) => {
  try {
    const { id } = req.params;
    const computer = await Computer.findByPk(id);

    if (!computer) {
      return res.status(404).json({ message: 'Computador não encontrado' });
    }

    await computer.destroy();
    res.status(200).json({ message: 'Computador excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir computador:', error);
    res.status(500).json({ message: 'Erro ao excluir computador', error: error.message });
  }
};


// Obter estatísticas de computadores
exports.getComputerStats = async (req, res) => {
  try {
    // Total de computadores
    const totalComputers = await Computer.count();
    
    // Contagem por tipo
    const countByType = await Computer.findAll({
      attributes: ['type', [sequelize.fn('COUNT', sequelize.col('type')), 'count']],
      group: ['type']
    });
    
    // Contagem por status
    const countByStatus = await Computer.findAll({
      attributes: ['status', [sequelize.fn('COUNT', sequelize.col('status')), 'count']],
      group: ['status']
    });
    
    // Contagem por marca
    const countByBrand = await Computer.findAll({
      attributes: ['brand', [sequelize.fn('COUNT', sequelize.col('brand')), 'count']],
      group: ['brand'],
      order: [[sequelize.fn('COUNT', sequelize.col('brand')), 'DESC']],
      limit: 5
    });
    
    // Computadores com garantia próxima do vencimento (próximos 30 dias)
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    const warrantyExpiringSoon = await Computer.count({
      where: {
        warrantyExpiration: {
          [Op.lte]: thirtyDaysFromNow,
          [Op.gte]: new Date()
        }
      }
    });
    
    res.status(200).json({
      totalComputers,
      countByType,
      countByStatus,
      countByBrand,
      warrantyExpiringSoon
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas de computadores:', error);
    res.status(500).json({ message: 'Erro ao buscar estatísticas', error: error.message });
  }
};