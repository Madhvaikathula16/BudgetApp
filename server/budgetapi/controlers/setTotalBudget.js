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

// setBudget function
function setBudget(category, amount, userId, startdate, enddate) {
  return new Promise((resolve, reject) => {
    // First, find the CategoryID for the given category
    pool.query(
      "SELECT CategoryID FROM Categories WHERE CategoryName = ?",
      [category],
      (err, results) => {
        if (err) {
          return reject(err);
        }

        if (results.length === 0) {
          return reject(new Error("Category not found"));
        }

        const categoryId = results[0].CategoryID;

        // Now, insert into Budgets table
        const budgetQuery =
          "INSERT INTO Budgets (UserID, CategoryID, Amount, StartDate, EndDate) VALUES (?, ?, ?, ?, ?)";
        pool.query(
          budgetQuery,
          [userId, categoryId, amount, startdate, enddate],
          (err, insertResults) => {
            if (err) {
              return reject(err);
            }

            resolve(insertResults);
          }
        );
      }
    );
  });
}

module.exports = { setBudget };
