import React, { useState } from "react";
import styles from "./stylesfolder/Login.module.css";
import { useSelector, useDispatch } from "react-redux";
import { loginRequest } from "../actions/loginActions";
import { useNavigate } from "react-router-dom";
export default function Login() {
  const authenticateuser = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  let userId;
  let password;
  // ---------------------------- Check the user ---------------------------------------
  const HandelClick = async () => {
    const data = { userId, password };
    try {
      const response = await fetch(
        "https://1xd68kh5m1.execute-api.us-east-2.amazonaws.com/authenticate",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const responseData = await response.json();

      if (responseData.Login) {
        dispatch(loginRequest(responseData.userDetails, responseData.Login));

        // Note: The state update (authenticateuser) may not be immediately reflected here due to React's asynchronous state updates
        navigate("/home");
      }
    } catch (error) {
      console.log("error from logincheck", error);
    }
  };

  const HandelRegister = () => {
    navigate("/register");
  };

  // ---------------------------------   end-Check-uSER ---------------------------------------

  return (
    <div className={styles.LoginContainer}>
      <h2>Welcome back</h2>

      <div className={styles.inputelement}>
        <input
          type="text"
          id="username"
          placeholder="Your Email address"
          value={userId}
          onChange={(e) => (userId = e.target.value)}
        />
      </div>
      <div className={styles.inputelement}>
        <input
          type="password"
          id="password"
          placeholder="Password"
          value={password}
          onChange={(e) => (password = e.target.value)}
        />
      </div>
      <button type="submit" onClick={HandelClick}>
        Login
      </button>
      <div className={styles.anchor}>
        <a src="#">Forgot username/password? </a> <br></br>
        <a onClick={HandelRegister}> Not enrolled? Sign up now.</a>
      </div>
      <h4>
        This is budgeting web application , For Testing the Application <br />
        You can Use These login credentials
        <br />
        UserId: sam@gmail.com
        <br />
        Password: sam@123
      </h4>
    </div>
  );
}
