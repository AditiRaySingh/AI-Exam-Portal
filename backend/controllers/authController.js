import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";


/*
=========================================================
REGISTER STUDENT / TEACHER
=========================================================
*/

export const userregistration = async (req, res) => {

    try {

        const {
            name,
            email,
            password,
            role
        } = req.body;


        /*
        -----------------------------------------------
        BASIC VALIDATION
        -----------------------------------------------
        */

        if (!name || !email || !password || !role) {

            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });

        }


        /*
        -----------------------------------------------
        ONLY STUDENT / TEACHER CAN REGISTER
        -----------------------------------------------
        */

        if (!["student", "teacher"].includes(role)) {

            return res.status(400).json({
                success: false,
                message:
                    "Only student or teacher registration is allowed."
            });

        }


        /*
        -----------------------------------------------
        COLLEGE EMAIL CHECK
        -----------------------------------------------
        */

        const normalizedEmail =
            email.toLowerCase().trim();


        if (!normalizedEmail.endsWith("@gla.ac.in")) {

            return res.status(400).json({
                success: false,
                message:
                    "Registration is allowed only with a GLA University email."
            });

        }


        /*
        -----------------------------------------------
        PASSWORD CHECK
        -----------------------------------------------
        */

        if (password.length < 6) {

            return res.status(400).json({
                success: false,
                message:
                    "Password must be at least 6 characters."
            });

        }


        /*
        -----------------------------------------------
        CHECK EXISTING USER
        -----------------------------------------------
        */

        const userExist =
            await userModel.findOne({
                email: normalizedEmail
            });


        if (userExist) {

            return res.status(400).json({
                success: false,
                message:
                    "This email is already registered."
            });

        }


        /*
        -----------------------------------------------
        HASH PASSWORD
        -----------------------------------------------
        */

        const hashedPassword =
            await bcrypt.hash(password, 10);


        /*
        -----------------------------------------------
        CREATE PENDING USER
        -----------------------------------------------
        */

        const user = await userModel.create({

            name: name.trim(),

            email: normalizedEmail,

            password: hashedPassword,

            role,

            isVerified: false,

            isActive: false

        });


        console.log(
            "PENDING USER CREATED:",
            user.email
        );


        /*
        -----------------------------------------------
        RESPONSE
        -----------------------------------------------
        */

        return res.status(201).json({

            success: true,

            message:
                "Registration submitted successfully. Your account is pending Admin approval.",

            user: {

                _id: user._id,

                name: user.name,

                email: user.email,

                role: user.role,

                isActive: user.isActive,

                isVerified: user.isVerified

            }

        });


    } catch (error) {

        console.error(
            "REGISTRATION ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Internal server error"

        });

    }

};


/*
=========================================================
LOGIN
=========================================================
*/

export const loginUser = async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        if (!email || !password) {

            return res.status(400).json({

                success: false,

                message:
                    "Email and password required"

            });

        }


        const normalizedEmail =
            email.toLowerCase().trim();


        const user =
            await userModel
                .findOne({
                    email: normalizedEmail
                })
                .select("+password");


        console.log(
            "Login email:",
            normalizedEmail
        );

        console.log(
            "User found:",
            user ? user.email : "NOT FOUND"
        );


        /*
        -----------------------------------------------
        USER NOT FOUND
        -----------------------------------------------
        */

        if (!user) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid email or password"

            });

        }


        /*
        -----------------------------------------------
        PASSWORD CHECK
        -----------------------------------------------
        */

        const isMatch =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!isMatch) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid email or password"

            });

        }


        /*
        -----------------------------------------------
        ADMIN CAN LOGIN
        -----------------------------------------------
        */

        if (user.role === "admin") {

            // Admin does not need approval

        } else {

            /*
            -------------------------------------------
            NORMAL USER APPROVAL CHECK
            -------------------------------------------
            */

            if (!user.isActive) {

                return res.status(403).json({

                    success: false,

                    message:
                        "Your account is pending Admin approval."

                });

            }

        }


        /*
        -----------------------------------------------
        UPDATE LAST LOGIN
        -----------------------------------------------
        */

        user.lastLogin = new Date();

        await user.save();


        /*
        -----------------------------------------------
        CREATE JWT
        -----------------------------------------------
        */

        const token =
            jwt.sign(
                {
                    id: user._id,
                    role: user.role
                },

                process.env.JWT_SECRET,

                {
                    expiresIn: "7d"
                }
            );


        /*
        -----------------------------------------------
        USER DATA
        -----------------------------------------------
        */

        const userData = {

            _id: user._id,

            name: user.name,

            email: user.email,

            role: user.role,

            isActive: user.isActive,

            isVerified: user.isVerified

        };


        return res.status(200).json({

            success: true,

            message:
                "Login successful",

            token,

            user: userData

        });


    } catch (error) {

        console.error(
            "LOGIN ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Internal server error"

        });

    }

};


/*
=========================================================
GET PROFILE
=========================================================
*/

export const getProfile = async (req, res) => {

    res.status(200).json({

        success: true,

        user: req.user

    });

};