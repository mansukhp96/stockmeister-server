import express from "express";
import {findAllUsers, getUserInfo, updateUser} from '../controllers/user-controller.js'

const router = express.Router();

router.get("/all", findAllUsers);
router.get("/info/:id", getUserInfo);
router.post('/:id', updateUser);

export default router;