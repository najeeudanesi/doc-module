import React, { useState } from "react";
import "./lab.css"; // Import our unique-named CSS
import {
  FaBars, // Assuming this is for the left hamburger menu
  FaSearch,
  FaChevronDown,
  FaPlus,
  FaRegEdit, // Pencil icon for edit
  FaTimes, // Close icon for modal
  FaDownload, // Assuming the icon next to "Request Lab Work" is download/save
} from "react-icons/fa";
import img from "../../../assets/images/image5.png"; // Import unique-named CSS

function Lab() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLabRequest, setSelectedLabRequest] = useState(null);

  const openModal = (request) => {
    setSelectedLabRequest(request);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedLabRequest(null);
  };

  // Mock data for the lab requests table
  const labRequests = [
    {
      id: 1,
      patientID: "HS9832",
      firstname: "William",
      lastname: "Humphrey",
      labCentre: "Healing Stripes Hospital, Victoria Island, Lagos",
      diagnosis: "Throat-Infection and malaria-infection",
      status: "Completed",
      dataAdmitted: "12.12.2020",
    },
    {
      id: 2,
      patientID: "HS9832",
      firstname: "Bolente",
      lastname: "Awe",
      labCentre: "Reddington Hospitals, Victoria Island, Lagos",
      diagnosis: "Child - Delivery",
      status: "Completed",
      dataAdmitted: "12.12.2020",
    },
    {
      id: 3,
      patientID: "HS9832",
      firstname: "Victor",
      lastname: "Chukwobiobia",
      labCentre: "Genesis Specialist Hospital, Lekki 1, Lagos",
      diagnosis: "Food-poisoning and chronic headache",
      status: "Pending",
      dataAdmitted: "12.12.2020",
    },
    {
      id: 4,
      patientID: "HS9832",
      firstname: "Christopher",
      lastname: "Ejike",
      labCentre: "St. Nicholas Hospital, Lagos Island",
      diagnosis: "Diarrhea and Nausea",
      status: "Pending",
      dataAdmitted: "12.12.2020",
    },
  ];

  return (
    <div className="lab-page__container w-100 main-content">
      {/* Header Section */}
      <div className="lab-header">
        <div className="lab-header__title-section">
          {/* <FaBars className="lab-header__menu-icon" />{" "} */}
          {/* Assuming this icon */}
          <h1 className="lab-header__title">Lab Works</h1>
        </div>

        <div className="lab-header__controls">
          <div className="lab-header__search-filter">
            <div className="lab-header__search-input-wrapper">
              <input
                type="text"
                placeholder="Search"
                className="lab-header__search-input"
              />
              <FaSearch className="lab-header__search-icon" />
            </div>
            <div className="lab-header__filter-dropdown">
              <span className="lab-header__filter-text">Filter</span>
              <FaChevronDown className="lab-header__filter-icon" />
            </div>
          </div>
          <button className="lab-header__request-button">
            <FaPlus className="lab-header__request-icon" />
            Request Lab Work
            <FaDownload className="lab-header__download-icon" />
          </button>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="lab-tabs__container">
        <button className="lab-tabs__button lab-tabs__button--active">
          Lab Requests Log
        </button>
      </div>

      {/* Table Section */}
      <div className="lab-table__wrapper">
        <table className="lab-table">
          <thead className="lab-table__head">
            <tr className="lab-table__row-header">
              <th className="lab-table__header-cell">Patience #ID</th>
              <th className="lab-table__header-cell">Firstname</th>
              <th className="lab-table__header-cell">Lastname</th>
              <th className="lab-table__header-cell">Lab Centre</th>
              <th className="lab-table__header-cell">Diagnosis</th>
              <th className="lab-table__header-cell">Status</th>
              <th className="lab-table__header-cell">Data Admitted</th>
              <th className="lab-table__header-cell lab-table__header-cell--action"></th>{" "}
              {/* Action column */}
            </tr>
          </thead>
          <tbody className="lab-table__body">
            {labRequests.map((request) => (
              <tr key={request.id} className="lab-table__row">
                <td className="lab-table__cell">{request.patientID}</td>
                <td className="lab-table__cell">{request.firstname}</td>
                <td className="lab-table__cell">{request.lastname}</td>
                <td className="lab-table__cell lab-table__cell--lab-centre">
                  {request.labCentre}
                </td>
                <td className="lab-table__cell">{request.diagnosis}</td>
                <td className="lab-table__cell">
                  <span
                    className={`lab-table__status lab-table__status--${request.status
                      .toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    {request.status}
                  </span>
                </td>
                <td className="lab-table__cell">{request.dataAdmitted}</td>
                <td className="lab-table__cell lab-table__cell--action">
                  <button
                    className="lab-table__edit-button"
                    onClick={() => openModal(request)}
                  >
                    <FaRegEdit className="lab-table__edit-icon" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="lab-modal__overlay">
          <div className="lab-modal__content">
            <div className="lab-modal__header">
              <h3 className="lab-modal__title">Lab Request Details</h3>
              <button className="lab-modal__close-button" onClick={closeModal}>
                <FaTimes />
              </button>
            </div>

            <div className="lab-modal__body">
              {selectedLabRequest && (
                <>
                  {/* <p className="lab-modal__detail-item">
                    <strong>Patient ID:</strong> {selectedLabRequest.patientID}
                  </p>
                  <p className="lab-modal__detail-item">
                    <strong>Name:</strong> {selectedLabRequest.firstname}{" "}
                    {selectedLabRequest.lastname}
                  </p>
                  <p className="lab-modal__detail-item">
                    <strong>Lab Centre:</strong> {selectedLabRequest.labCentre}
                  </p>
                  <p className="lab-modal__detail-item">
                    <strong>Diagnosis:</strong> {selectedLabRequest.diagnosis}
                  </p>
                  <p className="lab-modal__detail-item">
                    <strong>Status:</strong> {selectedLabRequest.status}
                  </p>
                  <p className="lab-modal__detail-item">
                    <strong>Date Admitted:</strong>{" "}
                    {selectedLabRequest.dataAdmitted}
                  </p> */}
                  <LabReportDetails />

                  {/* Add more details or a form for editing here */}
                </>
              )}
            </div>
            <div className="lab-modal__footer">
              <button
                className="lab-modal__footer-button lab-modal__footer-button--cancel"
                onClick={closeModal}
              >
                Close
              </button>
              {/* <button className="lab-modal__footer-button lab-modal__footer-button--save">Save Changes</button> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Lab;

// Placeholder images (replace with actual paths if you have them)
// In a real app, you'd import these or get them from props/API
// import xrayImage from './xray.png';   // Assuming you have an xray.png in the same folder
// import heatmapImage from './heatmap.png'; // Assuming you have a heatmap.png in the same folder

function LabReportDetails({ reportData }) {
  // Provide default data if props are not supplied or are incomplete
  const defaultReportData = {
    patientName: "Firstname Lastname",
    reportDate: "22.12.2023",
    reportTime: "10:39am",
    subject: "Causative Bacteria Resulting from Respiratory Infection",
    labFindingsText: [
    ],
    imageUrl1: img,
    imageUrl2: img,
  };

  const data = { ...defaultReportData, ...reportData }; // Merge provided data with defaults

  return (
    <div className="lr-report-container">
      {/* Header Section */}
      <div className="lr-header-section">
        <div className="lr-header-section__left">
          <span className="lr-header-section__patient-name">
            {data.patientName}
          </span>
          <span className="lr-header-section__report-label">Lab Report</span>
        </div>
        <div className="lr-header-section__right">
          <span className="lr-header-section__date">{data.reportDate}</span>
          <span className="lr-header-section__time">{data.reportTime}</span>
        </div>
      </div>

      {/* Subject Section */}
      <div className="lr-subject-section">
        <span className="lr-subject-section__label">Subject</span>
        <span className="lr-subject-section__text">{data.subject}</span>
      </div>

      {/* Lab Findings Section */}
      <div className="lr-findings-section">
        <h3 className="lr-findings-section__title">Lab Findings</h3>
        <div className="lr-findings-section__text-content">
          {data.labFindingsText.map((paragraph, index) => (
            <p key={index} className="lr-findings-section__paragraph">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {/* Image Section */}
      <div className="lr-images-section">
        {data.imageUrl1 && (
          <div className="lr-images-section__image-wrapper">
            <img
              src={data.imageUrl1}
              alt="Lab Finding 1"
              className="lr-images-section__image"
            />
          </div>
        )}
        {data.imageUrl2 && (
          <div className="lr-images-section__image-wrapper">
            <img
              src={data.imageUrl2}
              alt="Lab Finding 2"
              className="lr-images-section__image"
            />
          </div>
        )}
      </div>
    </div>
  );
}
