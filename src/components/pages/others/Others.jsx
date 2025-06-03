import { useState } from "react";
import {
  FaSort,
  FaDownload,
  FaUpload,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { FaArrowLeft, FaPlus, FaPencilAlt } from 'react-icons/fa';

import "./others.css";
// import ScheduleUpdateModal from "../modals/ScheduleUpdateModal";
// import DeclineModal from "../modals/DeclineModal";
// import { get, post } from "../../utility/fetchWeb";
// import notification from "../../utility/notification";

const generateDateRange = () => {
  const today = new Date();
  const dates = [];

  // Start from 7 days ago
  for (let i = -7; i <= 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    dates.push({
      date: date.getDate(),
      day: date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
      fullDate: date, // Keep full date for comparison
    });
  }

  return dates;
};

const MedicalDashboard = ({ data }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  // Initialize selectedDate with today's date
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewSchedule, setIsNewSchedule] = useState(false);
  const [patientData, setPatientData] = useState([]);
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const doctorId = sessionStorage.getItem("userId");

  // Generate dynamic dates
  const dates = generateDateRange();

  // Sample appointment data based on your structure

  return (
    <div className="w-100  others">
      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <div className="app-container">
          {/* Header Section */}
          <div className="header">
            <h1 className="header-title">Funds Management</h1>
            <div className="header-actions">
              <span className="manage-fee">Manage Service Fee</span>
              <button className="fund-wallet-btn">Fund Wallet</button>
              <button className="withdraw-btn">Withdraw</button>
            </div>
          </div>

          <div className="flex" style={{ gap: "10px" }}>
            <WalletCard />
            <WalletCard />
            <WalletCard />
            <WalletCard />
            <WalletCard />
          </div>

        <TransactionTable />

        <ListOfServices/>

          {/* You can add more content here if needed for the full page */}
        </div>


        {/* Doctor Info */}
      </div>

      {/* Schedule Management Drawer */}
    </div>
  );
};

export default MedicalDashboard;

const WalletCard = () => {
  const cardStyle = {
    background: "#fff",
    borderRadius: "8px",
    padding: "20px",
    width: "200px",
    boxShadow: "0 1px 4px rgba(0, 0, 0, 0.05)",
    position: "relative",
    fontFamily: "Arial, sans-serif",
  };

  const iconWrapperStyle = {
    background: "#e9f6ee",
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "12px",
  };

  const iconStyle = {
    fontSize: "18px",
    color: "green",
  };

  const labelStyle = {
    fontSize: "13px",
    color: "#555",
    marginBottom: "6px",
  };

  const amountStyle = {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#333",
  };

  const moreOptionsStyle = {
    position: "absolute",
    top: "10px",
    right: "10px",
    fontSize: "18px",
    color: "#ccc",
    cursor: "pointer",
  };

  return (
    <div style={cardStyle}>
      <div style={moreOptionsStyle}>⋯</div>
      <div style={iconWrapperStyle}>
        <span style={iconStyle}>💳</span>
      </div>
      <div style={labelStyle}>Wallet Balance</div>
      <div style={amountStyle}>₦3,265</div>
    </div>
  );
};

function TransactionTable() {
  const transactions = [
    {
      id: 1,
      description: "Consultation fee from Goodness Obaleye",
      icon: <FaDownload style={{ color: "#28a745", marginRight: "8px" }} />,
      transactionNo: "92187102965",
      amount: "₦170,150.00",
      type: "Credit",
      dateTime: "Today, 10:30 PM",
      status: "Successful",
      statusColor: "#d4edda", // Light green
      statusText: "#155724", // Dark green
    },
    {
      id: 2,
      description: "Transfer to GTBank personal account",
      icon: <FaUpload style={{ color: "#dc3545", marginRight: "8px" }} />,
      transactionNo: "92187102965",
      amount: "₦50,500.17",
      type: "Debit",
      dateTime: "Today, 8:45 PM",
      status: "In Progress",
      statusColor: "#fff3cd", // Light orange
      statusText: "#856404", // Dark orange
    },
    {
      id: 3,
      description: "Monthly ConnectedHealthPro Subscription Payment",
      icon: <FaDownload style={{ color: "#28a745", marginRight: "8px" }} />,
      transactionNo: "92187102965",
      amount: "₦170,150.00",
      type: "Credit",
      dateTime: "Yesterday, 10:30 PM",
      status: "Successful",
      statusColor: "#d4edda",
      statusText: "#155724",
    },
    {
      id: 4,
      description: "Consultation fee from Matthew Ogbomnaya",
      icon: <FaDownload style={{ color: "#28a745", marginRight: "8px" }} />,
      transactionNo: "92187102965",
      amount: "₦170,150.00",
      type: "Credit",
      dateTime: "Yesterday, 10:30 PM",
      status: "Successful",
      statusColor: "#d4edda",
      statusText: "#155724",
    },
    {
      id: 5,
      description: "Commission percentage from Bayne Pharmacy",
      icon: <FaDownload style={{ color: "#28a745", marginRight: "8px" }} />,
      transactionNo: "92187102965",
      amount: "₦170,150.00",
      type: "Credit",
      dateTime: "March 28, 2025, 10:30 PM",
      status: "Successful",
      statusColor: "#d4edda",
      statusText: "#155724",
    },
    {
      id: 6,
      description: "Commission percentage for patient referral",
      icon: <FaDownload style={{ color: "#28a745", marginRight: "8px" }} />,
      transactionNo: "92187102965",
      amount: "₦170,150.00",
      type: "Credit",
      dateTime: "March 25, 2025, 10:30 PM",
      status: "Successful",
      statusColor: "#d4edda",
      statusText: "#155724",
    },
    {
      id: 7,
      description: "Transfer to GTBank personal account",
      icon: <FaUpload style={{ color: "#dc3545", marginRight: "8px" }} />,
      transactionNo: "92187102965",
      amount: "₦50,500.17",
      type: "Debit",
      dateTime: "March 25, 2025, 8:45 PM",
      status: "Canceled",
      statusColor: "#f8d7da", // Light red
      statusText: "#721c24", // Dark red
    },
  ];

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#f8f8f8",
        minHeight: "100vh",
        boxSizing: "border-box",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          overflow: "hidden",
        }}
      >
        {/* Top Bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "15px 20px",
            borderBottom: "1px solid #eee",
          }}
        >
          <h2
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              color: "#333",
              margin: 0,
            }}
          >
            All Transactions
          </h2>
          <button
            style={{
              background: "none",
              border: "1px solid #ddd",
              borderRadius: "5px",
              padding: "8px 15px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#555",
              fontWeight: "bold",
              fontSize: "14px",
              outline: "none",
              // No hover effect with inline style directly on element
            }}
          >
            <FaSort style={{ fontSize: "14px" }} /> Sort By
          </button>
        </div>

        {/* Transaction Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead
              style={{
                backgroundColor: "#e9ffe9",
                borderBottom: "1px solid #d4edda",
              }}
            >
              <tr style={{ textAlign: "left" }}>
                <th
                  style={{
                    padding: "15px 20px",
                    color: "#28a745",
                    fontSize: "14px",
                    fontWeight: "bold",
                    minWidth: "200px",
                  }}
                >
                  Transaction Description
                </th>
                <th
                  style={{
                    padding: "15px 20px",
                    color: "#28a745",
                    fontSize: "14px",
                    fontWeight: "bold",
                    minWidth: "120px",
                  }}
                >
                  Transaction no
                </th>
                <th
                  style={{
                    padding: "15px 20px",
                    color: "#28a745",
                    fontSize: "14px",
                    fontWeight: "bold",
                    minWidth: "100px",
                  }}
                >
                  Amount
                </th>
                <th
                  style={{
                    padding: "15px 20px",
                    color: "#28a745",
                    fontSize: "14px",
                    fontWeight: "bold",
                    minWidth: "80px",
                  }}
                >
                  Type
                </th>
                <th
                  style={{
                    padding: "15px 20px",
                    color: "#28a745",
                    fontSize: "14px",
                    fontWeight: "bold",
                    minWidth: "150px",
                  }}
                >
                  Date - Time
                </th>
                <th
                  style={{
                    padding: "15px 20px",
                    color: "#28a745",
                    fontSize: "14px",
                    fontWeight: "bold",
                    minWidth: "100px",
                  }}
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr
                  key={transaction.id}
                  style={{
                    borderBottom: "1px solid #eee",
                    backgroundColor: index % 2 === 0 ? "#fff" : "#fcfcfc",
                  }}
                >
                  <td
                    style={{
                      padding: "15px 20px",
                      fontSize: "14px",
                      color: "#333",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {transaction.icon} {transaction.description}
                  </td>
                  <td
                    style={{
                      padding: "15px 20px",
                      fontSize: "14px",
                      color: "#555",
                    }}
                  >
                    {transaction.transactionNo}
                  </td>
                  <td
                    style={{
                      padding: "15px 20px",
                      fontSize: "14px",
                      color: "#333",
                      fontWeight: "bold",
                    }}
                  >
                    {transaction.amount}
                  </td>
                  <td
                    style={{
                      padding: "15px 20px",
                      fontSize: "14px",
                      color: "#555",
                    }}
                  >
                    {transaction.type}
                  </td>
                  <td
                    style={{
                      padding: "15px 20px",
                      fontSize: "14px",
                      color: "#555",
                    }}
                  >
                    {transaction.dateTime}
                  </td>
                  <td style={{ padding: "15px 20px", fontSize: "13px" }}>
                    <span
                      style={{
                        backgroundColor: transaction.statusColor,
                        color: transaction.statusText,
                        padding: "5px 10px",
                        borderRadius: "5px",
                        fontWeight: "bold",
                        display: "inline-block", // Ensure padding applies correctly
                      }}
                    >
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            padding: "20px",
            borderTop: "1px solid #eee",
            gap: "8px",
          }}
        >
          <FaChevronLeft
            style={{ color: "#aaa", cursor: "pointer", fontSize: "14px" }}
          />
          {[1, 2, 3, "", 10, 11].map((page, index) => (
            <span
              key={index}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "30px",
                height: "30px",
                borderRadius: "5px",
                backgroundColor: page === 1 ? "#28a745" : "transparent",
                color: page === 1 ? "white" : "#555",
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: "14px",
                border: page === 1 ? "none" : "1px solid #ddd",
              }}
            >
              {page === "" ? "..." : page}
            </span>
          ))}
          <FaChevronRight
            style={{ color: "#333", cursor: "pointer", fontSize: "14px" }}
          />
        </div>
      </div>
    </div>
  );
}



function ListOfServices() {
  // Mock data for the services table
  const services = [
    {
      id: 1,
      name: 'Consultation Service',
      amount: '₦170,150.00',
      remarks: 'It is a long established fact that a reader will be distracted',
    },
    {
      id: 2,
      name: 'Admission Service - General Medicine',
      amount: '₦50,500.17',
      remarks: 'Many desktop publishing packages and web page editors.',
    },
    {
      id: 3,
      name: 'Commission for Referral to Medical Laboratory',
      amount: '₦170,150.00',
      remarks: 'Various versions have evolved over the years sometimes',
    },
    {
      id: 4,
      name: 'Commission for Referral to Pharmacy',
      amount: '₦170,150.00',
      remarks: 'All the Lorem Ipsum generators on the Internet predefined.',
    },
    {
      id: 5,
      name: 'Commission for Referral to Other Doctors',
      amount: '₦170,150.00',
      remarks: 'This book is a treatise on the theory of ethics very popular.',
    },
    {
      id: 6,
      name: 'Commission for Referral to Other Clinic/Hospital',
      amount: '₦170,150.00',
      remarks: 'Richard McClintock, a Latin professor at Hampden-Sydney.',
    },
    {
      id: 7,
      name: 'Transfer to GTBank personal account',
      amount: '₦50,500.17',
      remarks: 'The standard chunk of Lorem Ipsum used since the 1500s.',
    },
  ];

  return (
    <div className="msf-page__container">
      {/* Header Section */}
      <header className="msf-header">
        <div className="msf-header__left">
          <FaArrowLeft className="msf-header__back-icon" />
          <h1 className="msf-header__title">Manage Service Fee</h1>
        </div>
        <button className="msf-header__add-button">
          <FaPlus className="msf-header__add-icon" />
          Add New Service
        </button>
      </header>

      {/* Main Content Area */}
      <div className="msf-content__area">
        <h2 className="msf-content__list-title">List of Services</h2>

        {/* Services Table */}
        <div className="msf-table__wrapper">
          <table className="msf-table">
            <thead className="msf-table__head">
              <tr className="msf-table__row-header">
                <th className="msf-table__header-cell">Service Name</th>
                <th className="msf-table__header-cell">Amount</th>
                <th className="msf-table__header-cell msf-table__header-cell--remarks">Remarks</th>
                <th className="msf-table__header-cell msf-table__header-cell--action"></th> {/* Action column header */}
              </tr>
            </thead>
            <tbody className="msf-table__body">
              {services.map((service) => (
                <tr key={service.id} className="msf-table__row">
                  <td className="msf-table__cell">{service.name}</td>
                  <td className="msf-table__cell msf-table__cell--amount">{service.amount}</td>
                  <td className="msf-table__cell msf-table__cell--remarks">{service.remarks}</td>
                  <td className="msf-table__cell msf-table__cell--action">
                    <FaPencilAlt className="msf-table__edit-icon" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
