// Express is used for easy get and post response 
const express = require('express')
const app = express()
// Child_process is for running python scripts under the hood
const { spawn } = require('child_process');
var path = require('path'); // Help support pathing
// MySQL handler
// Documentation https://sidorares.github.io/node-mysql2/docs#first-query
var mysql = require('mysql2');

const port = 8081

/////////////////// CONNECTING SERVER TO MYSQL //////////////////
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  port: '3306',
  password: "root"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});
////////////////////////////////////////////////////////////////


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/html/index.html'));
})

// Example GET API that inputs any command into SQL
app.get('/myGETAPI', (req, res) => {
  // Grabbing the GET data sent into the website
  response = {
    // You can reference the index.html and see that we are Querying for the Name object
    Name:req.query.changeMeToQuery
  }
  console.log("You entered: " + response.Name)
  res.send(response.Name);
});

// Displaying database in console.log
// Example GET API with using Node.JS to interface with SQL
app.get('/showDatabase', (req, res) => {
  con.query("SHOW DATABASES", function (err, result) {
    var sql_res = "Displaying Databases\n"
    if (err) {
      throw (err)
    } else {
      console.log('Executed SHOW DATABASES Command Succesfully');
      var i = 0
      result.forEach((object) => {
        i = i + 1
        sql_res = sql_res + 'Database ' + i + ' ' + object.Database + '\n'
        })
      console.log(sql_res)
    }
  })

  res.send("Success!");
});

// Example GET_API for using a python script
app.get('/createDatabasePYTHON', (req, res) => {
  // Grabbing the GET data sent into the website
  response = {
    // You can reference the index.html and see that we are Querying for the Name object
    Name:req.query.changeMeToQuery
  }
  let python = spawn('py', [path.join(__dirname) + '/python/create_database.py', response.Name]);
  python.stdout.on('data', function (data) {
        console.log("PYTHON SENT: ", data.toString());
      });
  python.on('close', (code) => {
    console.log(`Finished Python Script with Exit Code: ${code}`); 
  });
  res.send("Created Database");
});



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})