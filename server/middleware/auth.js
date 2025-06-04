const jwt = require('jsonwebtoken');
const { User } = require('../models');

exports.protect = async (req, res, next) => {
  try {
    let token;

    // Verificar se o token existe no header Authorization
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Acesso não autorizado. Faça login para continuar.' });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'assethub-secret-key');

    // Verificar se o usuário ainda existe
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'O usuário não existe mais.' });
    }

    // Verificar se o usuário está ativo
    if (!user.active) {
      return res.status(401).json({ message: 'Conta desativada. Entre em contato com o administrador.' });
    }

    // Adicionar usuário à requisição
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Erro de autenticação:', error);
    res.status(401).json({ message: 'Acesso não autorizado. Token inválido.' });
  }
};

// Middleware para verificar permissões de usuário
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Você não tem permissão para acessar este recurso.' });
    }
    next();
  };
};