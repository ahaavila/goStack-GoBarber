import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path';

export default {
  // Digo qual a forma para salvar o arquivo
  storage: multer.diskStorage({
    // digo onde vou salvar os arquivos de upload
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    // Renomeio os arquivos
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, res) => {
        // Se der erro, retorno err
        if (err) return cb(err);

        // Se não der erro, gero um nome aleatorio hexadecimal + a extensão do arquivo original
        return cb(null, res.toString('hex') + extname(file.originalname));
      });
    },
  }),
};
