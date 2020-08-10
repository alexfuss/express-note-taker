// Require the proper packages
const util = require("util");
const fs = require("fs");

// Setup asynchronous JS
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

// Create a class of notes with an initially empty constructor
class Notes {
    constructor() {
        this.idDum = 0;
    }
    read() {
        return readFileAsync("../db/db.json", "utf8");
    }

    write(note) {
        return writeFileAsync("../db/db.json", JSON.stringify(note))
    }

    getNotes() {
        console.log("get notes")
        return this.read().then((notes) => {
            console.log(notes)
            let notesArr;
            try {
                notesArr = [].concat(JSON.parse(notes));
            }
            catch (err) {
                notesArr = [];
            }
            return notesArr;
        })
    }

    addNotes(note) {
        console.log("add note");
        const { title, text } = note;
        const newNote = { title, text, id: ++this.idDum }
        return this.getNotes()
            .then((notes) => [...notes, newNote])
            .then((updateNotes) => this.write(updateNotes))
            .then(() => newNote)
    }

    removeNote(id) {
        console.log("remove notes");
        return this.getNotes()
            .then(notes => notes.filter(note => note.id !== parseInt(id)))
            .then(updatedNotes => this.write(updatedNotes))
    }
}

module.exports = new Notes();