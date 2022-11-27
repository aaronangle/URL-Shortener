DROP TABLE IF EXISTS ShortenedURLs;

CREATE TABLE ShortenedURLs (
  Id INTEGER AUTO_INCREMENT PRIMARY KEY,
  LongURL VARCHAR(500) NOT NULL,
  ShortURL VARCHAR(20) NOT NULL DEFAULT ''
);