const Note = require('../models/note');
const User = require('../models/user');

module.exports.putNoteInDatabase = async function(req, res) {
  const noteToAdd = new Note({
    user: req.body.name,
    noteName: req.body.header,
    noteContain: req.body.contains,
  });

  await noteToAdd.save();

  res.status(200).json({
    message: 'The note has successfully been added!',
  });
}

module.exports.getNoteFromDatabase = async function(req, res) {
  const allNotes = await Note.find({user: `${req.params.username}`}).exec();

  const allNotesFormated = [];

  for (const note of allNotes) {
    allNotesFormated.push({
      heading: note.noteName,
      content: note.noteContain,
      id: note._id,
    });
  }

  res.status(200).json({
    notes: allNotesFormated,
  });
}

module.exports.deleteNoteFromDatabase = async function(req, res) {
  await Note.findByIdAndDelete(`${req.params.noteId}`).exec();

  res.status(200).send();
}

module.exports.updateNote = async function(req, res) {
  const updateFields = {
    noteName: req.body.header,
    noteContain: req.body.contains,
  };

  await Note.findByIdAndUpdate(`${req.body.id}`, updateFields);

  res.status(200).send();
}

module.exports.validateUser = async function(req, res) {
  const user = await User.find({name: req.body.username, loginHash: req.body.hash});

  if (user.length === 1) {
    res.status(200).send();
  } else {
    res.status(401).send();
  }
}
