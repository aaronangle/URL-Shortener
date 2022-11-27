const express = require('express');
const router = express.Router();
const encodeURL = require('../utils/encodeURL');
const runDBQuery = require('../utils/runDBQuery');
const redisClient = require('../db/redis');
const path = require('path');

router.get('/:shortURL', async (req, res) => {
  const sql = `SELECT * FROM ShortenedURLs WHERE ShortURL = ? LIMIT 1`;
  const params = [req.params.shortURL];

  try {
    const cacheResults = await redisClient.get(req.params.shortURL);
    if (cacheResults) {
      const url = JSON.parse(cacheResults);
      res.redirect(301, url);
    } else {
      const row = await runDBQuery(sql, params);
      if (row.length) {
        await cacheUrl(req.params.shortURL, row[0].LongURL);
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
  const insertSQL = `INSERT INTO ShortenedURLs (LongURL) VALUES(?)`;
  const params = [req.body.LongURL];

  try {
    const row = await runDBQuery(insertSQL, params);
    const shortURL = encodeURL(row.insertId);

    const updateSQL = `UPDATE ShortenedURLs SET ShortURL = ? WHERE Id = ?`;
    const par = [shortURL, row.insertId];
    await runDBQuery(updateSQL, par);

    await cacheUrl(shortURL, req.body.LongURL);

    res.json({
      message: 'success',
      data: 'http://localhost:3001/' + shortURL,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

async function cacheUrl(shortURL, longURL) {
  await redisClient.set(shortURL, JSON.stringify(longURL), {
    EX: 86400, //24 hours in seconds
    NX: true,
  });
}

module.exports = router;
