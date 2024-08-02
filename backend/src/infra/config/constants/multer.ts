import multer from 'multer';
import { randomUUID } from 'node:crypto';
import path from 'path';

const folder = path.resolve(__dirname, '..', '..', '..', 'uploads');

const config = {
  dest: folder,
  storage: multer.diskStorage({
    destination: folder,
    filename(_, file, callback) {
      const fileHash = randomUUID();
      const fileName = `${fileHash}-${file.originalname}`;

      return callback(null, fileName);
    },
  }),
} satisfies multer.Options;

export default config;
