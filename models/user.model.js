import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

const isEmail = validator.isEmail //validator package helps us validate that the text input is a valid email

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, "Please enter a valid email"]
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [6, 'Minimum password length is 6 characters']
    }
},
    {
        timestamps: true // createdAt, updatedAt
    }
)

//fire a function before doc is saved to db
userSchema.pre("save", async function (next) { //we use a function keyword instead of an arrow function so we can have access to 'this'
    const saltRounds = 10;
    //const salt = await bcrypt.genSalt(saltRounds); //if we wanted to use the salt instead of the shortcut of using the saltrounds, we would have to pass the salt as the second argument into the .hash() method instead
    this.password = await bcrypt.hash(this.password, saltRounds) //'this' refers to the instance of the user we are trying to create
    next()
})

// static method to login user
userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email });
    if (user) {
        const auth = await bcrypt.compare(password, user.password); // bcrypt hashes the password and compares it with the hashed password in the DB
        if (auth) {
            return user;
        }
        throw Error('incorrect password');
    }
    throw Error('incorrect email');
};

const User = mongoose.model("user", userSchema)

export default User;