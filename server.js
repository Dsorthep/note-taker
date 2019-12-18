// Dependencies
const express = require("express");
const path = require("path");
const fs = require('fs');


// Using Express and PORT 
const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));


// Routes
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});


app.get("/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "public", "notes.html"));
});

// This displays the notes

app.get("/api/notes", function(req, res) {
    
  fs.readFile(__dirname + "public/db/db.json", "utf8", function(err,data) {
      if (err) {
        throw err;
      };
      let allNotes = JSON.parse(data);
      return res.json(allNotes);
    });
 
});

// This saves the notes
app.post('/api/notes', (req, res) => {
  
    fs.readFile(__dirname + "public/db/db.json", "utf8", function(err, data) {
      if (err) {
        throw err;
      };
      let allNotes = JSON.parse(data);

      let newNote = {
        title: req.body.title,
        text: req.body.text,
      }

      allNotes.push(newNote);
      
      fs.writeFile(__dirname + "public/db/db.json", JSON.stringify(allNotes, null, 2), (err) => {
        if (err) {
          throw err;
        };
        res.send('200');
      });

    });

  });

  // This deletes the notes
app.delete('/api/notes/:id', (req, res) => {
  let chosen = req.params.id;

  fs.readFile(__dirname + "public/db/db.json", "utf8", function (err,data) {
    if (err) throw err;
    let allNotes = JSON.parse(data);
    
    function searchChosen(chosen, allNotes) {
      for (var i=0; i < allNotes.length; i++) {
          if (allNotes[i].id === chosen) {
              allNotes.splice(i, 1);  
          }
      }
    }

    searchChosen(chosen,allNotes);

    fs.writeFile(__dirname + "public/db/db.json", JSON.stringify(allNotes, null, 2), (err) => {
      if (err) throw err;
      res.send('200');
    });

  });

});


  app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });