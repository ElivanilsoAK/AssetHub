// server/controllers/equipment/bagController.js
const Bag = require('../../models/Bag'); // Certifique-se de que o modelo está correto

exports.getAllBags = async (req, res) => {
  try {
    const { search, type, status } = req.query; // Obtenha parâmetros de consulta
    let whereClause = {};

    if (search) {
      whereClause = {
        ...whereClause,
        [Op.or]: [ // Importar Op do Sequelize
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
      order: [['createdAt', 'DESC']] // Ordenar para mostrar os mais recentes
    });
    res.status(200).json(bags);
  } catch (error) {
    console.error('Erro ao buscar mochilas:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

// Outras funções do controlador (createBag, getBagById, updateBag, deleteBag)
// ... (Mantenha as que você já tem ou adicione-as aqui)