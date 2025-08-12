const baseUrlBackend = `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads`;

export function getUpload(url: string | null | undefined) {
  return !!url ? `${baseUrlBackend}/${url}` : null;
}
