const baseUrlBackend = "http://localhost:9000/uploads";

export function getUpload(url: string | null | undefined ) {
  return !!url ? `${baseUrlBackend}/${url}`: null;
}
