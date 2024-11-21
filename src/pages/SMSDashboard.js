import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './Dashboard.css'; // Same styles as Dashboard

const SMSDashboard = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [formData, setFormData] = useState({
    campaignName: "",
    messageContent: "",
    recipients: [],
  });
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isModalOpen, setModalOpen] = useState(false);

  // Simulated SMS Delivery Data
  const simulateSMSDelivery = (recipients) => {
    return recipients.map((recipient) => ({
      number: recipient,
      status: Math.random() > 0.2 ? "Delivered" : "Failed", // 80% delivery success
      interested: Math.random() > 0.5, // 50% interested if delivered
    }));
  };

  // Add some static campaigns on page load
  useEffect(() => {
    const initialCampaigns = [
      {
        campaignName: "Campaign 1",
        messageContent: "Welcome to our service! Enjoy 20% off.",
        recipients: ["1234567890", "9876543210", "1122334455"],
        createdAt: new Date("2024-11-01"),
      },
      {
        campaignName: "Campaign 2",
        messageContent: "Hurry up! Limited time offer!",
        recipients: ["2233445566", "9988776655", "5566778899"],
        createdAt: new Date("2024-11-10"),
      },
    ];

    // Simulate SMS Delivery for these campaigns
    const campaignsWithData = initialCampaigns.map((campaign) => {
      const deliveryData = simulateSMSDelivery(campaign.recipients);
      const totalSent = deliveryData.length;
      const delivered = deliveryData.filter((sms) => sms.status === "Delivered").length;
      const interested = deliveryData.filter((sms) => sms.interested && sms.status === "Delivered").length;
      const notInterested = delivered - interested;

      return {
        ...campaign,
        totalSent,
        delivered,
        interested,
        notInterested,
        deliveryData,
      };
    });

    setCampaigns(campaignsWithData);
  }, []);

  // Toggle Modal
  const handleModalToggle = () => {
    setModalOpen(!isModalOpen);
  };

  // Handle Input Change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle File Upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const recipients = reader.result.split("\n").map((line) => line.trim());
        setFormData((prevData) => ({
          ...prevData,
          recipients,
        }));
      };
      reader.readAsText(file);
    }
  };

  // Submit SMS Campaign
  const handleFormSubmit = (e) => {
    e.preventDefault();

    const deliveryData = simulateSMSDelivery(formData.recipients);

    // Calculate analytics
    const totalSent = deliveryData.length;
    const delivered = deliveryData.filter((sms) => sms.status === "Delivered").length;
    const interested = deliveryData.filter((sms) => sms.interested && sms.status === "Delivered").length;
    const notInterested = delivered - interested;

    // Add the campaign to the list
    const newCampaign = {
      campaignName: formData.campaignName,
      messageContent: formData.messageContent,
      totalSent,
      delivered,
      interested,
      notInterested,
      createdAt: new Date(),
      deliveryData,
    };

    setCampaigns((prevData) => [...prevData, newCampaign]);

    // Clear the form
    setFormData({
      campaignName: "",
      messageContent: "",
      recipients: [],
    });

    // Close Modal
    setModalOpen(false);
  };

  // Filter Campaigns by Date
  const filterCampaignsByDate = () => {
    return campaigns.filter((campaign) => {
      const campaignDate = new Date(campaign.createdAt);
      return campaignDate >= startDate && campaignDate <= endDate;
    });
  };

  return (
    <main className="main-dashboard">
      <header className="dashboard-header">
        <h1>SMS Dashboard</h1>
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
          <button id="new-sms-campaign-btn" onClick={handleModalToggle}>
            Create SMS Campaign
          </button>
        </div>
      </header>

      {/* Modal for Creating Campaigns */}
      {isModalOpen && (
        <div id="sms-campaign-modal" className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={handleModalToggle}>
              &times;
            </span>
            <h2>Create SMS Campaign</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label htmlFor="campaignName">Campaign Name:</label>
                <input
                  type="text"
                  id="campaignName"
                  name="campaignName"
                  value={formData.campaignName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="messageContent">Message Content:</label>
                <textarea
                  id="messageContent"
                  name="messageContent"
                  value={formData.messageContent}
                  onChange={handleInputChange}
                  rows="4"
                  required
                ></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="recipientsFile">Upload Recipients:</label>
                <input
                  type="file"
                  id="recipientsFile"
                  name="recipientsFile"
                  accept=".txt, .csv"
                  onChange={handleFileUpload}
                />
              </div>
              <button type="submit">Send SMS</button>
            </form>
          </div>
        </div>
      )}

      {/* Analytics Cards */}
      <section className="analytics-cards" style={{ display: "flex", gap: "62px" }}>
        <div className="card">
          <h3>Total Sent</h3>
          <p>{filterCampaignsByDate().reduce((sum, c) => sum + c.totalSent, 0)}</p>
        </div>
        <div className="card">
          <h3>Delivered</h3>
          <p>{filterCampaignsByDate().reduce((sum, c) => sum + c.delivered, 0)}</p>
        </div>
        <div className="card">
          <h3>Interested</h3>
          <p>{filterCampaignsByDate().reduce((sum, c) => sum + c.interested, 0)}</p>
        </div>
        <div className="card">
          <h3>Not Interested</h3>
          <p>{filterCampaignsByDate().reduce((sum, c) => sum + c.notInterested, 0)}</p>
        </div>
      </section>

      {/* Campaign Table */}
      <section className="campaign-table">
        <h2>SMS Campaigns</h2>
        <table>
          <thead>
            <tr>
              <th>Campaign Name</th>
              <th>Message Content</th>
              <th>Total Sent</th>
              <th>Delivered</th>
              <th>Interested</th>
              <th>Not Interested</th>
              <th>Date Created</th>
            </tr>
          </thead>
          <tbody>
            {filterCampaignsByDate().map((campaign, index) => (
              <tr key={index}>
                <td>{campaign.campaignName}</td>
                <td>{campaign.messageContent}</td>
                <td>{campaign.totalSent}</td>
                <td>{campaign.delivered}</td>
                <td>{campaign.interested}</td>
                <td>{campaign.notInterested}</td>
                <td>{new Date(campaign.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
};

export default SMSDashboard;
