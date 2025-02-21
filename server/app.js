const express = require('express');
const mongoose = require('mongoose');
const app = express();

const connectUrl =
  `mongodb+srv://viox:M6674387Dm@vlisttestdatabase.sqmp0fr.mongodb.net/app-data?retryWrites=true&w=majority`;

main().catch((err) => {console.log(err);});

async function main() {
  await mongoose.connect(connectUrl);
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
