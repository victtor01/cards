import { Router } from "express";
import { authRoutes } from "./auth-routes";
import { uploadRoutes } from "./uploads-routes";
import { usersRoutes } from "./users-routers";

const routes = Router();
routes.use("/users", usersRoutes);
routes.use("/auth", authRoutes);
routes.use("/uploads", uploadRoutes);

export default routes;
