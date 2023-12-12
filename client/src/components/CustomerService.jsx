import React from "react";
import styles from "./stylesfolder/CustomerService.module.css";

function CustomerService() {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Customer Service</h1>

      <section className={styles.section}>
        <h2 className={styles.subHeading}>FAQs</h2>
        <p className={styles.paragraph}>
          Having trouble? Check out our frequently asked questions for quick
          help.
        </p>

        <h3 className={styles.question}>How do I reset my password?</h3>
        <p className={styles.answer}>
          Click the 'Forgot Password' link on the login page and follow the
          instructions.
        </p>

        <h3 className={styles.question}>
          What are your customer service hours?
        </h3>
        <p className={styles.answer}>
          Our customer service is available 24/7 for your convenience.
        </p>

        <h3 className={styles.question}>
          How do I update my personal information?
        </h3>
        <p className={styles.answer}>
          Log in to your account and visit the 'Account Settings' section to
          update your information.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.subHeading}>Contact Information</h2>
        <p className={styles.paragraph}>
          Need more help? Reach out to us directly:
        </p>
        <p className={styles.contactInfo}>Phone: 1-800-123-4567</p>
        <p className={styles.contactInfo}>Email: support@example.com</p>
        <p className={styles.contactInfo}>
          Office Hours: 9:00 AM to 5:00 PM, Monday to Friday
        </p>
      </section>
    </div>
  );
}

export default CustomerService;
