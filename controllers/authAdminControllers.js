import adminAuthHelpers from '../helpers/adminAuthHelpers.js';
import authService from '../utils/authService.js';
import configKeys from '../config/configKeys.js';
import tokenHelpers from '../helpers/tokenHelpers.js';


const authAdminControllers = () => {

    const signUp = async (req, res) => {
        try {
            const { email, password } = req.body;
            const lowerCaseEmail = email.toLowerCase()
            
            const hashedPassword = await authService.encryptPassword(password)
            const response = await adminAuthHelpers.signUpAdmin(lowerCaseEmail, hashedPassword);
            if (response) {
                return res.status(200).json({ status: true, message: "Admin registered successfully" });
            } else {
                return res.status(200).json({ status: false, message: "Error registering Admin" });
            }
        } catch (error) {
            return res.status(500).json({ status: false, message: error.message });
        }
    }

    const signIn = async (req, res) => {
        const { email, password } = req.body
        const lowerCaseEmail = email.toLowerCase()

        const adminExists = await adminAuthHelpers.getAdminByEmail(lowerCaseEmail)
        if (!adminExists) {
            return res.status(200).json({ status: false, message: "Unauthorized access" })
        }

        const checkPassword = await authService.comparePassword(password, adminExists.password)
        if (!checkPassword) {
            return res.status(200).json({ status: false, message: "Password is incorrect" })
        }

        const payload = {
            id: adminExists._id,
            role: configKeys.JWT_ADMIN_ROLE
        }

        const accessToken = authService.generateToken(payload, configKeys.JWT_ACCESS_SECRET_KEY)
        const refreshToken = authService.generateToken(payload, configKeys.JWT_REFRESH_SECRET_KEY)

        try {
            if (refreshToken) {
                const refreshTokenToDb = await tokenHelpers.addToken(adminExists._id, refreshToken)
                
                if (refreshTokenToDb) {
                    return res.status(200).json({
                        status: true, message: "Signin success",
                        data: {
                            user: {
                                email: adminExists.email
                            },
                            token: accessToken
                        }
                    })
                }else{
                    return res.status(200).json({status: false, message:"Error creating session"})
                }
            }
        } catch (error) {
            return res.status(500).json({message:"Error creating session"})
        }
    }


    const signOut = async (req, res) => {
        const { id } = req.payload
        const deleteToken = await tokenHelpers.deleteToken(id)
        if (deleteToken) {
            return res.status(200).json({ status: true, message: "Signout Successful" })
        }
    }


    return {
        signUp,
        signIn,
        signOut
    }
}

export default authAdminControllers;