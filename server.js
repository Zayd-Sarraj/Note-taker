const express = require("express");
const path = require("path");
const fs = require("fs")

var app = express();
var PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

var notes = []
var id = 1

// HTML Routes
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

// API Routes
app.get("/api/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/assets/db.json"));
});

// CSS and index.js routes
app.get("/assets/js/index.js", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/assets/js/index.js"));
});

app.get("/assets/css/styles.css", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/assets/css/styles.css"));
});

// Create New Note
app.post("/api/notes", function (req, res) {
    var newNote = req.body;
    notes.forEach(function (note) {
        if (note.id === id) {
            id++
        }
    })
    newNote.id = id;
    console.log(newNote);
    notes.push(newNote);
    var json = JSON.stringify(notes)
    fs.writeFile(path.join(__dirname, "/public/assets/db.json"), json, function (error) {
        if (error) { console.log(error) }
    })
    res.json(notes)
});

// Delete note based on id
app.delete("/api/notes/:id", function (req, res) {
    var chosenid = req.params.id;
    console.log(chosenid);

    for (let i = 0; i < notes.length; i++) {
        if (notes[i].id === parseInt(chosenid)) {
            // If the ID matches, remove the object from the array
            notes.splice([i], 1);
            var json = JSON.stringify(notes)
            fs.writeFile(path.join(__dirname, "/public/assets/db.json"), json, function (error) {
                if (error) { console.log(error) }
            })
            return console.log("Note with ID of " + chosenid + " deleted")
        }
    }
    console.log("No notes with this id!")
});


// Start server
app.listen(PORT, function () {
    // Read the database file and append the note data to the notes array
    fs.readFile(path.join(__dirname, "/public/assets/db.json"), function (err, data) {
        if (err) { console.log(err) }
        else { notes = JSON.parse(data) }
    })
    console.log("App listening on PORT " + PORT);
});
