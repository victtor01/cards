const baseUrlBackend = "http://localhost:9000/uploads";

export function GetUpload(url: string | null) {
  return !!url ? `${baseUrlBackend}/${url}`: null;
}
