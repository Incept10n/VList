const mongoose = require('mongoose');

const noteSchema = mongoose.Schema({
  user: { type: String, required: true},
  noteName: {type: String, required: true},
  noteContain: { type: String },
});

module.exports = mongoose.model('Note', noteSchema);
