import {
  startOfDay,
  endOfDay,
  setHours,
  setMinutes,
  setSeconds,
  format,
  isAfter,
} from 'date-fns';
import { Op } from 'sequelize';

import Appointment from '../models/Appointment';

class AvailableController {
  async index(req, res) {
    // Busco a data que o usuário digitou
    const { date } = req.query;

    // Verifico se a data existe
    if (!date) {
      return res.status(400).json({ error: 'Invalid date' });
    }
    // fim

    const searchDate = Number(date);

    // Busco todos os agendamentos que existem na data informada pelo Front
    const appointments = await Appointment.finddAll({
      where: {
        provider_id: req.params.providerId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
        },
      },
    });
    // Fim

    // Seto todos os horários disponíveis que um Provider tem
    const schedule = [
      '08:00',
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '18:00',
      '19:00',
      '20:00',
    ];
    // Fim

    // Retorno todos os horários disponiveis para o usuario
    const available = schedule.map(time => {
      // Crio um padrão de horas
      const [hour, minute] = time.split(':');
      const value = setSeconds(
        setMinutes(setHours(searchDate, hour), minute),
        0
      );
      // fim

      // Retorno todos os horarios verificando se a data informada já não passou
      // e se não existe nenhum appointment naquela data
      return {
        time,
        value: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"),
        available:
          isAfter(value, new Date()) &&
          !appointments.find(a => format(a.date, 'HH:mm') === time),
      };
    });

    return res.json(available);
  }
}

export default new AvailableController();
