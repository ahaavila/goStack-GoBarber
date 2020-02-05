import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../../config/auth';

export default async (req, res, next) => {
  // busco o token no cabeçalho
  const authHeader = req.headers.authorization;

  // verifico se o token foi passado
  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provider' });
  }

  // se foi passado eu separo o token do barrer
  const [, token] = authHeader.split(' ');

  // faço um tratamento de erro
  try {
    // verifico se o token é verdadeiro
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    // pego o id do usuario que está presente no token e jogo ele pra variavel userId
    req.userId = decoded.id;

    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
