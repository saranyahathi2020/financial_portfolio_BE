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
  const sql = 'SELECT * FROM stock_transactions ORDER BY transaction_date DESC, id DESC';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).send('Error fetching transactions');
    res.send(results);
  });
});

// app.get('/stock_transactions/all', (req, res) => {
//   const myquery = 'SELECT * FROM stock_transactions';

//   db.query(myquery, (err, results, fields) => {
//     if (err) {
//       console.log('Query failed: ' + err);
//       return res.status(500).json({ error: 'Query failed' });
//     }

//     res.json(results); //  Send result to client
//   });
// });

app.post('/transactions/buy', (req, res) => {
  const { company, quantity } = req.body;

  if (!company || !quantity) {
    return res.status(400).send('Company and quantity are required');
  }

  // Get current date
  const transaction_date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  // Fetch latest stock details from existing table
  const fetchSQL = `
    SELECT ticker, current_price AS buy_price
    FROM stock_transactions
    WHERE company = ?
    ORDER BY transaction_date DESC
    LIMIT 1
  `;

  db.query(fetchSQL, [company], (err, results) => {
    if (err) {
      console.error('Error fetching stock details:', err);
      return res.status(500).send('Error fetching stock data');
    }

    if (results.length === 0) {
      return res.status(404).send('Company not found in database');
    }

    const { ticker, buy_price } = results[0];
    const buy_price_float = parseFloat(buy_price);
const current_price = parseFloat((buy_price_float + Math.random() * 10 - 5).toFixed(2));
const total_cost = quantity * buy_price_float;
const market_value = quantity * current_price;
const gain_loss = parseFloat((market_value - total_cost).toFixed(2));

    

    const insertSQL = `
      INSERT INTO stock_transactions (
        transaction_date, ticker, company, action, quantity, buy_price, total_cost,
        current_price, market_value, gain_loss
      ) VALUES (?, ?, ?, 'Buy', ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      insertSQL,
      [
        transaction_date, ticker, company, quantity, buy_price, total_cost,
        current_price, market_value, gain_loss
      ],
      (err, result) => {
        if (err) {
          console.error('Insert error:', err);
          return res.status(500).send('Error inserting buy transaction');
        }
        res.send({ message: 'Buy transaction added', id: result.insertId });
      }
    );
  });
});
