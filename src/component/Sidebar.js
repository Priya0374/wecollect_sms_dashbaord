import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../Sidebar.css";

const Sidebar = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle("dark-mode");
  };

  return (
    <aside className="sidebar">
      <div className="logo">
        <img src="https://wecollect.co.in/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fwecollect_logo.8a7761c7.png&w=256&q=75" alt="WeCollect Logo" />
      </div>
      <ul className="menu">
        <li><Link to="/">Dashboard</Link></li>
        <li><Link to="/sms-analytics">SMS Campaign</Link></li>
        <li><Link to="/ivr-analytics">IVR Campaign</Link></li>
        <li><Link to="/whatsapp-analytics">WhatsApp Campaign</Link></li>
        <li><Link to="/campaign-reports">Bulk Link Reports</Link></li>
      </ul>
      {/* <div className="toggle-dark-mode">
        <label>
          <input type="checkbox" onChange={toggleDarkMode} />
          Dark Mode
        </label>
      </div> */}
    </aside>
  );
};

export default Sidebar;




