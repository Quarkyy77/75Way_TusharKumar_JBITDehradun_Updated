import express from "express";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../database/user.model";

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { userName, email, password} = req.body;
    if (!userName || !email || !password ) {
      return res.status(400).json({
        message: "Please provide all credentials",
      });
    }
    const existingUser = await User.findOne({ email });
    console.log(existingUser);
    if (existingUser) {
      return res.status(400).json({
        message: "Already user exists",
      });
    }
    const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    const pass: RegExp =
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/;
    if (!pass.test(password.toString())) {
      return res.status(400).json({
        message: "Enter valid password with uppercase, lowercase, number & @",
      });
    }
    if (!expression.test(email.toString())) {
      return res.status(400).json({ message: "Invalid email " });
    }
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const user = new User({
      userName,
      email,
      password: hashedPassword,

    });
    await user.save();
    return res.status(200).json({
        message: "Registered"
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Incomplete Credentials",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Please Register First",
      });
    }
    const validPassword = bcryptjs.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(403).json({
        message: "Wrong Password",
      });
    }
    const authToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET_KEY || "",
      { expiresIn: "40m" }
    );
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET_KEY || "",
      { expiresIn: "1d" }
    );
    res.cookie("authToken", authToken, { httpOnly: true });
    res.cookie("refreshToken", refreshToken, { httpOnly: true });
    res.status(200).json({ message: "Successfull", userId: user._id });
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const logout = async (req: express.Request, res: express.Response) => {
  try {
    res.clearCookie("authToken");
    res.clearCookie("refreshToken");
    return res.status(200).json({
      message: "Logout Successful",
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
