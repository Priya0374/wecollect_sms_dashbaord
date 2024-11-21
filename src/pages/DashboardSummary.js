import React from "react";

const DashboardSummary = () => {
  const totalMessages = 150000;
  const connected = 100000;
  const notDelivered = totalMessages - connected;

  // Customer responses (breakdown of connected/delivered cases)
  const interested = 18000;
  const notInterested = 12000;
  const noResponse = connected - (interested + notInterested); // Remaining delivered but no customer response

  return (
    <section className="analytics-summary">
      <div className="card">
        <h3>Total Count</h3>
        <p>{totalMessages.toLocaleString()}</p>
        <small>+15,000 today</small>
      </div>
      <div className="card">
        <h3>Delivered</h3>
        <p>{connected.toLocaleString()}</p>
        <small>+10,000 today</small>
      </div>
      <div className="card">
        <h3>Not Delivered</h3>
        <p>{notDelivered.toLocaleString()}</p>
        <small>Follow-up action required</small>
      </div>
      <div className="card">
        <h3>Interested</h3>
        <p>{interested.toLocaleString()}</p>
        <small>+2,000 today</small>
      </div>
      <div className="card">
        <h3>Not Interested</h3>
        <p>{notInterested.toLocaleString()}</p>
        <small>-500 today</small>
      </div>
      <div className="card">
        <h3>No Response</h3>
        <p>{noResponse.toLocaleString()}</p>
        <small>+7,500 today</small>
      </div>
    </section>
  );
};

export default DashboardSummary;
