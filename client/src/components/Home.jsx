import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "./stylesfolder/Home.module.css";
import { useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { ArcElement } from "chart.js";
// Register the components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

ChartJS.register(ArcElement);

export default function Home() {
  const userDetails = useSelector((state) => state.auth);
  const username = userDetails.user.Username;
  const UserId = userDetails.user.UserID;

  const navigate = useNavigate();
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const handleFilterData = () => {
    if (fromDate && toDate) {
      const from = new Date(fromDate);
      const to = new Date(toDate);

      const filteredBudgets = budgets.filter((budget) => {
        const budgetStartDate = new Date(budget.StartDate);
        const budgetEndDate = new Date(budget.EndDate);
        return budgetStartDate >= from && budgetEndDate <= to;
      });

      const filteredTransactions = transactions.filter((transaction) => {
        const transactionDate = new Date(transaction.Date);
        return transactionDate >= from && transactionDate <= to;
      });

      setBudgets(filteredBudgets);
      setTransactions(filteredTransactions);
    } else {
      console.log("Please select both from and to dates");
    }
  };

  useEffect(() => {
    if (UserId) {
      Promise.all([
        fetch(
          `https://1xd68kh5m1.execute-api.us-east-2.amazonaws.com/fetch-budget`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId: UserId }),
          }
        ),
        fetch(
          `https://1xd68kh5m1.execute-api.us-east-2.amazonaws.com/fetch-transactions`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId: UserId }),
          }
        ),
      ])
        .then(async ([budgetsResponse, transactionsResponse]) => {
          if (!budgetsResponse.ok || !transactionsResponse.ok) {
            throw new Error("Network response was not ok");
          }
          const budgetsData = await budgetsResponse.json();
          const transactionsData = await transactionsResponse.json();
          return [budgetsData, transactionsData];
        })
        .then(([budgetsData, transactionsData]) => {
          setBudgets(budgetsData);
          setTransactions(transactionsData.transactions);
        })
        .catch((error) => {
          console.error("Error fetching data: ", error);
          setError(error.message);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setError("UserId not found.");
      setLoading(false);
    }
  }, [UserId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const colors = [
    "rgba(255, 99, 132, 0.5)", // Red
    "rgba(54, 162, 235, 0.5)", // Blue
    "rgba(255, 206, 86, 0.5)", // Yellow
    "rgba(75, 192, 192, 0.5)", // Green
    "rgba(153, 102, 255, 0.5)", // Purple
    "rgba(255, 159, 64, 0.5)", // Orange
    // Add more colors as needed
  ];

  const getRandomColor = () => {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgba(${r}, ${g}, ${b}, 0.5)`; // Adjust the alpha value (0.5) as needed
  };

  const budgetChartData = {
    labels: budgets.map((b) => b.CategoryName),
    datasets: [
      {
        label: "Budget Amount",
        data: budgets.map((b) => b.BudgetAmount),
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  const budgetPieChartData = {
    labels: budgets.map((b) => b.CategoryName),
    datasets: [
      {
        label: "Budget Distribution",
        data: budgets.map((b) => b.BudgetAmount),
        backgroundColor: budgets.map(() => getRandomColor()),
        borderColor: budgets.map(() => getRandomColor().replace("0.5", "1")),
        borderWidth: 1,
      },
    ],
  };

  const transactionChartData = {
    labels: transactions.map((t) => t.CategoryName),
    datasets: [
      {
        label: "Transaction Amount",
        data: transactions.map((t) => t.Amount),
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const combinedChartData = {
    labels: budgets.map((b) => b.CategoryName), // This assumes all categories in budgets are also in transactions
    datasets: [
      {
        label: "Budget Amount",
        data: budgets.map((b) => b.BudgetAmount),
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
      {
        label: "Transaction Amount",
        data: budgets.map((b) => {
          const transaction = transactions.find(
            (t) => t.CategoryName === b.CategoryName
          );
          return transaction ? transaction.Amount : 0; // This puts 0 for transactions that don't have a matching budget category
        }),
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const transactionPieChartData = {
    labels: transactions.map((t) => t.CategoryName),
    datasets: [
      {
        label: "Transaction Amounts",
        data: transactions.map((t) => t.Amount),
        backgroundColor: transactions.map(
          (_, index) => colors[index % colors.length]
        ),
        borderColor: transactions.map((_, index) =>
          colors[index % colors.length].replace("0.5", "1")
        ),
        borderWidth: 1,
      },
    ],
  };

  // Calculating totals
  const totalBudgetAmount = budgets.reduce(
    (acc, curr) => acc + curr.BudgetAmount,
    0
  );
  const totalTransactionAmount = transactions.reduce(
    (acc, curr) => acc + curr.Amount,
    0
  );

  // Data for Total Comparison Bar Chart
  const totalComparisonChartData = {
    labels: ["Total Budget Allocated", "Total Budget Spent"],
    datasets: [
      {
        label: "Amount",
        data: [totalBudgetAmount, totalTransactionAmount],
        backgroundColor: [
          "rgba(255, 159, 64, 0.2)",
          "rgba(153, 102, 255, 0.2)",
        ],
        borderColor: ["rgba(255, 159, 64, 1)", "rgba(153, 102, 255, 1)"],
        borderWidth: 1,
      },
    ],
  };

  console.log("budgets", budgets);
  console.log("Transactions", transactions);
  return (
    <div className={styles.homeContainer}>
      <div className={styles.dateSelectionForm}>
        {/* Date selection form */}
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />
        <button onClick={handleFilterData}>Filter Data</button>
      </div>
      <div className={styles.chartContainer}>
        <h2>Total Budget Allocated vs Total Budget Spent</h2>
        <Bar
          data={totalComparisonChartData}
          options={{ scales: { y: { beginAtZero: true } } }}
        />
      </div>

      <div className={styles.chartContainer}>
        <h2>Visualizing Actual Outflow</h2>
        <Bar
          data={transactionChartData}
          options={{ scales: { y: { beginAtZero: true } } }}
        />
      </div>
      <div className={styles.chartContainer}>
        <h2>Comparing Both Planned Budget and Actual Spending</h2>
        <Bar
          data={combinedChartData}
          options={{ scales: { y: { beginAtZero: true } } }}
        />
      </div>
      <div className={styles.chartContainer}>
        <h2>Budget Distribution on Each Category</h2>
        <Pie data={budgetPieChartData} />
      </div>

      <div className={styles.chartContainer}>
        <h2>Budget Spent On Each Category</h2>
        <Pie data={transactionPieChartData} />
      </div>
    </div>
  );
}
