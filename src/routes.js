import { Router } from 'express';
import multer from 'multer';

import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import ProviderController from './app/controllers/ProviderController';
import AppointmentController from './app/controllers/AppointmentController';
import ScheduleController from './app/controllers/ScheduleController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

// middleware de autenticação
routes.use(authMiddleware);

// rota para upload de usuario
routes.put('/users', UserController.update);

// rota para listar os providers
routes.get('/providers', ProviderController.index);

// rota para appointments
routes.get('/appointments', AppointmentController.index);
routes.post('/appointments', AppointmentController.store);

// rota para listagem de agendamento
routes.get('/schedules', ScheduleController.index);

// rota para upload do avatar
routes.post('/files', upload.single('file'), FileController.store);

export default routes;
