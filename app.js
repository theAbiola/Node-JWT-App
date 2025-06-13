import express from 'express';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import env from 'dotenv'

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