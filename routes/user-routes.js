import express from "express";
import {findAllUsers, getUserInfo, updateUser, deleteUser, updateFollowing, updateFollower} from '../controllers/user-controller.js'

const router = express.Router();

router.get("/all", findAllUsers);
router.get("/info/:id", getUserInfo);
router.post('/update/:id', updateUser);
router.post('/delete/:id', deleteUser);
router.post('/updateFollowing/:id', updateFollowing);
router.post('/updateFollower/:id', updateFollower);

export default router;