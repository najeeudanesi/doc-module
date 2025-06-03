import React from 'react';
import './PrescriptionPage.css'; // Import our unique-named CSS
import {
  FaArrowLeft,
  FaChevronDown,
  FaRegEdit, // Pencil icon for edit response
  FaArrowRight, // Arrow icon for side buttons
} from 'react-icons/fa';

// Placeholder for patient image (replace with actual path or import)
import patientImage from './patient_placeholder.png'; // Assuming a patient_placeholder.png in the same folder

function PrescriptionPage() {
  // Mock data for the page
  const patient = {
    name: 'William Humphrey',
    profilePic: patientImage, // Using the imported placeholder
    admissionDate: 'September 3, 2025',
    timeAdmitted: '14:39pm',
  };

  const currentPrescription = {
    id: 1,
    date: '12.12.2025',
    items: [
      { s_n: 1, name: 'Azithromycin 250 mg tablet', quantity: '', freq_day: '', duration_days: '' },
      { s_n: 2, name: 'Medrol (Pak) 4 mg tablets in a dose pack', quantity: '', freq_day: '', duration_days: '' },
      { s_n: 3, name: 'Doxycycline hyclate 100 mg capsule', quantity: '', freq_day: '', duration_days: '' },
    ],
  };

  const responses = [
    {
      id: 1,
      author: 'Pharmacists Response',
      date: '12.14.2023',
      time: '11.00am',
      text: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here.',
      editable: false,
    },
    {
      id: 2,
      author: 'Dr. Ember Wynn\'s Responses',
      date: '12.14.2023',
      time: '11.00am',
      text: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here.',
      editable: false,
    },
    {
      id: 3,
      author: 'Pharmacists Response',
      date: '12.14.2023',
      time: '11.00am',
      text: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here.',
      editable: true, // This one has the edit icon
    },
  ];

  return (
    <div className="pres-page__container w-100 main-container">
      {/* Top Header */}
      <div className="pres-header">
        <FaArrowLeft className="pres-header__back-arrow" />
        <h1 className="pres-header__title">{patient.name} Prescriptions</h1>
      </div>

      <div className="pres-page__content-wrapper">
        {/* Left Sidebar - Patient Info */}
        <aside className="pres-sidebar">
          <div className="pres-sidebar__patient-card">
            <img
              src={patient.profilePic}
              alt={patient.name}
              className="pres-sidebar__profile-pic"
            />
            <span className="pres-sidebar__patient-name">{patient.name}</span>
            <span className="pres-sidebar__admission-label">Admission Date</span>
            <span className="pres-sidebar__admission-date">
              {patient.admissionDate}
            </span>
            <span className="pres-sidebar__admission-time">
              Time Admitted: {patient.timeAdmitted}
            </span>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="pres-main-content">
          <div className="pres-main-content__header">
            <span className="pres-main-content__prescription-id">
              Prescription #{currentPrescription.id} - {currentPrescription.date}
            </span>
            <div className="pres-main-content__prescription-date-selector">
              <span className="pres-main-content__prescription-date-label">
                Prescription Date:
              </span>
              <span className="pres-main-content__prescription-date-value">
                {currentPrescription.date}
              </span>
              <button className="pres-main-content__view-other-btn">
                View Other Prescriptions
                <FaChevronDown />
              </button>
            </div>
          </div>

          {/* Prescription Table */}
          <div className="pres-table__wrapper">
            <table className="pres-table">
              <thead className="pres-table__head">
                <tr className="pres-table__row-header">
                  <th className="pres-table__header-cell">S/n</th>
                  <th className="pres-table__header-cell pres-table__header-cell--name">Name</th>
                  <th className="pres-table__header-cell">Quantity</th>
                  <th className="pres-table__header-cell">Freq/Day</th>
                  <th className="pres-table__header-cell">Duration (Days)</th>
                </tr>
              </thead>
              <tbody className="pres-table__body">
                {currentPrescription.items.map((item) => (
                  <tr key={item.s_n} className="pres-table__row">
                    <td className="pres-table__cell">{item.s_n}</td>
                    <td className="pres-table__cell">{item.name}</td>
                    <td className="pres-table__cell">
                      <input type="text" className="pres-table__input" />
                    </td>
                    <td className="pres-table__cell">
                      <input type="text" className="pres-table__input" />
                    </td>
                    <td className="pres-table__cell">
                      <input type="text" className="pres-table__input" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Responses Section */}
          <div className="pres-responses-section">
            {responses.map((response) => (
              <div key={response.id} className="pres-response__card">
                <div className="pres-response__header">
                  <span className="pres-response__author">{response.author}</span>
                  <div className="pres-response__date-time">
                    <span className="pres-response__date">{response.date}</span>
                    <span className="pres-response__time">{response.time}</span>
                    {response.editable && (
                      <FaRegEdit className="pres-response__edit-icon" />
                    )}
                  </div>
                </div>
                <div className="pres-response__text-area">
                  {response.text}
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Right Sidebar - Action Buttons */}
        <aside className="pres-action-sidebar">
          <button className="pres-action-sidebar__button">
            View Patient's Vital
            <FaArrowRight className="pres-action-sidebar__button-icon" />
          </button>
          <button className="pres-action-sidebar__button">
            Add New Prescription
            <FaArrowRight className="pres-action-sidebar__button-icon" />
          </button>
          <button className="pres-action-sidebar__button">
            View Patient File
            <FaArrowRight className="pres-action-sidebar__button-icon" />
          </button>
        </aside>
      </div>
    </div>
  );
}

export default PrescriptionPage;