const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const createToken = (userId) => {
    return jwt.sign(
        {
            id: userId,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d",
        }
    );
};

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite:
        process.env.NODE_ENV === "production"
            ? "none"
            : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
};

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                error: "All fields are required.",
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                error: "Password must be at least 6 characters.",
            });
        }

        const existingUser = await User.findOne({
            email: email.toLowerCase(),
        });

        if (existingUser) {
            return res.status(409).json({
                error: "Email is already registered.",
            });
        }

        const hashedPassword = await bcrypt.hash(
            password,
            12
        );

        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
        });

        const token = createToken(user._id);

        res.cookie("token", token, cookieOptions);

        res.status(201).json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error("Register error:", error);

        res.status(500).json({
            error: "Unable to create account.",
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({
            email: email.toLowerCase(),
        });

        if (!user) {
            return res.status(401).json({
                error: "Invalid email or password.",
            });
        }

        const validPassword = await bcrypt.compare(
            password,
            user.password
        );

        if (!validPassword) {
            return res.status(401).json({
                error: "Invalid email or password.",
            });
        }

        const token = createToken(user._id);

        res.cookie("token", token, cookieOptions);

        res.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error("Login error:", error);

        res.status(500).json({
            error: "Unable to login.",
        });
    }
};

const logout = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite:
            process.env.NODE_ENV === "production"
                ? "none"
                : "lax",
    });

    res.json({
        message: "Logged out successfully.",
    });
};

const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select(
            "-password"
        );

        if (!user) {
            return res.status(404).json({
                error: "User not found.",
            });
        }

        res.json({
            user,
        });
    } catch (error) {
        res.status(500).json({
            error: "Unable to get user.",
        });
    }
};

module.exports = {
    register,
    login,
    logout,
    getMe,
};