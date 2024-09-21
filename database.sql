-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS tiktok_likes;

-- Select the database
USE tiktok_likes;

-- Table for users
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE
);

-- Table for tracking like counts
CREATE TABLE IF NOT EXISTS like_counts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255),
  likes INT DEFAULT 0,
  FOREIGN KEY (username) REFERENCES users(username)
);

-- Table for tracking followed users
CREATE TABLE IF NOT EXISTS followed (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255),
  FOREIGN KEY (username) REFERENCES users(username)
);
