import express from "express";
import {findAllUsers} from '../controllers/user-controller.js'

const router = express.Router();

router.get("/all", findAllUsers);

export default router;