import express from "express";
import * as UserController from "../controllers/user";
import { requiresAuth } from "../middleware/auth";

const router = express.Router();

router.get("/", requiresAuth, UserController.getAuthenticatedUser); // check if userId exist in the session first
router.post("/signup", UserController.signUp);
router.post("/login", UserController.login);
router.post("/logout", UserController.logout);
export default router;
