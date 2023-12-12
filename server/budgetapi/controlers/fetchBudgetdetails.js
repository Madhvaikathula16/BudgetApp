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

// fetchBudget function
function fetchBudget(userId) {
  return new Promise((resolve, reject) => {
    const query = `
        SELECT c.CategoryName, b.Amount AS BudgetAmount, b.StartDate, b.EndDate 
        FROM Budgets b
        INNER JOIN Categories c ON b.CategoryID = c.CategoryID
        WHERE b.UserID = ?
      `;

    pool.query(query, [userId], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
}

module.exports = { fetchBudget };
