const express = require('express');
const router = express.Router();


const noteController = require('../controllers/noteController.js');

router.post('/write/:username', noteController.putNoteInDatabase);
router.get('/getAllNotes/:username',noteController.getNoteFromDatabase);
router.get('/deleteNote/:noteId', noteController.deleteNoteFromDatabase);
router.post('/updateNote', noteController.updateNote);
router.post('/validateIdentity', noteController.validateUser);


module.exports = router;
