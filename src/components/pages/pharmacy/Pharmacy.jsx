import React from 'react';
import './pharmacy.css'; // Import our unique-named CSS
import {
  FaSearch,
  FaChevronDown,
  FaPlus,
  FaRegEdit, // Pencil icon for edit
  FaDownload // Assuming this icon is for the button next to "Add Prescription"
} from 'react-icons/fa';
import PrescriptionPage from './PrescriptionPage';

function PharmacyPage() {
  // Mock data for the prescriptions table
  const prescriptions = [
    {
      id: 1,
      patientID: 'HS9832',
      firstname: 'William',
      lastname: 'Humphrey',
      clinicHospital: 'Not Admitted/Online Consultation Patient',
      diagnosis: 'Throat-Infection and malaria-infection',
      status: 'Completed',
      dateAdmitted: '12.12.2020',
      statusType: 'completed', // For styling
    },
    {
      id: 2,
      patientID: 'HS9832',
      firstname: 'Bolente',
      lastname: 'Awe',
      clinicHospital: 'Reddington Hospitals, Victoria Island, Lagos',
      diagnosis: 'Food poisoning and chronic headache',
      status: 'Message', // This status has a small orange circle
      dateAdmitted: '12.12.2020',
      statusType: 'message', // For styling
    },
    {
      id: 3,
      patientID: 'HS9832',
      firstname: 'Victor',
      lastname: 'Chukwobiobia',
      clinicHospital: 'Genesis Specialist Hospital, Lekki 1, Lagos',
      diagnosis: 'Food poisoning and chronic headache',
      status: 'Pending',
      dateAdmitted: '12.12.2020',
      statusType: 'pending', // For styling
    },
    {
      id: 4,
      patientID: 'HS9832',
      firstname: 'Christopher',
      lastname: 'Ejike',
      clinicHospital: 'St. Nicholas Hospital, Lagos',
      diagnosis: 'Diarrhoea and Nausea',
      status: 'Pending',
      dateAdmitted: '12.12.2020',
      statusType: 'pending', // For styling
    },
  ];

  const handleEditClick = (prescriptionId) => {
    alert(`Edit prescription with ID: ${prescriptionId}`);
    // In a real application, you'd open a modal or navigate to an edit page
  };

  return (
    <div className="pharm-page__container w-100 main-content">
      {/* Header Section */}
      <div className="pharm-header">
        <h1 className="pharm-header__title">Patients Prescription</h1>

        <div className="pharm-header__controls">
          <div className="pharm-header__search-filter">
            <div className="pharm-header__search-input-wrapper">
              <input
                type="text"
                placeholder="Search"
                className="pharm-header__search-input"
              />
              <FaSearch className="pharm-header__search-icon" />
            </div>
            <div className="pharm-header__filter-dropdown">
              <span className="pharm-header__filter-text">Filter</span>
              <FaChevronDown className="pharm-header__filter-icon" />
            </div>
          </div>
          <button className="pharm-header__add-button">
            <FaPlus className="pharm-header__add-icon" />
            Add Prescription
            <FaDownload className="pharm-header__download-icon" />
          </button>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="pharm-tabs__container">
        <button className="pharm-tabs__button pharm-tabs__button--active">
          Prescription
        </button>
      </div>

      {/* Table Section */}
      <div className="pharm-table__wrapper">
        <table className="pharm-table">
          <thead className="pharm-table__head">
            <tr className="pharm-table__row-header">
              <th className="pharm-table__header-cell">Patience ID</th>
              <th className="pharm-table__header-cell">Firstname</th>
              <th className="pharm-table__header-cell">Lastname</th>
              <th className="pharm-table__header-cell pharm-table__header-cell--clinic">Clinic/Hospital</th>
              <th className="pharm-table__header-cell">Diagnosis</th>
              <th className="pharm-table__header-cell">Status</th>
              <th className="pharm-table__header-cell">Date Admitted</th>
              <th className="pharm-table__header-cell pharm-table__header-cell--action"></th> {/* Action column */}
            </tr>
          </thead>
          <tbody className="pharm-table__body">
            {prescriptions.map((prescription) => (
              <tr key={prescription.id} className="pharm-table__row">
                <td className="pharm-table__cell">{prescription.patientID}</td>
                <td className="pharm-table__cell">{prescription.firstname}</td>
                <td className="pharm-table__cell">{prescription.lastname}</td>
                <td className="pharm-table__cell pharm-table__cell--clinic">
                  {prescription.clinicHospital}
                </td>
                <td className="pharm-table__cell">{prescription.diagnosis}</td>
                <td className="pharm-table__cell">
                  {/* Status with optional circle */}
                  <span className={`pharm-table__status pharm-table__status--${prescription.statusType}`}>
                    {prescription.statusType === 'message' && (
                      <span className="pharm-table__status-indicator"></span>
                    )}
                    {prescription.status}
                  </span>
                </td>
                <td className="pharm-table__cell">{prescription.dateAdmitted}</td>
                <td className="pharm-table__cell pharm-table__cell--action">
                  <button
                    className="pharm-table__edit-button"
                    onClick={() => handleEditClick(prescription.id)}
                  >
                    <FaRegEdit className="pharm-table__edit-icon" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PrescriptionPage/>
    </div>
  );
}

export default PharmacyPage;