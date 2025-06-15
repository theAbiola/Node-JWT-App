import express from 'express';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import env from 'dotenv'
import cookieParser from 'cookie-parser';

const app = express();
const port = 5000;

env.config();

// middleware
app.use(express.static('public'));

//expecting Json from the frontend. It helps us parse the incoming json data into a JS object so we can access it through req.body
app.use(express.json())

// view engine
app.set('view engine', 'ejs');

app.use(authRoutes);

app.use(cookieParser()) //here we use the cookie-parser package as a middelware

// database connection
const dbURI = process.env.MONGO_URI;
mongoose.connect(dbURI)
  .then(() => {
    console.log("Connected to the MongoDB Server successfully")
    app.listen(port, () => {
      console.log(`Server running on port ${port}`)
    })
  })
  .catch(error => console.error(error));

// routes
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', (req, res) => res.render('smoothies'));

// app.get("/set-cookies", (req, res) => {
//   // res.setHeader("Set-Cookie", "newUser=true")
//   res.cookie("newUser", false)
//   res.cookie("isEmployee", true, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true, secure: true })

//   res.send("you have set the cookie")
// })

// app.get("/read-cookies", (req, res) => {
//   const cookies = req.cookies
//   console.log(cookies.newUser)
//   res.json({ cookies: cookies })
// })