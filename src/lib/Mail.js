import nodemailer from 'nodemailer';
import { resolve } from 'path';
import exphbs from 'express-handlebars';
import nodemailerhbs from 'nodemailer-express-handlebars';
import mailConfig from '../config/mail';

class Mail {
  constructor() {
    const { host, port, secure, auth } = mailConfig;
    // Criando o metodo que cria as confis de autenticação no email
    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      // Se a gente não tiver um usuario de autenticação, eu passo como null
      auth: auth.user ? auth : null,
    });
    // Fim

    this.configureTemplates();
  }

  configureTemplates() {
    // Criando um variavel que vai receber o caminho dos templates
    const viewPath = resolve(__dirname, '..', 'app', 'views', 'emails');

    // Compilando os templates de email
    this.transporter.use(
      'compile',
      nodemailerhbs({
        viewEngine: exphbs.create({
          layoutsDir: resolve(viewPath, 'layouts'),
          partialsDir: resolve(viewPath, 'partials'),
          defaultLayout: 'default',
          extname: 'hbs',
        }),
        viewPath,
        extName: '.hbs',
      })
    );
  }

  // metodo responsavel por enviar o email
  sendMail(message) {
    return this.transporter.sendMail({
      ...mailConfig.default,
      ...message,
    });
  }
}

export default new Mail();
