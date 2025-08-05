// db.js
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: "localhost",
  user: 'root',
  password: 'n3u3da!',
  database: 'financial_db'
});

connection.connect((err) => {
  if (err) {
    console.log(' MySQL connection failed');
    console.log(err);
    return;
  }
  console.log(' MySQL connected, ID: ' + connection.threadId);
});

module.exports = connection;
