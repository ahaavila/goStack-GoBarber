// Model usado para conseguir manipular os dados da tabela
import Sequelize, { Model } from 'sequelize';

class Appointment extends Model {
  static init(sequelize) {
    // chamo o metodo init da classe pai Model.
    // Primeiro parametro do init, é o objeto contendo as colunas do BD que vão poder ser manipuladas
    // Segundo: passo o sequelize e mais configurações
    super.init(
      {
        date: Sequelize.DATE,
        canceled_at: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(models.User, { foreignKey: 'provider_id', as: 'provider' });
  }
}

export default Appointment;
