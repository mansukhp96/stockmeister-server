import express from "express";
import {findAllUsers, getUserInfo} from '../controllers/user-controller.js'

const router = express.Router();

router.get("/all", findAllUsers);
router.get("/info/:id", getUserInfo);

export default router;