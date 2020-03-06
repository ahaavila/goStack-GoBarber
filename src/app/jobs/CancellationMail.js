import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';

import Mail from '../../lib/Mail';

class CancellationMail {
  // Crio um metodo como variavel, que é a chave unica do meu Job
  get key() {
    return 'CancellationMail';
  }

  // Tarefa que vai executar quando esse Job for executado
  async handle({ data }) {
    const { appointment } = data;

    console.log('A fila rodou!');

    // Enviando um email para o provider sobre o cancelamento
    await Mail.sendMail({
      to: `${appointment.provider.name} <${appointment.provider.email}>`,
      subject: 'Agendamento Cancelado',
      template: 'cancellation',
      context: {
        provider: appointment.provider.name,
        user: appointment.user.name,
        date: format(
          parseISO(appointment.date),
          "'dia' dd 'de' MMMM', às' H:mm'h'",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}

export default new CancellationMail();
