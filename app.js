const express = require('express');

const db = require('./connect');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.get('/stock_transactions/all', (req, res) => {
  const myquery = 'SELECT * FROM stock_transactions';

  db.query(myquery, (err, results, fields) => {
    if (err) {
      console.log('Query failed: ' + err);
      return res.status(500).json({ error: 'Query failed' });
    }

    res.json(results); //  Send result to client
  });
});

