import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const IvrDashboard = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    campaignName: "",
    dateTime: "",
    content: "",
    fileUpload: null,
  });

  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [ivrStats, setIvrStats] = useState({
    totalCalls: 0,
    attendedCalls: 0,
    interested: 0,
    notInterested: 0,
    doubleSms: 0,
    telecallerAssigned: 0,
    totalIvr: 0,
    interestedDelivery: 0,
    notInterestedDelivery: 0,
  });

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 100;

  // Filter and calculate analytics stats when date range or table data changes
  useEffect(() => {
    const filtered = tableData.filter((row) => {
      const rowDate = new Date(row.dateTime);
      return rowDate >= startDate && rowDate <= endDate;
    });
    setFilteredData(filtered);

    // Calculate analytics stats
    const totalIvr = filtered.reduce((sum, campaign) => sum + campaign.stats.totalCalls, 0);
    const interestedDelivery = filtered.reduce((sum, campaign) => sum + campaign.stats.interested, 0);
    const notInterestedDelivery = filtered.reduce(
      (sum, campaign) => sum + campaign.stats.notInterested,
      0
    );

    const totalAttendedCalls = filtered.reduce(
      (sum, campaign) => sum + campaign.stats.attendedCalls,
      0
    );

    const doubleSms = filtered.reduce((sum, campaign) => sum + campaign.stats.doubleSms, 0);

    setIvrStats((prev) => ({
      ...prev,
      totalIvr,
      interestedDelivery,
      notInterestedDelivery,
      attendedCalls: totalAttendedCalls,
      doubleSms,
    }));
  }, [startDate, endDate, tableData]);

  const handleModalToggle = () => setModalOpen(!isModalOpen);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      fileUpload: e.target.files[0],
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const newRow = {
      id: Date.now(),
      campaignName: formData.campaignName,
      dateTime: new Date(formData.dateTime),
      content: formData.content,
      fileUpload: formData.fileUpload ? formData.fileUpload.name : "No file uploaded",
      stats: {
        totalCalls: 0,
        attendedCalls: 0,
        interested: 0,
        notInterested: 0,
        doubleSms: 0,
        telecallerAssigned: 0,
      },
    };

    setTableData((prev) => [...prev, newRow]);
    setFormData({ campaignName: "", dateTime: "", content: "", fileUpload: null });
    setModalOpen(false);
  };

  const updateCampaignStats = (campaignId, actionType) => {
    setTableData((prevData) =>
      prevData.map((campaign) => {
        if (campaign.id === campaignId) {
          const updatedStats = { ...campaign.stats };
          updatedStats.totalCalls += 1;
          if (actionType === "attended") updatedStats.attendedCalls += 1;
          if (actionType === "interested") {
            updatedStats.interested += 1;
            updatedStats.doubleSms += 1; // Send double SMS
          }
          if (actionType === "notInterested") {
            updatedStats.notInterested += 1;
            updatedStats.telecallerAssigned += 1; // Assign to telecaller
          }
          return { ...campaign, stats: updatedStats };
        }
        return campaign;
      })
    );
  };

  const handlePageChange = (page) => setCurrentPage(page);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  useEffect(() => {
    const filtered = tableData.filter((row) => {
      const rowDate = new Date(row.dateTime);
      return rowDate >= startDate && rowDate <= endDate;
    });
    setFilteredData(filtered);
  
    // Calculate analytics stats
    const totalCalls = 300000; // Assuming a total of 300,000 numbers
    const totalAttendedCalls = filtered.reduce(
      (sum, campaign) => sum + campaign.stats.attendedCalls,
      0
    );
    const interestedDelivery = filtered.reduce((sum, campaign) => sum + campaign.stats.interested, 0);
    const notInterestedDelivery = filtered.reduce(
      (sum, campaign) => sum + campaign.stats.notInterested,
      0
    );
    const doubleSms = filtered.reduce((sum, campaign) => sum + campaign.stats.doubleSms, 0);
    const telecallerAssigned = filtered.reduce(
      (sum, campaign) => sum + campaign.stats.telecallerAssigned,
      0
    );
  
    setIvrStats({
      totalCalls,
      attendedCalls: totalAttendedCalls,
      interested: interestedDelivery,
      notInterested: notInterestedDelivery,
      doubleSms,
      telecallerAssigned,
      totalIvr: totalCalls, // Optional for clarity
    });
  }, [startDate, endDate, tableData]);
  

  return (
    <main className="main-dashboard">
      <header className="dashboard-header">
        <h1>IVR Dashboard</h1>
        <div className="header-actions">
          <div className="date-filter">
            <label>Date: </label>
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
          <button id="import-btn" onClick={handleModalToggle}>
            Create IVR Campaign
          </button>
        </div>
      </header>

      {/* Modal */}
      {isModalOpen && (
        <div id="import-modal" className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={handleModalToggle}>
              &times;
            </span>
            <h2>Create IVR Campaign</h2>
            <form id="import-form" onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label>Campaign Name:</label>
                <input
                  type="text"
                  name="campaignName"
                  value={formData.campaignName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Date and Time:</label>
                <input
                  type="datetime-local"
                  name="dateTime"
                  value={formData.dateTime}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Content:</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Upload File:</label>
                <input type="file" accept=".csv, .xls, .xlsx" onChange={handleFileChange} />
              </div>
              <button type="submit">Create</button>
            </form>
          </div>
        </div>
      )}

      {/* Analytics */}
      {/* <section className="analytics-summary">
        <div className="card"><h3>Total IVR</h3><p>{ivrStats.totalIvr}</p></div>
        <div className="card"><h3>Interested Delivery</h3><p>{ivrStats.interestedDelivery}</p></div>
        <div className="card"><h3>Not Interested Delivery</h3><p>{ivrStats.notInterestedDelivery}</p></div>
        <div className="card"><h3>Attended Calls</h3><p>{ivrStats.attendedCalls}</p></div>
        <div className="card"><h3>Double SMS Sent</h3><p>{ivrStats.doubleSms}</p></div>
      </section> */}

<section className="analytics-summary">
  <div className="card">
    <h3>Total Numbers</h3>
    <p>{ivrStats.totalCalls}</p>
  </div>
  <div className="card">
    <h3>Attended Calls</h3>
    <p>{ivrStats.attendedCalls}</p>
    <p>
      {(ivrStats.attendedCalls / ivrStats.totalCalls * 100).toFixed(2)}% of total
    </p>
  </div>
  <div className="card">
    <h3>Interested Delivery</h3>
    <p>{ivrStats.interested}</p>
    <p>
      {(ivrStats.interested / ivrStats.totalCalls * 100).toFixed(2)}% of total
    </p>
  </div>
  <div className="card">
    <h3>Not Interested Delivery</h3>
    <p>{ivrStats.notInterested}</p>
    <p>
      {(ivrStats.notInterested / ivrStats.totalCalls * 100).toFixed(2)}% of total
    </p>
  </div>
  <div className="card">
    <h3>Double SMS Sent</h3>
    <p>{ivrStats.doubleSms}</p>
    <p>
      {(ivrStats.doubleSms / ivrStats.totalCalls * 100).toFixed(2)}% of total
    </p>
  </div>
  <div className="card">
    <h3>Telecaller Assigned</h3>
    <p>{ivrStats.telecallerAssigned}</p>
    <p>
      {(ivrStats.telecallerAssigned / ivrStats.totalCalls * 100).toFixed(2)}% of total
    </p>
  </div>
</section>


      {/* Table */}
      <section className="table-container">
        <table>
          <thead>
            <tr>
              <th>Campaign Name</th>
              <th>Date and Time</th>
              <th>Content</th>
              <th>Uploaded File</th>
              <th>Actions</th>
              <th>Stats</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((campaign) => (
              <tr key={campaign.id}>
                <td>{campaign.campaignName}</td>
                <td>{new Date(campaign.dateTime).toLocaleString()}</td>
                <td>{campaign.content}</td>
                <td>{campaign.fileUpload}</td>
                <td>
                  <button onClick={() => updateCampaignStats(campaign.id, "attended")}>
                    Attended
                  </button>
                  <button onClick={() => updateCampaignStats(campaign.id, "interested")}>
                    Interested
                  </button>
                  <button onClick={() => updateCampaignStats(campaign.id, "notInterested")}>
                    Not Interested
                  </button>
                </td>
                <td>
                  <p>Total Calls: {campaign.stats.totalCalls}</p>
                  <p>Attended: {campaign.stats.attendedCalls}</p>
                  <p>Interested: {campaign.stats.interested}</p>
                  <p>Not Interested: {campaign.stats.notInterested}</p>
                  <p>Double SMS: {campaign.stats.doubleSms}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          {Array.from({ length: Math.ceil(filteredData.length / rowsPerPage) }, (_, i) => (
            <button key={i} onClick={() => handlePageChange(i + 1)}>
              {i + 1}
            </button>
          ))}
        </div>
      </section>
    </main>
  );
};

export default IvrDashboard;
