// Model usado para conseguir manipular os dados da tabela
import Sequelize, { Model } from 'sequelize';

class File extends Model {
  static init(sequelize) {
    // chamo o metodo init da classe pai Model.
    // Primeiro parametro do init, é o objeto contendo as colunas do BD que vão poder ser manipuladas
    // Segundo: passo o sequelize e mais configurações
    super.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `http://localhost:3331/files/${this.path}`;
          },
        },
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default File;
