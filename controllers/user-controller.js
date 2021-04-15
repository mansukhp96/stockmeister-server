import userData from "../models/user-data.js";

export const findAllUsers = async (req, res) => {
    try {
        const allUsers = await userData.find(
            {}, (error, result) => {
                if(error) {
                    return null;
                }
                else if (result){
                    res.send({ result : result.map((r,i) => {
                            return {
                                _id : r._id,
                                username : r.email.substring(0, r.email.lastIndexOf("@")),
                                joined_on : r.joinedOn,
                                gender : r.gender,
                                first_name : r.firstName,
                                last_name : r.lastName,
                                followers : r.followers,
                                following : r.following
                            }
                        })
                    });
                }
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
        if (!user) {
            return res.status(404).json({message: "User doesn't exist"});
        } else {
            res.send({
                _id : user._id,
                email : user.email,
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
}

export const updateUser = async (req, res) => {

    const { _id, gender, phoneNumber, address, bankAccount, interests, following, followers } = req.body;

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

    try {
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

    try {
        await userData.deleteOne({ _id }).exec((error, result) => {
            if(error) {
                return res.status(400).json({message: "Oops! something went wrong!"});
            }
            else {
                res.status(200).json({ message : "User account deleted" });
            }
        })
    }
    catch(error) {
        res.status(500).json({ message : "Something went wrong!" });
    }
}