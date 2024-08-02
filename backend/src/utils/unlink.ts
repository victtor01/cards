import { unlink } from "fs/promises";
import { join } from "path";

export async function unlinkUploadFile (filename: string) {
  await unlink(join(__dirname, 'uploads', filename));
}