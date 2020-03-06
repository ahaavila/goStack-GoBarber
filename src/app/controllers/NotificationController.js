import User from '../models/User';
import Notification from '../schemas/Notification';

class NotificationController {
  async index(req, res) {
    // Checando se o provider é de fato provider
    const checkIsProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!checkIsProvider) {
      return res
        .status(401)
        .json({ error: 'You can only create appointments with providers' });
    }
    // fim

    // listando as notificações
    const notifications = await Notification.find({
      user: req.userId,
    })
      .sort({ createdAt: 'desc' })
      .limit(20);
    // fim

    return res.json(notifications);
  }

  async update(req, res) {
    // Faço a busca pela notificação e atualizo
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      // new: usado para retornar a alteração na notificação
      { new: true }
    );

    return res.json(notification);
    // fim
  }
}

export default new NotificationController();
