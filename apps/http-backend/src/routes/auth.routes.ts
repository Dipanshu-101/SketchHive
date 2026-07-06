import { Router } from "express";
import { handle } from "../controllers/handle";
import * as authController from "../controllers/auth.controller";

/** Public auth routes. */
export const authRoutes: Router = Router();

authRoutes.post("/signup", handle(authController.signup));
authRoutes.post("/signin", handle(authController.signin));
