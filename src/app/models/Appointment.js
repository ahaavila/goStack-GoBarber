// Model usado para conseguir manipular os dados da tabela
import Sequelize, { Model } from 'sequelize';
import { isBefore, subHours } from 'date-fns';

class Appointment extends Model {
  static init(sequelize) {
    // chamo o metodo init da classe pai Model.
    // Primeiro parametro do init, é o objeto contendo as colunas do BD que vão poder ser manipuladas
    // Segundo: passo o sequelize e mais configurações
    super.init(
      {
        date: Sequelize.DATE,
        canceled_at: Sequelize.DATE,
        // Campo para mostrar que um agendamento já foi passado'
        past: {
          type: Sequelize.VIRTUAL,
          get() {
            return isBefore(this.date, new Date());
          },
        },
        // Campo que retorna se o agendamento é cancelável ou não
        cancelable: {
          type: Sequelize.VIRTUAL,
          get() {
            return isBefore(new Date(), subHours(this.date, 2));
          },
        },
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
