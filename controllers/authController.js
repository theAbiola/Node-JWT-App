import User from "../models/user.model.js"

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
        res.status(201).json(user)
    } catch (error) {
        console.log(error.message)
        if (error.code === 11000) {
            res.status(400).json({ "Error": "Duplicate email, use a valid email" })
        } else {
            res.status(400).json({ "Error": error.message })
        }
    }

}

export const login_post = (req, res) => {
    res.send("user login")
}