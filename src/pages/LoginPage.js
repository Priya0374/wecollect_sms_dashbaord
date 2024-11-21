import React from "react";
import "./LoginPage.css"; 


function LoginPage({ onLogin }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform authentication logic here
    onLogin();
  };

  return (


    <div className="">
    <div className="login-page">
      <div className="login-container">
        <header className="login-header">
          <h1 className="brand-title">Welcome Back</h1>
          <img
            src="https://wecollect.co.in/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fwecollect_logo.8a7761c7.png&w=256&q=75" // Replace with your logo URL
            alt="Logo"
            className="header-logo"
          />
        </header>
        <form className="login-form" onSubmit={handleSubmit}>
          <input type="text" placeholder="Username" className="input-field" required />
          <input type="password" placeholder="Password" className="input-field" required />
          <button type="submit" className="login-button">Login</button>
        </form>
      </div>
    </div>
    </div>
  );
}

export default LoginPage;
