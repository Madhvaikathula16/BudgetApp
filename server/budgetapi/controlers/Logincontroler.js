const cookieParser = require("cookie-parser");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const express = require("express");
const mysql = require("mysql");

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const handleLogin = async (userId, password) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT *  FROM Users WHERE Email = ? and Password = ?";
    pool.query(sql, [userId, password], (err, results) => {
      if (err) {
        reject({ Login: false, error: err.message });
      }
      // query with no error
      else if (results.length > 0) {
        resolve({
          Login: { Login: true },
          userDetails: results[0],
        });
      }
      //if wrong userid and password
      else {
        resolve({ Login: false });
      }
    });
  });
};

// Function to get user details
function getUserDetails(userId) {
  return new Promise((resolve, reject) => {
    const query =
      "SELECT UserID, Username, Email, CreateDate FROM Users WHERE UserID = ?";

    pool.query(query, [userId], (error, results) => {
      if (error) {
        return reject(error);
      }

      resolve(results);
    });
  });
}

module.exports = { handleLogin, getUserDetails };
