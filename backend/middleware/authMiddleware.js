import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const protect = async (
  req,
  res,
  next
) => {

  try {

    let token =
      req.headers.authorization;

    console.log(
      "AUTH HEADER:",
      token
    );

    if (
      !token ||
      !token.startsWith(
        "Bearer "
      )
    ) {

      return res
      .status(401)
      .json({

        message:
        "Not authorized, token missing"

      });
    }

    token =
      token.split(
        " "
      )[1];

    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );

    console.log(
      "DECODED USER:",
      decoded
    );

    req.user =
      decoded;

    next();

  }

  catch(error){

    console.log(
      "AUTH ERROR:",
      error
    );

    return res
    .status(401)
    .json({
      message:
      "invalid token"
    });
  }
};

export const authorizeRoles =
(...roles)=>{

  return(
    req,
    res,
    next
  )=>{

    if(
      !req.user ||
      !roles.includes(
        req.user.role
      )
    ){

      return res
      .status(403)
      .json({
        message:
        "Access denied"
      });
    }

    next();
  };
};