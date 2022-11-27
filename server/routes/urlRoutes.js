const express = require('express');
const router = express.Router();
const encodeURL = require('../utils/encodeURL');
const runDBQuery = require('../utils/runDBQuery');
const { readCache, writeCache } = require('../utils/cache');
const path = require('path');

const ONEDAYINSECONDS = 86400;

router.get('/:shortURL', async (req, res) => {
  const { shortURL } = req.params;

  const sql = `SELECT * FROM ShortenedURLs WHERE ShortURL = ? LIMIT 1`;
  const params = [shortURL];

  try {
    const cacheResults = await readCache(shortURL);
    if (cacheResults) {
      const url = cacheResults;
      res.redirect(301, url);
    } else {
      const row = await runDBQuery(sql, params);
      if (row.length) {
        await writeCache(shortURL, row[0].LongURL, ONEDAYINSECONDS);
        res.redirect(301, row[0].LongURL);
      } else {
        throw new Error('URL not found!');
      }
    }
  } catch (err) {
    res.status(404).sendFile(path.resolve('./html/404.html'));
  }
});

router.post('/createURL', async (req, res) => {
  const { longURL } = req.body;

  const insertSQL = `INSERT INTO ShortenedURLs (LongURL) VALUES(?)`;
  const params = [longURL];

  try {
    const row = await runDBQuery(insertSQL, params);
    const shortURL = encodeURL(row.insertId);

    const updateSQL = `UPDATE ShortenedURLs SET ShortURL = ? WHERE Id = ?`;
    const par = [shortURL, row.insertId];
    await runDBQuery(updateSQL, par);

    await writeCache(shortURL, longURL, ONEDAYINSECONDS);

    res.json({
      message: 'success',
      data: 'http://localhost:3001/' + shortURL,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
