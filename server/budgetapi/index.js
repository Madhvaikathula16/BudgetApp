const serverless = require("serverless-http");
const express = require("express");
const app = express();
const { handleLogin, getUserDetails } = require("./controlers/Logincontroler");
const { RegisterUser } = require("./controlers/Register");
const { fetchBudget } = require("./controlers/fetchBudgetdetails");
const { setBudget } = require("./controlers/setTotalBudget");
const {
  recordTransaction,
  fetchTransactions,
} = require("./controlers/Transactions.js");

const cors = require("cors");
const mysql = require("mysql");
app.use(express.json());
const cookieParser = require("cookie-parser");
const path = require("path");

//--------------------------------- Setup CORS options -----------------------------------
const corsOptions = {
  origin: "*", // Allows all origins
  methods: "*", // Allows all HTTP methods
  allowedHeaders: "*", // Allows all headers
};

app.use(cors(corsOptions));

app.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from root!",
  });
});
// ----------------- Authenticate User --------------------------------------
app.post("/authenticate", async (req, res) => {
  try {
    const { userId, password } = req.body; // Corrected this line
    const data = await handleLogin(userId, password);
    if (data) {
      res.status(200).send(data);
    } else {
      res.status(401).send("Authentication failed"); // Or a more appropriate message
    }
  } catch (err) {
    console.error(err); // Log the error for debugging purposes
    res.status(500).send("Internal Server Error");
  }
});

// ---------------- End ----------------------------------------
//-------------------- Register -------------------------
app.post("/register", async (req, res) => {
  try {
    const formdata = req.body;
    const result = await RegisterUser(formdata);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//----------------------end -----------
//----------------- fetching the budget -----------------------
app.post("/fetch-budget", async (req, res) => {
  try {
    const { userId } = req.body;
    const budgetData = await fetchBudget(userId);
    res.status(200).json(budgetData);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

//-----------------end fetching -----------------------
//-----------  setting the budget ----------------
app.post("/set-budget", async (req, res) => {
  try {
    const { category, amount, userId, startdate, enddate } = req.body;
    const result = await setBudget(
      category,
      amount,
      userId,
      startdate,
      enddate
    );
    res.status(200).json({ message: "Budget set successfully", result });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

//------------------------------------------------
//----------------- Record  Transaction----------------
app.post("/record-transaction", (req, res) => {
  const { userId, categoryName, amount, date, description } = req.body;

  // Call the recordTransaction function
  recordTransaction(userId, categoryName, amount, date, description)
    .then((insertId) => {
      res.json({ message: "Transaction recorded", id: insertId });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

//---------------- End ---------------------

//-------------- Fetch Transactions -----------------
app.post("/fetch-transactions", (req, res) => {
  const { userId } = req.body;

  // Call the fetchTransactions function
  fetchTransactions(userId)
    .then((transactions) => {
      res.json({ transactions });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

//-----------------------------------------
// -------- Fetch users ------------
// POST route to get user details
app.post("/user-details", (req, res) => {
  const { userId } = req.body;

  getUserDetails(userId)
    .then((user) => {
      if (user.length === 0) {
        return res.status(404).send("User not found");
      }
      res.json(user);
    })
    .catch((error) => {
      res.status(500).send(error.message);
    });
});
// -----------------------------
app.get("/path", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from path!",
  });
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports.handler = serverless(app);
