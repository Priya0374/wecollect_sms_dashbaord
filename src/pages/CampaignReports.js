import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
//import "./CampaignDashboard.css";

const CampaignReports = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [formData, setFormData] = useState({
    campaignName: "",
    channels: [],
    customerData: [],
    messageContent: "",
  });
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isModalOpen, setModalOpen] = useState(false);

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

  // Handle Channel Selection
  const handleChannelSelection = (channel) => {
    setFormData((prevData) => ({
      ...prevData,
      channels: prevData.channels.includes(channel)
        ? prevData.channels.filter((c) => c !== channel)
        : [...prevData.channels, channel],
    }));
  };

  // Handle File Upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const customerData = reader.result.split("\n").map((line) => line.trim());
        setFormData((prevData) => ({
          ...prevData,
          customerData,
        }));
      };
      reader.readAsText(file);
    }
  };

  // Submit Campaign
  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Add the new campaign to the campaigns list
    const newCampaign = {
      ...formData,
      status: "In Progress",
      createdAt: new Date(),
    };

    setCampaigns((prevData) => [...prevData, newCampaign]);

    // Clear the form
    setFormData({
      campaignName: "",
      channels: [],
      customerData: [],
      messageContent: "",
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
        <h1>Campaign Reports</h1>
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
          <button id="new-campaign-btn" onClick={handleModalToggle}>
            Create Campaign
          </button>
        </div>
      </header>

      {/* Modal for Creating Campaigns */}
      {isModalOpen && (
        <div id="campaign-modal" className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={handleModalToggle}>
              &times;
            </span>
            <h2>Create Campaign</h2>
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
                <label>Channels:</label>
                <div className="channel-options">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.channels.includes("SMS")}
                      onChange={() => handleChannelSelection("SMS")}
                    />
                    SMS
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.channels.includes("IVR")}
                      onChange={() => handleChannelSelection("IVR")}
                    />
                    IVR
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.channels.includes("WhatsApp")}
                      onChange={() => handleChannelSelection("WhatsApp")}
                    />
                    WhatsApp
                  </label>
                </div>
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
                <label htmlFor="customerFile">Upload Customer Data:</label>
                <input
                  type="file"
                  id="customerFile"
                  name="customerFile"
                  accept=".txt, .csv"
                  onChange={handleFileUpload}
                />
              </div>
              <button type="submit">Create Campaign</button>
            </form>
          </div>
        </div>
      )}

      {/* Campaign Table */}
      <section className="campaign-table">
        <h2>Campaigns</h2>
        <table>
          <thead>
            <tr>
              <th>Campaign Name</th>
              <th>Channels</th>
              <th>Customers</th>
              <th>Message Content</th>
              <th>Status</th>
              <th>Date Created</th>
            </tr>
          </thead>
          <tbody>
            {filterCampaignsByDate().map((campaign, index) => (
              <tr key={index}>
                <td>{campaign.campaignName}</td>
                <td>{campaign.channels.join(", ")}</td>
                <td>{campaign.customerData.length} Customers</td>
                <td>{campaign.messageContent}</td>
                <td>{campaign.status}</td>
                <td>{new Date(campaign.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
};

export default CampaignReports;
