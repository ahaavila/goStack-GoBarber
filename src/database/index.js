import Sequelize from 'sequelize';

// importo todos os meus models
import User from '../app/models/User';
import File from '../app/models/File';
import Appointment from '../app/models/Appointment';

// importo minha base de dados
import databaseConfig from '../config/database';

// crio um array com todos os meus models
const models = [User, File, Appointment];

class Database {
  constructor() {
    this.init();
  }

  init() {
    // faço a conexão com o BD
    this.connection = new Sequelize(databaseConfig);
    // percorro meu array e para cada model eu acesso o metodo init e passo como parametro a conexão.
    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models)); // usado para associar o id do avatar
  }
}

export default new Database();
