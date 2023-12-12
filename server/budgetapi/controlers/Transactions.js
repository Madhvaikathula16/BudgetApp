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

// Function to record a transaction as a Promise
function recordTransaction(userId, categoryName, amount, date, description) {
  return new Promise((resolve, reject) => {
    // Query the category ID based on category name
    pool.query(
      "SELECT CategoryID FROM Categories WHERE CategoryName = ?",
      [categoryName],
      (err, results) => {
        if (err) {
          reject(err);
        }

        if (results.length === 0) {
          reject(new Error("Category not found"));
        }

        const categoryId = results[0].CategoryID;

        // Insert the transaction
        const transaction = {
          UserID: userId,
          CategoryID: categoryId,
          Amount: amount,
          Date: date,
          Description: description,
        };
        pool.query(
          "INSERT INTO Transactions SET ?",
          transaction,
          (err, results) => {
            if (err) {
              reject(err);
            }
            resolve(results.insertId); // Resolve with the ID of the inserted record
          }
        );
      }
    );
  });
}

// Function to fetch transactions for a user as a Promise
function fetchTransactions(userId) {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT T.*, C.CategoryName FROM Transactions T JOIN Categories C ON T.CategoryID = C.CategoryID WHERE T.UserID = ?",
      [userId],
      (err, results) => {
        if (err) {
          reject(err);
        }
        resolve(results); // Resolve with the fetched transactions including the category name
      }
    );
  });
}

module.exports = { recordTransaction, fetchTransactions };
