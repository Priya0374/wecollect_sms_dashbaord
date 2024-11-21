import React, { useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import './Dashboard.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as XLSX from "xlsx";
import { FaDownload } from "react-icons/fa";
import {FaEdit} from  "react-icons/fa"
import DashboardSummary from './DashboardSummary';
import { ImOpt } from 'react-icons/im';

// Register chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);



const Dashboard = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isModalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    campaignName: '',
    dateTime: '',
    content: '',
    fileUpload: null,
  });
  const [tableData, setTableData] = useState([]);

    const smsData = {
    total: 125000,
    delivered: 110000,
    failed: 15000,
  };

  const ivrData = {
    totalCalls: 55000,
    connected: 48000,
    missed: 7000,
  };

  const whatsappData = {
    totalMessages: 85000,
    read: 73000,
    unread: 12000,
  };

  // Sample chart data
  const barChartData = {
    labels: ["SMS", "IVR", "WhatsApp"],
    datasets: [
      {
        label: "Campaign Reach",
        data: [smsData.total, ivrData.totalCalls, whatsappData.totalMessages],
        backgroundColor: ["#4caf50", "#ff9800", "#2196f3"],
      },
    ],
  };

  const pieChartData = {
    labels: ["SMS", "IVR", "WhatsApp"],
    datasets: [
      {
        data: [smsData.delivered, ivrData.connected, whatsappData.read],
        backgroundColor: ["#4caf50", "#ff9800", "#2196f3"],
        hoverOffset: 4,
      },
    ],
  };


  const handleModalToggle = () => {
    setModalOpen(!isModalOpen);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      fileUpload: e.target.files[0]
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Create a new row in the table
    const newRow = {
      campaignName: formData.campaignName,
      dateTime: new Date(formData.dateTime).toLocaleString(),
      content: formData.content,
      fileUpload: formData.fileUpload ? formData.fileUpload.name : 'No file uploaded',
    };

    // Update the table data state
    setTableData((prevData) => [...prevData, newRow]);

    // Reset the form fields
    setFormData({
      campaignName: '',
      dateTime: '',
      content: '',
      fileUpload: null,
    });

    // Close the modal
    setModalOpen(false);
  };

  return (
    <main className="main-dashboard">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
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
            Import Data
          </button>
        </div>
      </header>

      {/* Modal Structure */}
      {isModalOpen && (
        <div id="import-modal" className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={handleModalToggle}>
              &times;
            </span>
            <h2>Import Data</h2>
            <form id="import-form" onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label htmlFor="campaign-name">Campaign Name:</label>
                <input
                  type="text"
                  id="campaign-name"
                  name="campaignName"
                  value={formData.campaignName}
                  onChange={handleInputChange}
                  placeholder="Enter campaign name"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="date-time">Date and Time:</label>
                <input
                  type="datetime-local"
                  id="date-time"
                  name="dateTime"
                  value={formData.dateTime}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="content">Content:</label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Enter campaign content"
                  rows="4"
                  required
                ></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="file-upload">Upload File:</label>
                <input
                  type="file"
                  id="file-upload"
                  name="file-upload"
                  accept=".csv, .xls, .xlsx"
                  onChange={handleFileChange}
                  required
                />
              </div>
              <div className="form-group">
                <button type="submit" id="process-btn">
                  Process
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Analytics Summary */}
      <DashboardSummary />

      {/* Charts */}
      <section className="charts">
        <div className="chart" id="bar-chart">
          <h3> Revenue</h3>
          <Bar data={barChartData} />
        </div>
        <div className="chart" id="pie-chart">
          <h3>Traffic Channels</h3>
          <Pie data={pieChartData} />
        </div>
      </section>
      <section>
  <div className="table-container">
    <table id="data-table" className="data-table">
      <thead>
        <tr>
          <th>Campaign Name</th>
          <th>Date and Time</th>
          <th>Content</th>
          <th>Uploaded File</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Campaign A</td>
          <td>2024/11/01 10:00 AM</td>
          <td>Welcome SMS</td>
          <td>welcome_sms.xlsx</td>
          <td>
           <button title="Download" style={{display:"inline", margin:"11px"}}>
              <FaDownload className="action-icon" />
            </button>
            <button title="Edit">
              <FaEdit className="action-icon" />
            </button>
          </td>
        </tr>
        <tr>
          <td>Campaign B</td>
          <td>2024/11/02 02:30 PM</td>
          <td>Promotional Offer</td>
          <td>promo_offer.xlsx</td>
          <td>
           <button title="Download" style={{display:"inline", margin:"11px"}}>
              <FaDownload className="action-icon" />
            </button>
            <button title="Edit">
              <FaEdit className="action-icon" />
            </button>
          </td>
        </tr>
        <tr>
          <td>Campaign C</td>
          <td>2024/11/03 09:15 AM</td>
          <td>Feedback Request</td>
          <td>feedback.xlsx</td>
          <td>
           <button title="Download" style={{display:"inline", margin:"11px"}}>
              <FaDownload className="action-icon" />
            </button>
            <button title="Edit">
              <FaEdit className="action-icon" />
            </button>
          </td>
        </tr>
        <tr>
          <td>Campaign D</td>
          <td>2024/11/04 01:00 PM</td>
          <td>Event Invitation</td>
          <td>event_invite.xlsx</td>
          <td>
           <button title="Download" style={{display:"inline", margin:"11px"}}>
              <FaDownload className="action-icon" />
            </button>
            <button title="Edit">
              <FaEdit className="action-icon" />
            </button>
          </td>
        </tr>
        <tr>
          <td>Campaign E</td>
          <td>2024/11/05 11:45 AM</td>
          <td>Customer Survey</td>
          <td>survey.xlsx</td>
          <td>
           <button title="Download" style={{display:"inline", margin:"11px"}}>
              <FaDownload className="action-icon" />
            </button>
            <button title="Edit">
              <FaEdit className="action-icon" />
            </button>
          </td>
        </tr>
        <tr>
          <td>Campaign F</td>
          <td>2024/11/06 04:00 PM</td>
          <td>Service Reminder</td>
          <td>reminder.xlsx</td>
          <td>
           <button title="Download" style={{display:"inline", margin:"11px"}}>
              <FaDownload className="action-icon" />
            </button>
            <button title="Edit">
              <FaEdit className="action-icon" />
            </button>
          </td>
        </tr>
        <tr>
          <td>Campaign G</td>
          <td>2024/11/07 03:30 PM</td>
          <td>Discount Announcement</td>
          <td>discount.xlsx</td>
          <td>
           <button title="Download" style={{display:"inline", margin:"11px"}}>
              <FaDownload className="action-icon" />
            </button>
            <button title="Edit">
              <FaEdit className="action-icon" />
            </button>
          </td>
        </tr>
        <tr>
          <td>Campaign H</td>
          <td>2024/11/08 12:00 PM</td>
          <td>Newsletter</td>
          <td>newsletter.xlsx</td>
          <td>
           <button title="Download" style={{display:"inline", margin:"11px"}}>
              <FaDownload className="action-icon" />
            </button>
            <button title="Edit">
              <FaEdit className="action-icon" />
            </button>
          </td>
        </tr>
        <tr>
          <td>Campaign I</td>
          <td>2024/11/09 09:45 AM</td>
          <td>Special Offers</td>
          <td>special_offers.xlsx</td>
          <td>
           <button title="Download" style={{display:"inline", margin:"11px"}}>
              <FaDownload className="action-icon" />
            </button>
            <button title="Edit">
              <FaEdit className="action-icon" />
            </button>
          </td>
        </tr>
        <tr>
          <td>Campaign J</td>
          <td>2024/11/10 10:30 AM</td>
          <td>Membership Renewal</td>
          <td>membership.xlsx</td>
          <td>
           <button title="Download" style={{display:"inline", margin:"11px"}}>
              <FaDownload className="action-icon" />
            </button>
            <button title="Edit">
              <FaEdit className="action-icon" />
            </button>
          </td>
        </tr>
        <tr>
          <td>Campaign K</td>
          <td>2024/11/11 08:15 AM</td>
          <td>Festive Greetings</td>
          <td>greetings.xlsx</td>
          <td>
           <button title="Download" style={{display:"inline", margin:"11px"}}>
              <FaDownload className="action-icon" />
            </button>
            <button title="Edit">
              <FaEdit className="action-icon" />
            </button>
          </td>
        </tr>
        <tr>
          <td>Campaign L</td>
          <td>2024/11/12 06:00 PM</td>
          <td>Flash Sale</td>
          <td>flash_sale.xlsx</td>
          <td>
           <button title="Download" style={{display:"inline", margin:"11px"}}>
              <FaDownload className="action-icon" />
            </button>
            <button title="Edit">
              <FaEdit className="action-icon" />
            </button>
          </td>
        </tr>
        <tr>
          <td>Campaign M</td>
          <td>2024/11/13 02:45 PM</td>
          <td>Follow-Up Reminder</td>
          <td>followup.xlsx</td>
          <td>
           <button title="Download" style={{display:"inline", margin:"11px"}}>
              <FaDownload className="action-icon" />
            </button>
            <button title="Edit">
              <FaEdit className="action-icon" />
            </button>
          </td>
        </tr>
        <tr>
          <td>Campaign N</td>
          <td>2024/11/14 07:30 PM</td>
          <td>Account Activation</td>
          <td>activation.xlsx</td>
          <td>
           <button title="Download" style={{display:"inline", margin:"11px"}}>
              <FaDownload className="action-icon" />
            </button>
            <button title="Edit">
              <FaEdit className="action-icon" />
            </button>
          </td>
        </tr>
        <tr>
          <td>Campaign O</td>
          <td>2024/11/15 11:15 AM</td>
          <td>Seasonal Sale</td>
          <td>seasonal_sale.xlsx</td>
          <td>
           <button title="Download" style={{display:"inline", margin:"11px"}}>
              <FaDownload className="action-icon" />
            </button>
            <button title="Edit">
              <FaEdit className="action-icon" />
            </button>
          </td>
        </tr>
        <tr>
          <td>Campaign P</td>
          <td>2024/11/16 04:45 PM</td>
          <td>Product Launch</td>
          <td>product_launch.xlsx</td>
          <td>
           <button title="Download" style={{display:"inline", margin:"11px"}}>
              <FaDownload className="action-icon" />
            </button>
            <button title="Edit">
              <FaEdit className="action-icon" />
            </button>
          </td>
        </tr>
        <tr>
          <td>Campaign Q</td>
          <td>2024/11/17 08:00 AM</td>
          <td>Weekly Update</td>
          <td>weekly_update.xlsx</td>
          <td>
           <button title="Download" style={{display:"inline", margin:"11px"}}>
              <FaDownload className="action-icon" />
            </button>
            <button title="Edit">
              <FaEdit className="action-icon" />
            </button>
          </td>
        </tr>
        <tr>
          <td>Campaign R</td>
          <td>2024/11/18 05:30 PM</td>
          <td>Holiday Sale</td>
          <td>holiday_sale.xlsx</td>
          <td>
           <button title="Download" style={{display:"inline", margin:"11px"}}>
              <FaDownload className="action-icon" />
            </button>
            <button title="Edit">
              <FaEdit className="action-icon" />
            </button>
          </td>
        </tr>
        <tr>
          <td>Campaign S</td>
          <td>2
            024/11/19 03:15 PM</td>
          <td>Service Alert</td>
          <td>service_alert.xlsx</td>
          <td>
           <button title="Download" style={{display:"inline", margin:"11px"}}>
              <FaDownload className="action-icon" />
            </button>
            <button title="Edit">
              <FaEdit className="action-icon" />
            </button>
          </td>
        </tr>
        <tr>
          <td>Campaign T</td>
          <td>2024/11/20 02:00 PM</td>
          <td>Feedback Reminder</td>
          <td>feedback_reminder.xlsx</td>
          <td>
           <button title="Download" style={{display:"inline", margin:"11px"}}>
              <FaDownload className="action-icon" />
            </button>
            <button title="Edit">
              <FaEdit className="action-icon" />
            </button>
          </td>
        </tr>
        <tr>
          <td>Campaign U</td>
          <td>2024/11/21 11:00 AM</td>
          <td>Customer Rewards</td>
          <td>rewards.xlsx</td>
          <td>
            <button title="Download" style={{display:"inline", margin:"11px"}}>
              <FaDownload className="action-icon" />
            </button>
            <button title="Edit">
              <FaEdit className="action-icon" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</section>

    </main>
  );
};

export default Dashboard;
