import jwt from "jsonwebtoken"
import env from "dotenv"

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
        res.redirect("/login")
    }
}

export default verifyJwt