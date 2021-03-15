import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userData from "../models/user-data.js";

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await userData.findOne({ email });

        if(!existingUser) {
            return res.status(404).json({ message : "User doesn't exist" });
        }

        const isPassCorrect = await bcrypt.compare(password, existingUser.password);

        if (!isPassCorrect) {
            return res.status(400).json({ message : "Incorrect Credentials!" });
        }

        //TODO env variables when moving to prod - secret
        const token = jwt.sign( { email : existingUser.email, id : existingUser._id }, 'test', {expiresIn: "1h"});
        res.status(200).json({ result : existingUser, token });
    }
    catch(error) {
        res.status(500).json({ message : "Oops! something went wrong" });
    }
};

export const register = async (req, res) => {
    const {email, password, rePassword, firstName, lastName, followers, following} = req.body;

    try{
        const existingUser = await userData.findOne({ email });

        if(existingUser) {
            return res.status(404).json({ message : "User already exists" });
        }
        if(password !== rePassword) {
            return res.status(400).json({ message : "Passwords dont match" });
        }

        const hashPass = await bcrypt.hash(password, 12);

        const result = await userData.create({
            email, password : hashPass, firstName, lastName, followers, following
        });

        //TODO env variables when moving to prod - secret
        const token = jwt.sign( { email : result.email, id : result._id }, 'test', {expiresIn: "1h"});
        res.status(200).json({ result, token });
    }
    catch(error) {
        res.status(500).json({ message : "Oops! something went wrong" });
    }
};