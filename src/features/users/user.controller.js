const express = require("express");
const jwt = require("jsonwebtoken");
const argon2 = require("argon2");
require("dotenv").config();
const UserModel = require("./user.model");

const SignUp = async ({ name, email, password, phone, role, gender }) => {
  //   console.log(name, email, password, phone, role, gender);
  try {
    const getUser = await UserModel.findOne({ email });
    if (getUser) {
      //   return res.status(400).json({ message: "User already exits" });
      return { message: "NOT OK", desc: "User already exits, try to login" };
    }
    const hash = await argon2.hash(password);

    const NewUser = new UserModel({
      name,
      email,
      password: hash,
      phone,
      role,
      gender,
    });
    await NewUser.save();
    return {
      message: "OK",
      desc: "New User Registered",
    };
  } catch (error) {
    // console.log(error);
    return {
      message: error,
      desc: "User Registration Failed",
    };
  }
};

const loginUser = async ({ email, password }) => {
  // console.log(email, password);
  try {
    const getUser = await UserModel.findOne({ email });
    // console.log(getUser);
    if (!getUser) {
      return {
        desc: "User does not exits, try Sign up",
      };
    }

    if (await argon2.verify(getUser.password, password)) {
      const token = jwt.sign(
        {
          id: getUser._id,
          name: getUser.name,
          age: getUser.age,
          role: getUser.role,
        },
        process.env.signToken,
        {
          expiresIn: "14 day",
        }
      );

      // console.log(token);
      const refreshToken = jwt.sign(
        { id: getUser._id, name: getUser.name, age: getUser.age },
        process.env.refreshToken,
        { expiresIn: "28 days" }
      );
      return {
        message: "OK",
        desc: "Logged In Successfully",
        token,
        refreshToken,
        userDetails: {
          id: getUser._id,
          name: getUser.name,
          gender: getUser.gender,
          role: getUser.role,
        },
      };
    } else {
      return {
        message: "Something went wrong",
        desc: "Invalid credentials",
      };
    }
  } catch (error) {
    // console.log(error);
    return {
      message: "Something went wrong",
      desc: "Invalid credentials",
      // desc: error.message,
    };
  }
};

const authCheck = async ({ token }) => {
  try {
    if (token) {
      const decoded = jwt.verify(token, process.env.signToken);
      // console.log(decoded);
      let _id = decoded.id;
      const getUser = await UserModel.findOne({ _id });
      if (getUser) {
        return {
          isAuth: true,
          message: "OK",
          desc: "Authenticated Successfull",
          userDetails: {
            id: getUser.id,
            name: getUser.name,
            gender: getUser.gender,
            role: getUser.role,
          },
        };
      } else {
        return {
          isAuth: false,
          message: "Error",
          desc: "Invalid Token",
        };
      }
    } else {
      return {
        isAuth: false,
        message: "Error",
        desc: "Token not available",
      };
    }
  } catch (error) {
    return {
      message: "Failed in Catch Section",
      desc: error,
      isAuth: false,
    };
  }
  // console.log(getUser);
};

const resetPassword = async ({ email, password }) => {
  // console.log(email, password);

  try {
    const getUser = await UserModel.findOne({ email });
    // console.log(getUser);
    if (!getUser) {
      return {
        desc: "User does not exits, try Signing up",
      };
    }

    // console.log(getUser);

    if (getUser) {
      const hash = await argon2.hash(password);
      const updatedUser = await UserModel.findOneAndUpdate(
        { email },
        { password: hash },
        { new: true }
      );
      // console.log(updatedUser);

      return {
        message: "OK",
        desc: "Password updated successfully",
        updatedUser: updatedUser,
      };
    }
  } catch (error) {
    return {
      message: "ERROR",
      desc: error,
    };
  }
};

module.exports = { SignUp, loginUser, authCheck, resetPassword };
