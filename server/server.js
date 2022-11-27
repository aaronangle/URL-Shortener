const express = require('express');
const db = require('./db/connection');
const redis = require('./db/redis');
const apiRoutes = require('./routes');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/', apiRoutes);

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

// Start server after DB and redis connection
db.connect(err => {
  if (err) throw err;
  console.log('Database connected.');
  redis.connect(err => {
    if (err) throw err;
    console.log('Redis connected.');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });
});
