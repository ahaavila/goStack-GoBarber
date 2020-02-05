import * as Yup from 'yup';
// Importo o model de usuario
import User from '../models/User';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    const { id, name, email, provider } = await User.create(req.body);

    return res.json({ id, name, email, provider });
  }

  async update(req, res) {
    // validando os campos do update
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        // verifico se o oldPassword for digitado, o password tem que ser digitado.
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      // verifico se o password for digitado, o confirmPassword tem que ser igual ao password
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    // pego os dados digitados pelo usuario
    const { email, oldPassword } = req.body;

    // procuro o usuario pelo id dele no banco
    const user = await User.findByPk(req.userId);

    // verifico se o email vai ser alterado e se ele é diferente do email anterior
    if (email && email !== user.email) {
      // encontro o email no banco
      const userExists = await User.findOne({ where: { email } });

      // verifico se o usuario existe
      if (userExists) {
        return res.status(400).json({ error: 'User already exists.' });
      }
    }

    // verifico se a senha antiga foi digitada e se ela é diferente da senha atual
    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    // se tudo der certo, eu pego os dados do body e dou um update no usuario
    const { id, name, provider } = await user.update(req.body);

    return res.json({ id, name, email, provider });
  }
}

export default new UserController();
