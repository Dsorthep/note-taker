// Dependencies
const express = require("express");
const path = require("path");
const fs = require('fs');
// const shortid = require("shortid"); // library for creating a unique id 

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
    
  fs.readFile("public/db/db.json", function(error,data) {
      if (error) {
        throw error;
      };
      let allNotes = JSON.parse(data);
      return res.json(allNotes);
    });
 
});

// This saves the notes
app.post('/api/notes', (req, res) => {
  
    fs.readFile("public/db/db.json", function(error, data) {
      if (error) {
        throw error;
      };
      let allNotes = JSON.parse(data);

      let newNote = {
        title: req.body.title,
        text: req.body.text,
        // id: shortid.generate()
      }

      allNotes.push(newNote);
      
      fs.writeFile("public/db/db.json", JSON.stringify(allNotes, null, 2), (error) => {
        if (error) {
          throw error;
        };
        res.send('200');
      });

    });

  });

  app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });