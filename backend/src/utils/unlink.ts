import { log, warn } from 'console';
import { unlink } from 'fs/promises';
import { join } from 'path';

export async function unlinkUploadFile(filename: string): Promise<void> {
  try {
    const filePath = join(__dirname, '..', 'uploads', filename);
    await unlink(filePath);
  } catch (error: any) {
    console.log(error);
  }
}
