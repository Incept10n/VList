const User = require('../models/user');
const crypto = require('crypto');

module.exports.login = async function(req, res) {
  const users = await User.find({
    name: req.body.username,
    password: req.body.password,
  }).exec();

  if (users.length === 1) {
    res.status(200).json({
      message: "Logged in!",
      hash: users[0].loginHash,
    });
  } else {
    res.status(401).json({error: "Wrong username or password"});
  }
}

module.exports.signup = async function(req, res) {
  const hashString = `${req.body.username} ${req.body.email} ${req.body.password}`;
  const logHash = crypto.createHash('sha256').update(hashString).digest('hex');
  
  const newUser = new User({
    name: req.body.username,
    email: req.body.email,
    password: req.body.password,
    loginHash: logHash,
  });

  if ((await User.find({name: req.body.username})).length != 0) {
    res.status(409).json({
      error: 'This username already exists, try again',
    });
  } else {
    await newUser.save();

    res.status(200).json({
      message: 'Added to the database',
      hash: logHash,
    });
  }
}
