import { UploadsService } from "@core/application/services/upload-service";
import { Request, Response } from "express";

export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  public async save(req: Request, res: Response) {
    const { body } = req;
    console.log(req.body);

    await this.uploadsService.save(body);

    return res.status(200).json({
      error: false,
    });
  }
}
