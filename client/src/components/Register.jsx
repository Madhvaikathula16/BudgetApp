import React, { useState } from "react";
import styles from "./stylesfolder/register.module.css";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });
  const [passwordError, setPasswordError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // No password confirmation in the new requirements
    submitUserData(formData);
  };

  const submitUserData = (userData) => {
    console.log("Submitting User Data:", userData);
    fetch("https://1xd68kh5m1.execute-api.us-east-2.amazonaws.com/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        navigate("/home");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div className={styles["registration-form-container"]}>
      <h2>Register for New Account</h2>
      <form onSubmit={handleSubmit} className={styles["registration-form"]}>
        <input
          type="text"
          name="username"
          className={styles["form-input"]}
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
        />
        <input
          type="email"
          name="email"
          className={styles["form-input"]}
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
        />
        <input
          type="password"
          name="password"
          className={styles["form-input"]}
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
        />
        {passwordError && (
          <div className={styles["error-message"]}>{passwordError}</div>
        )}
        <button type="submit" className={styles["submit-button"]}>
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
