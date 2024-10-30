const adminModel = require("../AdminModels/adminAuth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) res.status(400).json({
            message: "Please Enter both Email and Password",
            success: false
        });

        const admin = await adminModel.findOne({ email });

        if (!admin) return res.status(400).json({
            message: "Username or Password is Incorrect...",
            success: false
        });

        const pswd = await bcrypt.compare(password, admin?.password);

        if (!pswd) return res.status(400).json({
            message: "Username or Password is Incorrect...",
            success: false
        });

        const token = jwt.sign({ userId: admin._id, timeStamp: Date.now() }, process.env.JWT_SECRET, {
            expiresIn: '10d'
        })

        res.cookie("adminjwt", token, {
            maxAge: 15 * 24 * 60 * 60 * 1000,
            httpOnly: true,
        })
        return res.status(200).json({
            message: "Logged in Successfully",
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal Error",
            success: false
        });
    }
}


exports.Logout = async (req, res) => {
    try {
        res.cookie("adminjwt", "", {
            maxAge: 0,
            httpOnly: true,
        })
        return res.status(200).json({
            message: "Logged out successfully",
            success: true
        });
    } catch (error) {
        res.status(500).json({
          message: "Failed to logout",
          success: false
        });
    }
}