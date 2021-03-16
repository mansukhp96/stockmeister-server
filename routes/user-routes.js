import express from "express";
import {register, login, gglLogin} from '../controllers/user-controller.js'

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/google-login", gglLogin);

export default router;