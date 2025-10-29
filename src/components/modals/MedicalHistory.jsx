import React, { useState, useEffect } from "react";
import { get } from "../../utility/fetch";
import { RiCloseFill } from "react-icons/ri";
import logo from "../../assets/images/Group-2.png";
import "animate.css";
import "../../assets/css/medicalHistory.css";

const MedicalHistory = ({ patientId, closeModal, data }) => {
  const [patientDetails, setPatientDetails] = useState([
    // {
    //   dateOfVisit: "2025-07-15T09:30:00Z",
    //   doctor: "John Doe",
    //   temperature: 37.5,
    //   heartPulse: 78,
    //   weight: 70,
    //   age: 29,
    //   bloodPressure: "120/80",
    //   respiratory: 18,
    //   oxygenSaturation: 96,
    //   bloodSugar: "90 mg/dL",
    //   diagnosis: "Mild fever and dehydration",
    //   carePlan: "Rehydration therapy and rest for 3 days.",
    //   drugName: "Paracetamol",
    //   quantity: 10,
    //   frequency: 2,
    //   duration: 5,
    //   otherMedicationsQuantity: 6,
    //   otherMedicationsFrequency: 1,
    //   otherMedicationsDuration: 3,
    //   pharmacistNote: "Take with food. Do not exceed 4g of Paracetamol/day.",
    //   isAdmitted: false,
    // },
    // {
    //   dateOfVisit: "2025-06-10T14:00:00Z",
    //   doctor: "Jane Smith",
    //   temperature: 38.2,
    //   heartPulse: 85,
    //   weight: 80,
    //   age: 45,
    //   bloodPressure: "130/85",
    //   respiratory: 20,
    //   oxygenSaturation: 92,
    //   bloodSugar: "110 mg/dL",
    //   diagnosis: "Upper respiratory tract infection",
    //   carePlan: "Antibiotics and follow-up after 7 days.",
    //   drugName: "Amoxicillin",
    //   quantity: 15,
    //   frequency: 3,
    //   duration: 5,
    //   otherMedicationsQuantity: 0,
    //   otherMedicationsFrequency: 0,
    //   otherMedicationsDuration: 0,
    //   pharmacistNote: "Complete full antibiotic course.",
    //   isAdmitted: true,
    // },
  ]);
  const docInfo = JSON.parse(localStorage.getItem("USER_INFO"));

  useEffect(() => {
    console.log(data);
    const fetchData = async () => {
      try {
        const detailsResponse = await get(
          `/patients/${patientId}/medicalHistory`
        );
        setPatientDetails(detailsResponse);
        console.log("Patient Details:", detailsResponse);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [patientId]);

  return (
    <div className="overlay">
      <RiCloseFill className="close-btn pointer" onClick={closeModal} />
      <div className="modal-box w-80">
        <div className="p-20">
          {/* <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                        <img src={logo} alt="Organization Logo" style={{ height: '50px', marginRight: '20px' }} />
                        <h1>Organization Name</h1>
                    </div> */}
          {/* Header */}
          <div className="header">
            {/* <img src={logo} alt="Organization Logo" className="logo" /> */}
            <h1>Medical Record</h1>
          </div>

          <div
            style={{
              maxHeight: "70vh",
              overflowY: "auto",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              backgroundColor: "#fff",
            }}
          >
            {patientDetails && patientDetails.length > 0 ? (
              patientDetails.map((item, index) => (
              <div
                key={index}
                style={{
                  marginBottom:
                    index < patientDetails.length - 1 ? "40px" : "0",
                  paddingBottom:
                    index < patientDetails.length - 1 ? "40px" : "0",
                  borderBottom:
                    index < patientDetails.length - 1
                      ? "2px solid #eee"
                      : "none",
                }}
              >
                <div
                  style={{
                    padding: "20px",
                    fontFamily: "Arial, sans-serif",
                    lineHeight: "1.6",
                  }}
                >
                  {/* Letter Header */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "30px",
                    }}
                  >
                    <div>
                      <p style={{ margin: "0", fontWeight: "bold" }}>
                        Date: {new Date(item?.dateOfVisit).toLocaleDateString()}
                      </p>
                      <p style={{ margin: "5px 0", fontWeight: "bold" }}>
                        {docInfo?.clinicId === 2
                          ? "Heartland Cardiovascular"
                          : "Medical Center"}
                      </p>
                      <p style={{ margin: "5px 0" }}>Dr. {item?.doctor}</p>
                      {item?.specialistType && (
                        <p style={{ margin: "5px 0", fontStyle: "italic" }}>
                          Specialist:{" "}
                          {item.specialistType?.toLowerCase() ===
                          "general practice"
                            ? "General Practitioner"
                            : item.specialistType}
                        </p>
                      )}
                    </div>
                    {/* <img
                      src={logo}
                      alt="Hospital Logo"
                      style={{ height: "60px" }}
                    /> */}
                  </div>

                  {/* Medical Report Title */}
                  {/* <div style={{ textAlign: "center", marginBottom: "30px" }}>
                    <h2 style={{ margin: "0", textDecoration: "underline" }}>
                      MEDICAL REPORT
                    </h2>
                  </div> */}

                  {/* Patient Information Section */}
                  <div style={{ marginBottom: "30px" }}>
                    <h3 style={{ margin: "0 0 15px 0", color: "#2c3e50" }}>
                      Patient Information:
                    </h3>
                    <table
                      style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        border: "1px solid #ddd",
                        fontSize: "14px",
                        marginBottom: "20px",
                      }}
                    >
                      <tbody>
                        <tr>
                          <td
                            style={{
                              padding: "8px",
                              border: "1px solid #ddd",
                              fontWeight: "bold",
                              backgroundColor: "#f8f9fa",
                              width: "25%",
                            }}
                          >
                            Full Name
                          </td>
                          <td
                            style={{
                              padding: "8px",
                              border: "1px solid #ddd",
                              width: "25%",
                            }}
                          >
                            {item?.patientName ||
                              data?.firstName + " " + data?.lastName ||
                              "N/A"}
                          </td>
                          <td
                            style={{
                              padding: "8px",
                              border: "1px solid #ddd",
                              fontWeight: "bold",
                              backgroundColor: "#f8f9fa",
                              width: "25%",
                            }}
                          >
                            Date of Birth
                          </td>
                          <td
                            style={{
                              padding: "8px",
                              border: "1px solid #ddd",
                              width: "25%",
                            }}
                          >
                            {item?.dateOfBirth
                              ? new Date(item.dateOfBirth).toLocaleDateString()
                              : data?.dateOfBirth
                              ? new Date(data.dateOfBirth).toLocaleDateString()
                              : "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              padding: "8px",
                              border: "1px solid #ddd",
                              fontWeight: "bold",
                              backgroundColor: "#f8f9fa",
                            }}
                          >
                            Address
                          </td>
                          <td
                            style={{ padding: "8px", border: "1px solid #ddd" }}
                          >
                            {item?.address || data?.address || "N/A"}
                          </td>
                          <td
                            style={{
                              padding: "8px",
                              border: "1px solid #ddd",
                              fontWeight: "bold",
                              backgroundColor: "#f8f9fa",
                            }}
                          >
                            Birth Sex
                          </td>
                          <td
                            style={{ padding: "8px", border: "1px solid #ddd" }}
                          >
                            {item?.gender || data?.gender || "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              padding: "8px",
                              border: "1px solid #ddd",
                              fontWeight: "bold",
                              backgroundColor: "#f8f9fa",
                            }}
                          >
                            Phone Number
                          </td>
                          <td
                            style={{ padding: "8px", border: "1px solid #ddd" }}
                          >
                            {item?.phoneNumber || data?.phoneNumber || "N/A"}
                          </td>
                          <td
                            style={{
                              padding: "8px",
                              border: "1px solid #ddd",
                              fontWeight: "bold",
                              backgroundColor: "#f8f9fa",
                            }}
                          >
                            Nationality
                          </td>
                          <td
                            style={{ padding: "8px", border: "1px solid #ddd" }}
                          >
                            {item?.nationality || data?.nationality || "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              padding: "8px",
                              border: "1px solid #ddd",
                              fontWeight: "bold",
                              backgroundColor: "#f8f9fa",
                            }}
                          >
                            Email Address
                          </td>
                          <td
                            style={{ padding: "8px", border: "1px solid #ddd" }}
                          >
                            {item?.email || data?.email || "N/A"}
                          </td>
                          <td
                            style={{
                              padding: "8px",
                              border: "1px solid #ddd",
                              fontWeight: "bold",
                              backgroundColor: "#f8f9fa",
                            }}
                          >
                            Preferred Language
                          </td>
                          <td
                            style={{ padding: "8px", border: "1px solid #ddd" }}
                          >
                            {item?.preferredLanguage ||
                              data?.preferredLanguage ||
                              "English"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Vitals Section - Tabular Format */}
                  <div style={{ marginBottom: "25px" }}>
                    <h3 style={{ margin: "0 0 15px 0", color: "#2c3e50" }}>
                      Vital Signs:
                    </h3>
                    <table
                      style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        border: "1px solid #ddd",
                        fontSize: "14px",
                      }}
                    >
                      <tbody>
                        <tr>
                          <td
                            style={{
                              padding: "8px",
                              border: "1px solid #ddd",
                              fontWeight: "bold",
                              backgroundColor: "#f8f9fa",
                            }}
                          >
                            Temperature
                          </td>
                          <td
                            style={{ padding: "8px", border: "1px solid #ddd" }}
                          >
                            {item?.temperature}°C
                          </td>
                          <td
                            style={{
                              padding: "8px",
                              border: "1px solid #ddd",
                              fontWeight: "bold",
                              backgroundColor: "#f8f9fa",
                            }}
                          >
                            Heart Rate
                          </td>
                          <td
                            style={{ padding: "8px", border: "1px solid #ddd" }}
                          >
                            {item?.heartPulse} bpm
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              padding: "8px",
                              border: "1px solid #ddd",
                              fontWeight: "bold",
                              backgroundColor: "#f8f9fa",
                            }}
                          >
                            Weight
                          </td>
                          <td
                            style={{ padding: "8px", border: "1px solid #ddd" }}
                          >
                            {item?.weight} kg
                          </td>
                          <td
                            style={{
                              padding: "8px",
                              border: "1px solid #ddd",
                              fontWeight: "bold",
                              backgroundColor: "#f8f9fa",
                            }}
                          >
                            Blood Pressure
                          </td>
                          <td
                            style={{ padding: "8px", border: "1px solid #ddd" }}
                          >
                            {item?.bloodPressure}
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              padding: "8px",
                              border: "1px solid #ddd",
                              fontWeight: "bold",
                              backgroundColor: "#f8f9fa",
                            }}
                          >
                            Age
                          </td>
                          <td
                            style={{ padding: "8px", border: "1px solid #ddd" }}
                          >
                            {item?.age} years
                          </td>
                          <td
                            style={{
                              padding: "8px",
                              border: "1px solid #ddd",
                              fontWeight: "bold",
                              backgroundColor: "#f8f9fa",
                            }}
                          >
                            Respiratory Rate
                          </td>
                          <td
                            style={{ padding: "8px", border: "1px solid #ddd" }}
                          >
                            {item?.respiratory}
                          </td>
                        </tr>
                        {item?.oxygenSaturation && (
                          <tr>
                            <td
                              style={{
                                padding: "8px",
                                border: "1px solid #ddd",
                                fontWeight: "bold",
                                backgroundColor: "#f8f9fa",
                              }}
                            >
                              O₂ Saturation
                            </td>
                            <td
                              style={{
                                padding: "8px",
                                border: "1px solid #ddd",
                              }}
                            >
                              {item?.oxygenSaturation}%
                            </td>
                            <td
                              style={{
                                padding: "8px",
                                border: "1px solid #ddd",
                                fontWeight: "bold",
                                backgroundColor: "#f8f9fa",
                              }}
                            >
                              Blood Sugar
                            </td>
                            <td
                              style={{
                                padding: "8px",
                                border: "1px solid #ddd",
                              }}
                            >
                              {item?.bloodSugar || "N/A"}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Patient Complaint */}
                  {item?.patientComplaint && (
                    <div style={{ marginBottom: "20px" }}>
                      <h3 style={{ margin: "0 0 10px 0", color: "#2c3e50" }}>
                        Patient Complaint:
                      </h3>
                      <p style={{ margin: "0", textAlign: "justify" }}>
                        {item.patientComplaint}
                      </p>
                    </div>
                  )}

                  {/* History */}
                  {item?.history && (
                    <div style={{ marginBottom: "20px" }}>
                      <h3 style={{ margin: "0 0 10px 0", color: "#2c3e50" }}>
                        History:
                      </h3>
                      <p style={{ margin: "0", textAlign: "justify" }}>
                        {item.history}
                      </p>
                    </div>
                  )}

                  {/* Physical Examination */}
                  {item?.physicalExamination && (
                    <div style={{ marginBottom: "20px" }}>
                      <h3 style={{ margin: "0 0 10px 0", color: "#2c3e50" }}>
                        Physical Examination:
                      </h3>
                      <p style={{ margin: "0", textAlign: "justify" }}>
                        {item.physicalExamination}
                      </p>
                    </div>
                  )}

                  {/* Investigation */}
                  {item?.investigation && (
                    <div style={{ marginBottom: "20px" }}>
                      <h3 style={{ margin: "0 0 10px 0", color: "#2c3e50" }}>
                        Investigation:
                      </h3>
                      <p style={{ margin: "0", textAlign: "justify" }}>
                        {item.investigation}
                      </p>
                    </div>
                  )}

                  {/* Diagnosis */}
                  <div style={{ marginBottom: "20px" }}>
                    <h3 style={{ margin: "0 0 10px 0", color: "#2c3e50" }}>
                      Diagnosis:
                    </h3>
                    <p
                      style={{
                        margin: "0",
                        textAlign: "justify",
                        fontWeight: "500",
                      }}
                    >
                      {item?.diagnosis}
                    </p>
                  </div>

                  {/* Care Plan */}
                  <div style={{ marginBottom: "20px" }}>
                    <h3 style={{ margin: "0 0 10px 0", color: "#2c3e50" }}>
                      Treatment Plan:
                    </h3>
                    <p style={{ margin: "0", textAlign: "justify" }}>
                      {item?.carePlan || "None specified"}
                    </p>
                  </div>

                  {/* Medications */}
                  <div style={{ marginBottom: "20px" }}>
                    <h3 style={{ margin: "0 0 15px 0", color: "#2c3e50" }}>
                      Prescribed Medications:
                    </h3>
                    {item?.medications?.length > 0 ? (
                      <div>
                        {item.medications.map((medication, medIndex) => (
                          <div
                            key={medIndex}
                            style={{
                              marginBottom: "10px",
                              paddingLeft: "20px",
                            }}
                          >
                            <p style={{ margin: "0" }}>
                              • <strong>{medication?.drugName}</strong> -{" "}
                              {medication?.quantity} tab(s),
                              {medication?.frequency} times daily for{" "}
                              {medication?.duration} days
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p style={{ margin: "0", fontStyle: "italic" }}>
                        No medications prescribed.
                      </p>
                    )}

                    {item?.otherMedicationsQuantity > 0 && (
                      <div style={{ marginTop: "10px", paddingLeft: "20px" }}>
                        <p style={{ margin: "0" }}>
                          • Additional Medications:{" "}
                          {item.otherMedicationsQuantity} tab(s),
                          {item.otherMedicationsFrequency} times daily for{" "}
                          {item.otherMedicationsDuration} days
                        </p>
                      </div>
                    )}

                    {item?.pharmacistNote && (
                      <div
                        style={{
                          marginTop: "15px",
                          padding: "10px",
                          backgroundColor: "#f8f9fa",
                          borderLeft: "4px solid #007bff",
                        }}
                      >
                        <p style={{ margin: "0", fontStyle: "italic" }}>
                          <strong>Pharmacist Note:</strong>{" "}
                          {item.pharmacistNote}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Admission Status */}
                  <div style={{ marginBottom: "30px" }}>
                    <h3 style={{ margin: "0 0 10px 0", color: "#2c3e50" }}>
                      Patient Status:
                    </h3>
                    <p
                      style={{
                        margin: "0",
                        padding: "8px 12px",
                        borderRadius: "4px",
                        backgroundColor: item?.isAdmitted
                          ? "#d4edda"
                          : "#f8d7da",
                        color: item?.isAdmitted ? "#155724" : "#721c24",
                        display: "inline-block",
                        fontWeight: "bold",
                      }}
                    >
                      {item?.isAdmitted
                        ? "Patient Admitted"
                        : "Outpatient Treatment"}
                    </p>
                  </div>

                  {/* Footer/Signature Area */}
                  <div
                    style={{
                      marginTop: "40px",
                      borderTop: "1px solid #ddd",
                      paddingTop: "20px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>
                        <p style={{ margin: "0", fontWeight: "bold" }}>
                          Dr. {item?.doctor}
                        </p>
                        <p style={{ margin: "5px 0", fontSize: "12px" }}>
                          Attending Physician
                        </p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ margin: "0", fontSize: "12px" }}>
                          Report Generated: {new Date().toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
            ) : (
              <div style={{ textAlign: "center", padding: "40px" }}>
                <p>No medical history available for this patient.</p>
              </div>
            )}
          </div>

          <div className="button-container">
            <button className="close-button" onClick={closeModal}>
              Close
            </button>
          </div>
          {/* <div className="pagination-controls">
                        <button onClick={handlePreviousPage} disabled={currentPage === 0}>Previous</button>
                        <button onClick={handleNextPage} disabled={currentPage === patientDetails.length - 1}>Next</button>
                    </div> */}
        </div>
      </div>
    </div>
  );
};

export default MedicalHistory;
