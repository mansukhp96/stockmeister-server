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
                first_name : user.firstName,
                last_name : user.lastName,
                joined_on : user.joinedOn,
                gender : user.gender,
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