const notes = require('express').Router();
const { readFromFile, writeToFile, readAndAppend } = require('../helper/fsUtils');
const { v4: uuidv4 } = require('uuid');

notes.get('/', (req, res) => {
    console.log(`${req.method} request received for notes`);
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

notes.post('/', (req, res) => {
    const { title, text } = req.body;

    if (req.body){
        const newNote = {
            title,
            text,
            id: uuidv4()
        };

        readAndAppend(newNote, './db/db.json');
        const response = {
            status: 'success',
            body: newNote,
        };

        res.json(response);
    } else {
        res.error('Error in adding note.');
    }
});


notes.delete('/notes/:id', (req, res) => {
    console.log(req.params.id);
    const deleteNote = req.params.id;
    readFromFile("db/db.json")
      .then((data) => JSON.parse(data))
      .then((json) => {
        const deleteId = json.filter((app) => app.id !== deleteNote);
        writeToFile("db/db.json", deleteId);
        res.json(`Item ${deleteNote} has been deleted`);
      });
});


module.exports = notes;