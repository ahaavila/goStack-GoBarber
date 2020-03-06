import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import pt from 'date-fns/locale/pt';

import User from '../models/User';
import File from '../models/File';
import Appointment from '../models/Appointment';
import Notification from '../schemas/Notification';

import CancellationMail from '../jobs/CancellationMail';
import Queue from '../../lib/Queue';

class AppointmentController {
  /**
   * Listagem de Agendamentos por usuário logado
   */
  async index(req, res) {
    // pegar a paginação
    const { page = 1 } = req.query;

    const appointments = await Appointment.findAll({
      where: {
        user_id: req.userId,
        canceled_at: null,
      },
      attributes: ['id', 'date', 'past', 'cancelable'],
      // limito 20 registros por pagina
      limit: 20,
      // pulo de 20 em 20 registros para paginação
      offset: (page - 1) * 20,
      order: ['date'],
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });

    return res.json(appointments);
  }

  /**
   * Criando um agendamento
   */

  async store(req, res) {
    const schema = Yup.object().shape({
      date: Yup.date().required(),
      provider_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { provider_id, date } = req.body;

    // Checando se o provider é de fato provider
    const checkIsProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!checkIsProvider) {
      return res
        .status(401)
        .json({ error: 'You can only create appointments with providers' });
    }
    // fim

    /**
     * Checando se a data de agendamento é anterior a hora de agora
     */

    const hourStart = startOfHour(parseISO(date));

    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permitted' });
    }
    // fim

    /**
     * Checando se o provider já tem horario marcado
     */

    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });

    if (checkAvailability) {
      return res.status(400).json({ error: 'Appointment is not available' });
    }
    // fim

    // Verificando se o usuario logado não é o mesmo do provider
    if (provider_id === req.userId) {
      return res
        .status(401)
        .json({ error: 'You cannot schedule a appointment for yourself' });
    }
    // fim

    // Criando o agendamento
    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date: hourStart,
    });
    // fim

    /**
     * Notificando o prestador de serviços
     */

    const user = await User.findByPk(req.userId);
    // formato a data para mostrar na mensagem
    const formattedDate = format(
      hourStart,
      "'dia' dd 'de' MMMM', às' H:mm'h'",
      { locale: pt }
    );

    await Notification.create({
      content: `Novo agendamento de ${user.name} para ${formattedDate}`,
      user: provider_id,
    });

    return res.json(appointment);
  }

  /**
   * Cancelando um agendamento
   */
  async delete(req, res) {
    // Buscando os dados do agendamento
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
      ],
    });
    // fim

    // verificando se ID usuario agendamento é diferente do usuario logado
    if (appointment.user_id !== req.userId) {
      return res.status(401).json({
        error: "You don't have permission to cancel this appointment.",
      });
    }
    // fim

    // verificando se o usuario está deletando com 2 horas de antecedência
    const dateWithSub = subHours(appointment.date, 2);
    if (isBefore(dateWithSub, new Date())) {
      return res.status(401).json({
        error: 'You can only cancel appointments 2 hours in advanced',
      });
    }
    // fim

    // Atualizar o campo canceled_at no appointment
    appointment.canceled_at = new Date();

    await appointment.save();
    // fim

    // Chamo o metodo de fila de envio de email
    // Passo a variavel appointment que será usada no CancellationMail
    await Queue.add(CancellationMail.key, {
      appointment,
    });

    return res.json(appointment);
  }
}

export default new AppointmentController();
