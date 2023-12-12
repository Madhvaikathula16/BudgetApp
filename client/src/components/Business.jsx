import React, { useState } from "react";
import styles from "./stylesfolder/Business.module.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Business() {
  const navigate = useNavigate();
  const userDetails = useSelector((state) => state.auth);
  const UserId = userDetails.user.UserID;

  // State variables for the form
  const [categoryName, setCategoryName] = useState("Grocery");
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  // Handler for form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const FormData = {
      userId: UserId, // Make sure this key matches the server's expected key
      categoryName,
      amount,
      date,
      description,
    };
    console.log(FormData);

    // API call to insert outflow
    fetch(
      "https://1xd68kh5m1.execute-api.us-east-2.amazonaws.com/record-transaction",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(FormData),
      }
    )
      .then((response) => {
        return response.json(); // Parsing the JSON response
      })
      .then((data) => {
        console.log(data); // Logging the response data
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    navigate("/home");
  };

  return (
    <div className={styles.pageContainer}>
      {/* New form for category, amount, date, and description */}
      <form onSubmit={handleSubmit}>
        <label>
          Category Name:
          <select
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          >
            <option value="Grocery">Grocery</option>
            <option value="Entertainment">Entertainment</option>
            <option value="FinancialDues">Financial Dues</option>
            <option value="Insurance">Insurance</option>
            <option value="Education">Education</option>
            <option value="Clothing">Clothing</option>
            <option value="Savings and Investment">
              Savings and Investment
            </option>
            <option value="TotalBudget">Total Budget</option>
          </select>
        </label>
        <label>
          Amount:
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </label>
        <label>
          Date:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
        <label>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Business;
