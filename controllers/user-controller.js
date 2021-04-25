import userData from "../models/user-data.js";
import managerData from "../models/manager-data.js";

export const findAllUsers = async (req, res) => {

    let allOfThem = [];

    try {
        const allUsers = await userData.find({});
            allOfThem.push(...allUsers);
        const allManagers = await managerData.find({});
            allOfThem.push( ...allManagers );

        res.send({ result : allOfThem.map((r,i) => {
            return {
                _id : r._id,
                accountType : r.accountType,
                username : r.email.substring(0, r.email.lastIndexOf("@")),
                joined_on : r.joinedOn,
                gender : r.gender,
                first_name : r.firstName,
                last_name : r.lastName,
                followers : r.followers,
                following : r.following,
                clients : r.clients
            }
            })
        })
    }
    catch(error) {
        res.status(500).json({ message : "Something went wrong!" });
    }
};

export const getUserInfo = async (req, res) => {

    const _id = req.params.id;

    try {
        const user = await userData.findOne({ _id });
        let manager = {};

        if (!user) {
            manager = await managerData.findOne({ _id });
            if(!manager) {
                return res.status(404).json({message: "User doesn't exist"});
            }
            else {
                res.send({
                    _id : manager._id,
                    email : manager.email,
                    accountType : manager.accountType,
                    username : manager.email.substring(0, manager.email.lastIndexOf("@")),
                    first_name : manager.firstName,
                    last_name : manager.lastName,
                    joined_on : manager.joinedOn,
                    experience : manager.experience,
                    address : manager.address,
                    phone_number : manager.phoneNumber,
                    interests : manager.interests,
                    clients : manager.clients
                })
            }
        }
        else {
            res.send({
                _id : user._id,
                email : user.email,
                accountType : user.accountType,
                username : user.email.substring(0, user.email.lastIndexOf("@")),
                first_name : user.firstName,
                last_name : user.lastName,
                joined_on : user.joinedOn,
                gender : user.gender,
                address : user.address,
                phone_number : user.phoneNumber,
                interests : user.interests,
                following : user.following,
                followers : user.followers
            })
        }
    }
    catch(error) {
        res.status(500).json({ message : "Something went wrong!" });
    }
};

export const getUserFollowers = async (req, res) => {
    const _id = req.params.id;
    let userFollowersUnames = [];

    try {
        const user = await userData.findOne({_id});
        if(!user) {
            return res.status(404).json({message: "User doesn't exist"});
        }
        else {
            const userFollowersIds = user.followers;
            userData.find({ _id : { $in : userFollowersIds } })
                .exec((error, resp) => {
                    if(error) {
                        return res.status(400).json({message: "Oops! something went wrong!"});
                    }
                    else {
                        resp.map(r => userFollowersUnames.push(
                            r.email.substring(0,r.email.lastIndexOf("@"))
                        ));
                        res.status(200).json(userFollowersUnames);
                    }
                })
        }
    }
    catch (error) {
        return res.status(400).json({message: "Oops! something went wrong!"});
    }
};

export const getUserFollowing = async (req, res) => {
    const _id = req.params.id;
    let userFollowingUnames = [];

    try {
        const user = await userData.findOne({_id});
        if(!user) {
            return res.status(404).json({message: "User doesn't exist"});
        }
        else {
            const userFollowingIds = user.following;
            userData.find({ _id : { $in : userFollowingIds } })
                .exec((error, resp) => {
                    if(error) {
                        return res.status(400).json({message: "Oops! something went wrong!"});
                    }
                    else {
                        resp.map(r => userFollowingUnames.push(
                            r.email.substring(0,r.email.lastIndexOf("@"))
                        ));
                        res.status(200).json(userFollowingUnames);
                    }
                })
        }
    }
    catch (error) {
        return res.status(400).json({message: "Oops! something went wrong!"});
    }
};

export const updateUser = async (req, res) => {

    const { _id, accountType, gender, phoneNumber, address, bankAccount, interests, following, followers, clients, experience } = req.body;

    const updatedUser = new userData({
        _id : _id,
        gender : gender,
        phoneNumber : phoneNumber,
        address : address,
        bankAccount : bankAccount,
        interests : interests,
        following : following,
        followers : followers
    });

    const updatedManager = new managerData({
        _id : _id,
        gender : gender,
        phoneNumber : phoneNumber,
        address : address,
        experience : experience,
        interests : interests,
        clients : clients
    });

    try {
       if(accountType === "trader") {
           await userData.updateOne({_id}, updatedUser, (err, result) => {
               if(result) {
                   userData.findOne({_id}).exec((error, usr) => {
                       if (error) {
                           return res.status(400).json({message: "Oops! something went wrong!"});
                       }
                       else {
                           res.status(200).json({result: usr});
                       }
                   })
               }
               else {
                   res.status(404).json({message: "User update failed"});
               }
           });
       }
       else {
           await managerData.updateOne({_id}, updatedManager, (err, result) => {
               if(result) {
                   managerData.findOne({_id}).exec((error, usr) => {
                       if (error) {
                           return res.status(400).json({message: "Oops! something went wrong!"});
                       }
                       else {
                           res.status(200).json({result: usr});
                       }
                   })
               }
               else {
                   res.status(404).json({message: "User update failed"});
               }
           });
       }
    }
    catch(error) {
        res.status(500).json({ message : "Something went wrong!" });
    }
};

export const updateFollowing = async (req, res) => {
    const { _id } = req.body;
    const myId = req.params.id;

    const user = await userData.findById(myId);
    const updatedUser = userData.updateOne(
        {_id : myId}, { following : [ ...user.following , _id ] }, {new : true}, (err, result) => {
            if(result) {
                userData.findOne({_id : myId}).exec((error, usr) => {
                    if (error) {
                        return res.status(400).json({message: "Oops! something went wrong!"});
                    }
                    else {
                        res.status(200).json({result: usr});
                    }
                })
            }
            else {
                res.status(404).json({message: "User update failed"});
            }
        });
};

export const removeFollowing = async (req, res) => {
    const { _id } = req.body;
    const myId = req.params.id;

    const user = await userData.findById(myId);
    const updatedUser = userData.updateOne(
        {_id : myId}, { following : user.following.filter(f => f !== _id) }, {new : true}, (err, result) => {
            if(result) {
                userData.findOne({_id : myId}).exec((error, usr) => {
                    if (error) {
                        return res.status(400).json({message: "Oops! something went wrong!"});
                    }
                    else {
                        res.status(200).json({result: usr});
                    }
                })
            }
            else {
                res.status(404).json({message: "User update failed"});
            }
        });
};

export const updateFollower = async (req, res) => {
    const { _id } = req.body;
    const otherId = req.params.id;

    const otherUser = await userData.findById(otherId);
    const updatedOtherUser = userData.updateOne(
        {_id : otherId}, { followers : [ ...otherUser.followers , _id ] }, {new : true}, (err, result) => {
            if(result) {
                userData.findOne({_id : otherUser}).exec((error, usr) => {
                    if (error) {
                        return res.status(400).json({message: "Oops! something went wrong!"});
                    }
                    else {
                        res.status(200);
                    }
                })
            }
            else {
                res.status(404).json({message: "User update failed"});
            }
        });
};

export const removeFollower = async (req, res) => {
    const { _id } = req.body;
    const otherId = req.params.id;

    const otherUser = await userData.findById(otherId);
    const updatedOtherUser = userData.updateOne(
        {_id : otherId}, { followers : otherUser.followers.filter(f => f !== _id) }, {new : true}, (err, result) => {
            if(result) {
                userData.findOne({_id : otherUser}).exec((error, usr) => {
                    if (error) {
                        return res.status(400).json({message: "Oops! something went wrong!"});
                    }
                    else {
                        res.status(200);
                    }
                })
            }
            else {
                res.status(404).json({message: "User update failed"});
            }
        });
};

export const deleteUser = async (req, res) => {
    const _id = req.params.id;
    const { account } = req.body;

    try {
        if(account === "trader") {
            await userData.deleteOne({ _id }).exec((error, result) => {
                if(error) {
                    return res.status(400).json({message: "Oops! something went wrong!"});
                }
                else {
                    res.status(200).json({ message : "User account deleted" });
                }
            })
        }
        else {
            await managerData.deleteOne({ _id }).exec((error, result) => {
                if(error) {
                    return res.status(400).json({message: "Oops! something went wrong!"});
                }
                else {
                    res.status(200).json({ message : "User account deleted" });
                }
            })
        }
    }
    catch(error) {
        res.status(500).json({ message : "Something went wrong!" });
    }
}