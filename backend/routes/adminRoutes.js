import express from "express";

import {
    protect,
    authorizeRoles
} from "../middleware/authMiddleware.js";

import User from "../models/userModel.js";
import Exam from "../models/examModel.js";

const router = express.Router();


/*
=========================================================
ADMIN STATS
GET /api/admin/stats
=========================================================
*/

router.get(
    "/stats",
    protect,
    authorizeRoles("admin"),

    async (req, res) => {

        try {

            const totalUsers =
                await User.countDocuments();

            const totalStudents =
                await User.countDocuments({
                    role: "student"
                });

            const totalTeachers =
                await User.countDocuments({
                    role: "teacher"
                });

            const totalExams =
                await Exam.countDocuments();

            const activeUsers =
                await User.countDocuments({
                    isActive: true
                });

            const pendingUsers =
                await User.countDocuments({
                    role: {
                        $in: ["student", "teacher"]
                    },
                    isActive: false
                });


            res.status(200).json({

                success: true,

                stats: {

                    totalUsers,

                    totalStudents,

                    totalTeachers,

                    totalExams,

                    activeUsers,

                    pendingUsers

                }

            });


        } catch (error) {

            console.error(
                "ADMIN STATS ERROR:",
                error
            );

            res.status(500).json({

                success: false,

                message:
                    "Failed to load admin statistics"

            });

        }

    }
);


/*
=========================================================
GET ALL USERS
GET /api/admin/users
=========================================================
*/

router.get(
    "/users",
    protect,
    authorizeRoles("admin"),

    async (req, res) => {

        try {

            const users =
                await User.find()
                    .select(
                        "-password -resetPasswordToken -resetPasswordExpire"
                    )
                    .sort({
                        createdAt: -1
                    });


            res.status(200).json({

                success: true,

                users

            });


        } catch (error) {

            console.error(
                "ADMIN USERS ERROR:",
                error
            );

            res.status(500).json({

                success: false,

                message:
                    "Failed to load users"

            });

        }

    }
);


/*
=========================================================
APPROVE USER
PATCH /api/admin/users/:id/approve
=========================================================
*/

router.patch(
    "/users/:id/approve",
    protect,
    authorizeRoles("admin"),

    async (req, res) => {

        try {

            const user =
                await User.findById(
                    req.params.id
                );


            if (!user) {

                return res.status(404).json({

                    success: false,

                    message:
                        "User not found"

                });

            }


            if (user.role === "admin") {

                return res.status(400).json({

                    success: false,

                    message:
                        "Admin account does not require approval."

                });

            }


            user.isActive = true;

            user.isVerified = true;

            await user.save();


            res.status(200).json({

                success: true,

                message:
                    "User approved successfully",

                user

            });


        } catch (error) {

            console.error(
                "APPROVE USER ERROR:",
                error
            );

            res.status(500).json({

                success: false,

                message:
                    "Failed to approve user"

            });

        }

    }
);


/*
=========================================================
ACTIVATE / DEACTIVATE USER
PATCH /api/admin/users/:id/status
=========================================================
*/

router.patch(
    "/users/:id/status",
    protect,
    authorizeRoles("admin"),

    async (req, res) => {

        try {

            const user =
                await User.findById(
                    req.params.id
                );


            if (!user) {

                return res.status(404).json({

                    success: false,

                    message:
                        "User not found"

                });

            }


            if (
                user._id.toString() ===
                req.user._id.toString()
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "You cannot deactivate your own admin account"

                });

            }


            user.isActive =
                !user.isActive;


            await user.save();


            res.status(200).json({

                success: true,

                message:
                    user.isActive
                        ? "User activated successfully"
                        : "User deactivated successfully",

                user

            });


        } catch (error) {

            console.error(
                "CHANGE USER STATUS ERROR:",
                error
            );

            res.status(500).json({

                success: false,

                message:
                    "Failed to update user status"

            });

        }

    }
);


export default router;