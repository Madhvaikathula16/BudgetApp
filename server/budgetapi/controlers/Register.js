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

// RegisterUser function
async function RegisterUser(formdata) {
  return new Promise((resolve, reject) => {
    // Insert user into Users table
    pool.query(
      "INSERT INTO Users (Username, Password, Email) VALUES (?, ?, ?)",
      [formdata.username, formdata.password, formdata.email],
      (err, userResult) => {
        if (err) {
          return reject(err);
        }

        // Get the ID of the inserted user
        const userId = userResult.insertId;

        // Get the ID of the inserted category
        const categoryId = 1;

        // Insert initial budget into Budgets table
        pool.query(
          "INSERT INTO Budgets (UserID, CategoryID, Amount, StartDate, EndDate) VALUES (?, ?, 0, NOW(), NOW())",
          [userId, categoryId],
          (err) => {
            if (err) {
              return reject(err);
            }

            resolve({
              message:
                "User, initial category, and initial budget created successfully",
            });
          }
        );
      }
    );
  });
}

module.exports = { RegisterUser };
