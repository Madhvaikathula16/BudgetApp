import React, { useState } from "react";
import { useSelector } from "react-redux";
import styles from "./stylesfolder/Personal.module.css";
import { useNavigate } from "react-router-dom";

export default function Personal() {
  const userDetails = useSelector((state) => state.auth);
  const UserId = userDetails.user.UserID;
  const navigate = useNavigate();
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const budgetData = {
      category,
      amount: parseFloat(amount),
      userId: UserId,
      startdate: startDate,
      enddate: endDate,
    };
    console.log("Budget Data:", budgetData);
    // Here we are  calling  the API to submit this data
    fetch("https://1xd68kh5m1.execute-api.us-east-2.amazonaws.com/set-budget", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(budgetData),
    })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
    navigate("/home");
  };

  return (
    <div className={styles.personalcontainer}>
      <h1>Set the Budget For Different Cartegories</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Category:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select a Category</option>
            <option value="Initial Category">Initial Category</option>
            <option value="Grocery">Grocery</option>
            <option value="Entertainment">Entertainment</option>
            <option value="FinantialDues">Finantial Dues</option>
            <option value="Insurance">Insurance</option>
            <option value="Education">Education</option>
            <option value="Clothing">Clothing</option>
            <option value="Savings and Investment">
              Savings and Investment
            </option>
            <option value="TotalBudget">Total Budget</option>
          </select>
        </div>
        <div>
          <label>Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div>
          <label>Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label>End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
