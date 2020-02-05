import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import User from '../models/User';
import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    // validando os dados de login
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    // pego o email e senha digitada pelo usuario
    const { email, password } = req.body;

    // busco pelo email do usuario
    const user = await User.findOne({ where: { email } });

    // verifico se o email existe mesmo
    if (!user) {
      return res.status(401).json({ error: 'User not found.' });
    }

    // verifico se a senha está certa
    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Password does not match.' });
    }

    // se tudo der certo
    const { id, name } = user;

    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
