import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const WhatsappAnalytics = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    messageContent: "",
    recipientNumber: "",
  });
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [messageData, setMessageData] = useState([]);
  const [analytics, setAnalytics] = useState({
    sent: 0,
    delivered: 0,
    interested: 0,
    notInterested: 0,
  });

  // Modal toggle handler
  const handleModalToggle = () => {
    setModalOpen(!isModalOpen);
  };

  // Handle form inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission for sending WhatsApp messages
  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Simulate sending a message
    const newMessage = {
      ...formData,
      status: "Sent",
      timestamp: new Date(),
    };

    setMessageData((prevData) => [...prevData, newMessage]);

    // Update analytics
    setAnalytics((prevData) => ({
      ...prevData,
      sent: prevData.sent + 1,
    }));

    // Clear the form
    setFormData({
      messageContent: "",
      recipientNumber: "",
    });
  };

  // Handle the status update (delivered, interested, not interested)
  const updateMessageStatus = (index, status) => {
    const updatedMessages = [...messageData];
    updatedMessages[index].status = status;

    // Update analytics based on status
    const updatedAnalytics = { ...analytics };
    if (status === "Delivered") {
      updatedAnalytics.delivered += 1;
    } else if (status === "Interested") {
      updatedAnalytics.interested += 1;
    } else if (status === "Not Interested") {
      updatedAnalytics.notInterested += 1;
    }

    setMessageData(updatedMessages);
    setAnalytics(updatedAnalytics);
  };

  // Filter messages based on date range
  const filterMessagesByDate = () => {
    return messageData.filter((message) => {
      const messageDate = new Date(message.timestamp);
      return messageDate >= startDate && messageDate <= endDate;
    });
  };

  return (
    <main className="main-dashboard">
      <header className="dashboard-header">
        <h1>WhatsApp Analytics</h1>
        <div className="header-actions">
          <div className="date-filter">
            <label>Start Date: </label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              dateFormat="yyyy/MM/dd"
            />
            <label>End Date: </label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              dateFormat="yyyy/MM/dd"
            />
          </div>
          <button id="export-btn" onClick={handleModalToggle}>
            Send WhatsApp Message
          </button>
        </div>
      </header>

      {/* Modal Structure for Sending WhatsApp Messages */}
      {isModalOpen && (
        <div id="import-modal" className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={handleModalToggle}>
              &times;
            </span>
            <h2>Send WhatsApp Message</h2>
            <form id="send-form" onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label htmlFor="messageContent">Message Content:</label>
                <textarea
                  id="messageContent"
                  name="messageContent"
                  value={formData.messageContent}
                  onChange={handleInputChange}
                  placeholder="Enter message content"
                  rows="4"
                  required
                ></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="recipientNumber">Recipient Number (Including country code):</label>
                <input
                  type="text"
                  id="recipientNumber"
                  name="recipientNumber"
                  value={formData.recipientNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <button type="submit" id="process-btn">
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* WhatsApp Analytics Summary */}
      <section className="analytics-summary">
        <div className="card">
          <h3>Total Messages Sent</h3>
          <p>{analytics.sent}</p>
        </div>
        <div className="card">
          <h3>Total Delivered</h3>
          <p>{analytics.delivered}</p>
        </div>
        <div className="card">
          <h3>Interested</h3>
          <p>{analytics.interested}</p>
        </div>
        <div className="card">
          <h3>Not Interested</h3>
          <p>{analytics.notInterested}</p>
        </div>
      </section>

      {/* Messages Table */}
      <section>
        <div className="table-container">
          <table id="message-table" className="data-table">
            <thead>
              <tr>
                <th>Message Content</th>
                <th>Recipient</th>
                <th>Status</th>
                <th>Timestamp</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filterMessagesByDate().map((message, index) => (
                <tr key={index}>
                  <td>{message.messageContent}</td>
                  <td>{message.recipientNumber}</td>
                  <td>{message.status}</td>
                  <td>{new Date(message.timestamp).toLocaleString()}</td>
                  <td>
                    <button onClick={() => updateMessageStatus(index, "Delivered")}>Delivered</button>
                    <button onClick={() => updateMessageStatus(index, "Interested")}>Interested</button>
                    <button onClick={() => updateMessageStatus(index, "Not Interested")}>Not Interested</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
};

export default WhatsappAnalytics;
