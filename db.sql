DROP DATABASE IF EXISTS hanime;
CREATE DATABASE hanime;
USE hanime;

CREATE TABLE Anime (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  synopsis TEXT,
  media_type VARCHAR(50),
  episodes INT,
  status VARCHAR(50),
  aired_from DATE,
  aired_to DATE,
  rating VARCHAR(50),
  score DECIMAL(4, 2),
  image_url VARCHAR(512)
);
