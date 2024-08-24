import { User } from '../models/user.model.js';
import bcryptjs from "bcryptjs";
import { generateTokenAndSetCookie } from '../utils/generateToken.js';

export async function signup(req, res) {
    try {
        const { email, password, username } = req.body;

        // Check if all required fields are provided
        if (!email || !password || !username) {
            return res.status(400).json({ success: false, message: "All fields are required!" });
        }

        // Validate email
        const emailregex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailregex.test(email)) {
            return res.status(400).json({ success: false, message: "Invalid email" });
        }

        // Check password length
        if (password.length < 6) {
            return res.status(400).json({ success: false, message: "Password is too short" });
        }

        // Check if email already exists
        const existingUserByEmail = await User.findOne({ email });
        if (existingUserByEmail) {
            return res.status(400).json({ success: false, message: "Email already exists" });
        }

        // Check if username already exists
        const existingUserByUsername = await User.findOne({ username });
        if (existingUserByUsername) {
            return res.status(400).json({ success: false, message: "Username already taken" });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        // Profile picture selection
        const PROFILE_PICS = ["/avatar1.png", "/avatar2.png", "/avatar3.png"];
        const image = PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)];

        // Create and save the new user
        const newUser = new User({
            email,
            password:hashedPassword,
            username,
            image
        });

        generateTokenAndSetCookie (newUser._id, res);
        await newUser.save();

         // Respond with success message
        res.status(201).json({ success: true, user:{...newUser._doc,password:""},message: "User created successfully" });        

    } catch (error) {
        console.log("Error in Signup Controller", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        const isPasswordCorrect = await bcryptjs.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        generateTokenAndSetCookie(user._id, res);
        
        res.status(200).json({
            success: true,
            user: {
                ...user._doc,
                password: "" // Do not expose password in the response
            }
        });
    } catch (error) {
        console.log("Error in Login Controller", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export async function logout(req, res) {
    try{
        res.clearCookie("jwt-netflix");
        res.status(200).json({ success: true, message: "Logged Out SuccessFully"});
    }
    catch(error){
        console.log("Error in Logout Controller", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}