const express = require("express");
const cors = require("cors");
const app = express();
const port = 3001;
const connection = require("./config");

app.use(cors());
app.use(express.json());

app.listen(port, () => console.log(`Example app listening on port port!`));

connection.connect(function (err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected as id " + connection.threadId);
});

//Affichage Liste
app.get("/list", (req, res) => {
    const sqlSelect = "SELECT * FROM wishlist.list";
    connection.query(sqlSelect, (err, result) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).json(result)
      }
    });
  });
//Formulaire Liste
app.post("/list", (req, res) => {
    const listName = req.body.name;
    const listPrice = req.body.price;
    const listUrl = req.body.url;
    const sqlInsert =
      " INSERT INTO wishlist.list (name, price, url) VALUE (?, ?, ?)";
    connection.query(sqlInsert, [listName, listPrice, listUrl], (err, result) => {
      if(err) {
        res.status(500).send(err);
      } else if(result.affectedRows < 1) {
        res.sendStatus(404);
      } else {
        res.status(201).json({
          id: result.insertId,
        });
      }
    });
  });
  //Formulaire Inscription
  app.post('/register', (req, res) => {
    const regUsername = req.body.username;
    const regPassword = req.body.password;
    const regEmail = req.body.email;
    const regBirthday = req.body.birthday;
    const sqlInsert =
      " INSERT INTO wishlist.user (username, password, email, birthday) VALUE (?, ?, ?, ?)";
    connection.query(sqlInsert, [regUsername, regPassword, regEmail, regBirthday], (err, result) => {
      if(err) {
        res.status(500).send(err);
      } else if(result.affectedRows < 1) {
        res.sendStatus(404);
      } else {
        res.status(201).json({
          id: result.insertId,
        });
      }
    })
  });

  // Supprimer un souhait via l'id
  app.delete('/list/:idlist', (req, res) => {
    const id = req.params.idlist;
    const sqlDelete = 'DELETE FROM wishlist.list WHERE idlist=?';
  connection.query(sqlDelete, [id], (err, results) => {
      if (err) {
        res.status(500).send("Error deleting");
        console.log(err)
      } else {
        res.status(200).send("deleted!");
      }
    }
  );
});