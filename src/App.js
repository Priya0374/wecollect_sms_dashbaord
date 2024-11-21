import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./component/Sidebar"; // Assuming Sidebar is a component
import LoginPage from "./pages/LoginPage";

// Import content pages for the routes
import Dashboard from "./pages/dashboard";
import SMSDashboard from "./pages/SMSDashboard";
import IvrAnalytics from "./pages/IvrAnalytics";
import WhatsappAnalytics from "./pages/WhatsappAnalytics";
import CampaignReports from "./pages/CampaignReports";

function App() {
  // State to manage login status
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Function to handle login
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <Router>
      <div className="app">
        {/* Conditionally render Sidebar only if logged in */}
        {isLoggedIn && <Sidebar />}

        <div className="content">
          <Routes>
            {/* Public route for login */}
            <Route
              path="/"
              element={
                isLoggedIn ? (
                  <Navigate to="/dashboard" /> // Redirect logged-in users to the dashboard
                ) : (
                  <LoginPage onLogin={handleLogin} /> // Pass handleLogin to LoginPage
                )
              }
            />

            {/* Protected routes for logged-in users */}
            {isLoggedIn ? (
              <>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/sms-analytics" element={<SMSDashboard />} />
                <Route path="/ivr-analytics" element={<IvrAnalytics />} />
                <Route path="/whatsapp-analytics" element={<WhatsappAnalytics />} />
                <Route path="/campaign-reports" element={<CampaignReports />} />
              </>
            ) : (
              // Redirect to login if not logged in
              <Route path="*" element={<Navigate to="/" />} />
            )}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
