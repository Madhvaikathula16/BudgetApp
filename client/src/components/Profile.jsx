import React, { useState, useEffect } from "react";
import styles from "./stylesfolder/Profile.module.css";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const userDetails = useSelector((state) => state.auth);
  const userId = userDetails?.user?.UserID;

  const dispatch = useDispatch();

  function getLoggedOut() {
    dispatch({ type: "LOGOUT" }); // Dispatch the logout action
    window.location.reload(); // Reload the current page
  }

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setError("No user ID found");
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://1xd68kh5m1.execute-api.us-east-2.amazonaws.com/user-details",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (data.length > 0) {
          setUserData(data[0]); // Assuming the first element in the array is the user data
        } else {
          setError("User data not found");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (loading) return <div className={styles.dataField}>Loading...</div>;
  if (error) return <div className={styles.dataField}>Error: {error}</div>;
  if (!userData)
    return <div className={styles.dataField}>No user data found</div>;

  return (
    <div className={styles.container}>
      <div className={styles.profileCard}>
        {/* Displaying user data */}
        <h1 className={styles.profileName}>{userData.Username}</h1>
        <div className={styles.profileInfo}>
          <p className={styles.profileDetail}>
            <strong>Email:</strong> {userData.Email}
          </p>
          <p className={styles.profileDetail}>
            <strong>User ID:</strong> {userData.UserID}
          </p>
          <p className={styles.profileDetail}>
            <strong>Account Created ON:</strong>{" "}
            {new Date(userData.CreateDate).toLocaleDateString()}
          </p>
          <button onClick={getLoggedOut}>Logout</button>
        </div>
      </div>
    </div>
  );
}
