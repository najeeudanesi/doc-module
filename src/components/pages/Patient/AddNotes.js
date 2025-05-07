import React from "react";
import "./AddNotes.css";

const AddNotes = () => {
  return (
    <div className="addnotes-container">
      <header className="addnotes-header">
        <a href="#" className="back-link">&larr; Omobolanle Abdul Family Medicine Consultation</a>
        <div className="header-right">
          <span className="switch-label">Enable Speech-to-Text</span>
          <label className="switch">
            <input type="checkbox" checked readOnly />
            <span className="slider"></span>
          </label>
          <span className="switch-label">Enable Predictive Care</span>
          <label className="switch">
            <input type="checkbox" checked readOnly />
            <span className="slider"></span>
          </label>
          <span className="note-time">Time: 10:48am</span>
        </div>
      </header>

      <main className="addnotes-main">
        <div className="main-panel">
          <textarea className="notes-box" placeholder="Write your note here..."></textarea>
          <div className="field-column">
            <label>Treatment Schedule</label>
            <textarea className="notes-box"></textarea>
          </div>

          <div className="action-row">
            <button className="btn grey">Preview Record</button>
            <button className="btn green">Submit Record</button>
          </div>

          <section className="consultation-log">
            <h4>Consultation Log</h4>
            <table className="log-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Case Type</th>
                  <th>Medical Record/History</th>
                  <th>Doctor's Name</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>No records</td>
                  <td>Case Note</td>
                  <td>Family Planning Consultation Analysis</td>
                  <td>Dr. Williams Humphrey</td>
                  <td>
                    <button className="view-btn">👁</button>
                  </td>
                </tr>
                <tr>
                  <td>No records</td>
                  <td>Follow-up Consultation</td>
                  <td>Family Planning Consultation Analysis</td>
                  <td>Dr. Williams Humphrey</td>
                  <td>
                    <button className="view-btn">👁</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </section>
        </div>

        <aside className="sidebar">
          <button className="btn-action green">View Patient's Vital</button>
          <button className="btn-action grey">Add Prescription</button>
          <button className="btn-action grey" disabled>Request Lab Work</button>
          <button className="btn-action grey" disabled>Admit Patient</button>
          <button className="btn-action grey" disabled>Schedule Appointment</button>

          <div className="diagnosis-box">Diagnosis Prediction 1</div>
          <div className="diagnosis-box">Diagnosis Prediction 1</div>
        </aside>
      </main>
    </div>
  );
};

export default AddNotes;
