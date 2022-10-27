import express from "express";
import AuthController from "../controllers/authController.js";

const router = express.Router();

router
  .post("/login", AuthController.login)
  .post("/cadastro", AuthController.cadastro);

export default router;
