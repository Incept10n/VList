require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();

const connectUrl = process.env.MONGO_URL;
// const connectUrl = MONGO_URL;

main().catch((err) => {console.log(err);});

async function main() {
  try {
    await mongoose.connect(connectUrl);
    console.log("MongoDB Connected Successfully");
  } catch (err) {
    console.error("MongoDB Connection Error:", err);
  }
}

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// general app configuration
app.use("/", express.static("public/"));

const aunthRoute = require('./routes/aunth.js');
const mainPageRoute = require('./routes/main-page.js');

app.use('/auth', aunthRoute);
app.use('/main-page', mainPageRoute);

app.get('/', (req, res) => {
  res.redirect("/welcome");
});

app.listen(3000);
