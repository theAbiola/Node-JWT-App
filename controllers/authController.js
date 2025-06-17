import jwt from "jsonwebtoken"
import User from "../models/user.model.js"
import env from "dotenv"

env.config();

//Create Json web token
const jwtSecret = process.env.JWT_SECRET

const jwtMaxAge = 3 * 24 * 60 * 60 //3 days because this one is in seconds

function createToken(id) {
    return jwt.sign({ id }, jwtSecret, {
        expiresIn: jwtMaxAge
    })
}

//Controller actions
export const signup_get = (req, res) => {
    res.render("signup")
}

export const login_get = (req, res) => {
    res.render("login")
}

export const signup_post = async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await User.create({ email, password })
        const token = createToken(user._id)
        res.cookie("jwt", token, { httpOnly: true, maxAge: jwtMaxAge * 1000 }) //3 days also but this one is in miliseconds //we create the cookie, call it jwt, and pass the call to the createToken() function inside it.
        res.status(201).json({ user: user._id })
    } catch (error) {
        console.log(error.message)
        if (error.code === 11000) {
            res.status(400).json({ error: "Duplicate email, use a valid email" })
        } else if (error.message.includes("user validation failed: password:")) {
            res.status(400).json({ error: "Minimum password length is 6 characters" })
        } else {
            res.status(400).json({ error: error.message })
        }
    }

}

export const login_post = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password); //the .login() method is coming from the serSchema.statics.login func created inside the user model
        const token = createToken(user._id)
        res.cookie("jwt", token, { httpOnly: true, maxAge: jwtMaxAge * 1000 }) //3 days also but this one is in miliseconds
        res.status(201).json({ user: user._id })
    } catch (err) {
        res.status(400).json({ error: "Incorrect email or password" }); // we send this custom json so the user doesn't it's an incorrect password or an incorrect email
        console.log(err.message) // we log the actual err.message so only us know if it's an incorrect password or email
    }

}