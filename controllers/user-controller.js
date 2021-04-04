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
                                email : r.email,
                                username : r.email.substring(0, r.email.lastIndexOf("@")),
                                joined_on : r.joinedOn,
                                interests : r.interests,
                                phone_number : r.phoneNumber,
                                address : r.address,
                                bank_account : r.bankAccount,
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