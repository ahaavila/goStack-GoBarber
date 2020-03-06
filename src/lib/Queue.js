import Bee from 'bee-queue';

import CancellationMail from '../app/jobs/CancellationMail';

import redisConfig from '../config/redis';

// Variavel que vai conter um array de jobs
const jobs = [CancellationMail];

class Queue {
  constructor() {
    // inicio minha Queue como um objeto vazio
    this.queues = {};

    this.init();
  }

  // Metodo para iniciar as filas
  init() {
    // Percorro meus jobs e salvo eles dentro da minha variavel queues onde vai conter
    // a configuração do redis e a tarefa que deve exucutar
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        handle,
      };
    });
  }

  // Metodo para adicionar novos jobs dentro da fila
  // Recebo o que eu quero colocar na fila e as variaveis
  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }

  // Metodo para processar as filas
  // Pega os jobs e fica processando em tempo real
  processQueue() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];

      bee.on('failed', this.handleFailure).process(handle);
    });
  }

  handleFailure(job, err) {
    console.log(`Queue ${job.queue.name}: FAILED`, err);
  }
}

export default new Queue();
