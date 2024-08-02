export abstract class UploadServiceInterface {
  abstract save(data: any): Promise<any>
}