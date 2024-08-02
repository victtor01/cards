import { UploadsService } from "@core/application/services/upload-service";
import { UploadsController } from "@infra/api/controllers/uploads-controller";
import config from "@infra/config/constants/multer";
import { Router } from "express";
import multer from "multer";

const uploadRoutes = Router();
const upload = multer(config);

const uploadsService = new UploadsService();
const uploadsController = new UploadsController(uploadsService);

uploadRoutes.post("/", upload.single("image"), (req, res) =>
  uploadsController.save(req, res)
);


export { uploadRoutes };

