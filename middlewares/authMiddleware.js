import jwt from "jsonwebtoken"
import env from "dotenv"
import User from "../models/user.model.js";

env.config();

const jwtSecret = process.env.JWT_SECRET


function verifyJwt(req, res, next) {
    const token = req.cookies.jwt //this is because we called the cookie 'jwt' when we created it inside authController

    //check if json web token exists and is verified
    if (token) {
        jwt.verify(token, jwtSecret, (err, decodedToken) => {
            if (err) {
                console.log(err.message)
                res.redirect("/login")
            } else {
                console.log(decodedToken)
                next(); //the next() method lets the logic that runs after the verifyJwt() function run. This would be the function that we call after the 
            }
        })
    } else {
        res.render("home.ejs", { authError: "You are not logged in, kindly login or signup then try again" })
        //res.redirect("/login")
    }
}

//check current user
export const checkUser = (req, res, next) => {
    const token = req.cookies.jwt
    if (token) {
        jwt.verify(token, jwtSecret, async (err, decodedToken) => {
            if (err) {
                console.log(err.message)
                res.locals.user = null //setting the user locals variable to null if the token does not pass the verification
                next()
            } else {
                console.log(decodedToken)
                const user = await User.findById(decodedToken.id)
                res.locals.user = user
                next(); //the next() method lets the logic that runs after the verifyJwt() function run. This would be the function that we call after the 
            }
        })
    } else {
        res.locals.user = null //setting the user locals variable to null if the token does not exist
        next()
    }

}

export default verifyJwt