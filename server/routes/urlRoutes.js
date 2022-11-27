const express = require('express');
const router = express.Router();
const encodeURL = require('../utils/encodeURL');
const runDBQuery = require('../utils/runDBQuery');
const path = require('path');

router.get('/:shortURL', async (req, res) => {
  const sql = `SELECT * FROM ShortenedURLs WHERE ShortURL = ? LIMIT 1`;
  const params = [req.params.shortURL];

  try {
    const row = await runDBQuery(sql, params);
    if (row.length) {
      res.redirect(301, row[0].LongURL);
    } else {
      throw new Error('URL not found!');
    }
  } catch (err) {
    res.status(404).sendFile(path.resolve('./html/404.html'));
  }
});

router.post('/createURL', async (req, res) => {
  const insertSQL = `INSERT INTO ShortenedURLs (LongURL) VALUES(?)`;
  const params = [req.body.LongURL];

  try {
    const row = await runDBQuery(insertSQL, params);
    const shortURL = encodeURL(row.insertId);
    console.log(shortURL);

    const updateSQL = `UPDATE ShortenedURLs SET ShortURL = ? WHERE Id = ?`;
    const par = [shortURL, row.insertId];
    await runDBQuery(updateSQL, par);

    res.json({
      message: 'success',
      data: 'http://localhost:3001/' + shortURL,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
