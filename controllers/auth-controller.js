import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userData from "../models/user-data.js";
import OAuth2Client from 'google-auth-library';

const client = new OAuth2Client.OAuth2Client("773832370247-e8m7hoo3qe1ba9vu590rfhjm67f0itps.apps.googleusercontent.com");

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

export const gglLogin = async (req, res) => {
    const { token } = req.body;

    try {
        //Verify if token is legit
        client.verifyIdToken({
            idToken: token,
            audience: "773832370247-e8m7hoo3qe1ba9vu590rfhjm67f0itps.apps.googleusercontent.com"
        })
            .then((response) => {
                const {email_verified, given_name, family_name, email, picture} = response.payload;

                if (email_verified) {
                    userData.findOne({email}).exec((error, user) => {
                        if (error) {
                            return res.status(400).json({message: "Oops! something went wrong!"});
                        } else {
                            //Verify if user exists
                            if (user) {
                                const dbToken = jwt.sign({email: user.email, id: user._id}, 'test', {expiresIn: "1h"});
                                res.status(200).json({result: user, dbToken});
                            }
                            //Create user if user doesn't exist
                            else {
                                let result = new userData({
                                    email : email,
                                    password: email+token,
                                    firstName: given_name,
                                    lastName: family_name,
                                    gender: null,
                                    imageUrl : picture,
                                    joinedOn : Date.now(),
                                    interests : [],
                                    phoneNumber : null,
                                    address : null,
                                    bankAccount : null,
                                    followers: [],
                                    following: []
                                });
                                result.save((error, data) => {
                                    if (error) {
                                        return res.status(400).json({message: "Oops! something went wrong!!"})
                                    }
                                    const dbToken = jwt.sign({
                                        email: data.email,
                                        id: data._id
                                    }, 'test', {expiresIn: "1h"});
                                    const { email, firstName, lastname } = result;
                                    res.status(200).json({result, token : dbToken});
                                });
                            }
                        }
                    })
                }
            })
    }
    catch(error) {
        res.status(500).json({ message : "Oops! something went wrong!!!" });
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
            email,
            password : hashPass,
            firstName,
            lastName,
            joinedOn : Date.now(),
            interests : [],
            gender : null,
            imageUrl : null,
            phoneNumber : null,
            address : null,
            bankAccount : null,
            followers : [],
            following : []
        });

        //TODO env variables when moving to prod - secret
        const token = jwt.sign( { email : result.email, id : result._id }, 'test', {expiresIn: "1h"});
        res.status(200).json({ result, token });
    }
    catch(error) {
        res.status(500).json({ message : "Oops! something went wrong" });
    }
};