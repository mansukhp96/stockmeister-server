import express from "express";
import {
    findAllUsers,
    getUserInfo,
    updateUser,
    deleteUser,
    updateFollowing,
    updateFollower,
    removeFollowing,
    removeFollower,
    getUserFollowers,
    getUserFollowing,
    updateTrader,
    updateManager,
    removeTrader,
    removeManager,
    getManagerClients
} from '../controllers/user-controller.js'

const router = express.Router();

router.get("/all", findAllUsers);
router.get("/info/:id", getUserInfo);
router.post('/update/:id', updateUser);
router.post('/delete/:id', deleteUser);

router.get("/:id/followers", getUserFollowers);
router.get("/:id/following", getUserFollowing);

router.get("/:id/clients", getManagerClients);

router.post('/updateFollowing/:id', updateFollowing);
router.post('/updateFollower/:id', updateFollower);

router.post('/updateTrader/:id', updateTrader);
router.post('/updateManager/:id', updateManager);

router.post('/deleteTrader/:id', removeTrader);
router.post('/deleteManager/:id', removeManager);

router.post('/deleteFollower/:id', removeFollower);
router.post('/deleteFollowing/:id', removeFollowing);

export default router;