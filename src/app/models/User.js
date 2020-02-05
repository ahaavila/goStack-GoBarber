// Model usado para conseguir manipular os dados da tabela
import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    // chamo o metodo init da classe pai Model.
    // Primeiro parametro do init, é o objeto contendo as colunas do BD que vão poder ser manipuladas
    // Segundo: passo o sequelize e mais configurações
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );
    // metodo que executa uma função antes dos dados serem salvos no BD
    this.addHook('beforeSave', async user => {
      // verifico se o usuario digitou a senha
      if (user.password) {
        // se existir eu crio o meu password_hash
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  // metodo usando para comparar se a senha na autenticação é igual a senha hash
  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
