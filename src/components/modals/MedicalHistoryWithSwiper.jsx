import React, { useState, useEffect } from "react";
import { get } from "../../utility/fetch";
import { RiCloseFill } from "react-icons/ri";
import logo from "../../assets/images/Group-2.png";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import {
  FaTimes,
  FaCalendarAlt,
  FaUserMd,
  FaHeartbeat,
  FaThermometerHalf,
  FaWeight,
  FaNotesMedical,
  FaCapsules,
  FaPills,
  FaProcedures,
} from "react-icons/fa";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "animate.css";
import "../../assets/css/medicalHistory.css";

const MedicalHistory = ({ patientId, closeModal }) => {
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
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState("next");
  const docInfo = JSON.parse(localStorage.getItem("USER_INFO"));

  useEffect(() => {
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

  const handleNextPage = () => {
    if (currentPage < patientDetails.length - 1) {
      setDirection("next");
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setDirection("prev");
      setCurrentPage((prev) => prev - 1);
    }
  };

  const currentPageDetails = patientDetails[currentPage] || {};

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
            <img src={logo} alt="Organization Logo" className="logo" />
            <h1>Medical Records</h1>
          </div>

          <Swiper
            // install Swiper modules
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            spaceBetween={50}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            scrollbar={{ draggable: true }}
            onSwiper={(swiper) => console.log(swiper)}
            onSlideChange={() => console.log("slide change")}
          >
            {patientDetails.map((item) => (
              <SwiperSlide>
                {/* Date & Doctor Info */}
                <div style={{ padding: "20px 5%" }}>
                 <div style={{ textAlign: "center", width: "100%" }}>
                  <h1 style={{ textAlign: "center", width: "100%" }}>
                    {docInfo?.clinicId == 2 && "Heartland Cardiovascular"}
                  </h1>
                  {item?.specialistType && (
                    <div style={{ textAlign: "center", width: "100%" }}>
                      <strong>Specialist:</strong>{" "}
                      {item.specialistType?.toLowerCase() === "general practice"
                        ? "General Practitioner"
                        : item.specialistType}
                    </div>
                  )}
                </div>

                <div className="info-row">
                  <p>
                    <FaCalendarAlt className="icon" />{" "}
                    {new Date(item?.dateOfVisit).toDateString()}
                  </p>
                  <p>
                    <FaUserMd className="icon" /> Dr. {item?.doctor}
                  </p>
                </div>

                {/* Vitals Section */}
                <div className="section">
                  <h2>Vital Signs</h2>
                  <div className="grid">
                    <p>
                      <FaThermometerHalf className="icon" /> Temp:{" "}
                      {item?.temperature}°C
                    </p>
                    <p>
                      <FaHeartbeat className="icon" /> Heart Rate:{" "}
                      {item?.heartPulse} bpm
                    </p>
                    <p>
                      <FaWeight className="icon" /> Weight: {item?.weight} kg
                    </p>
                    <p>
                      <FaNotesMedical className="icon" /> Age: {item?.age}
                    </p>
                    <p>BP: {item?.bloodPressure}</p>
                    <p>Respiratory: {item?.respiratory}</p>
                    {item?.oxygenSaturation && (
                      <p>O₂ Saturation: {item?.oxygenSaturation}%</p>
                    )}
                    {item?.bloodSugar && <p>Blood Sugar: {item?.bloodSugar}</p>}
                  </div>
                </div>

                {/* Diagnosis Section */}
                <div
                  className="section highlight"
                  // style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div className="">
                    <h2>Patient Complaint</h2>
                    <p>{item?.patientComplaint || 'N/A'}</p>
                  </div>
                </div>
                <div
                  className="section highlight"
                  // style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div className="">
                    <h2>History</h2>
                    <p>{item?.history||'N/A'}</p>
                  </div>
                </div>
                <div
                  className="section highlight"
                  // style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div className="">
                    <h2>Physical Exam</h2>
                    <p>{item?.physicalExamination||'N/A'}</p>
                  </div>
                </div>
                <div
                  className="section highlight"
                  // style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div className="">
                    <h2>Diagnosis</h2>
                    <p>{item?.diagnosis}</p>
                  </div>
                </div>

                {/* Care Plan */}
                <div className="section">
                  <h2>Doctor's Care Plan</h2>
                  <p>{item?.carePlan || "None"}</p>
                </div>

                {/* Medication Details */}
                <div className="section">
                  <h2>
                    <FaCapsules className="icon" /> Medications
                  </h2>

                  {item?.medications?.map((items) => (
                    <div>
                      {items?.drugName ? (
                        <p>
                          <FaPills className="icon" /> {items?.drugName} -{" "}
                          {items?.quantity} tab(s) x {items?.frequency} daily
                          for {items?.duration} days
                        </p>
                      ) : (
                        <p>No prescribed medications.</p>
                      )}
                    </div>
                  ))}

                  {item?.otherMedicationsQuantity > 0 && (
                    <p>
                      Additional Meds: {item?.otherMedicationsQuantity} tab(s) x{" "}
                      {item?.otherMedicationsFrequency} daily for{" "}
                      {item?.otherMedicationsDuration} days
                    </p>
                  )}
                  <p className="note">{item?.pharmacistNote}</p>
                </div>

                {/* Admission Status */}
                <p
                  className={`status ${
                    item?.isAdmitted ? "admitted" : "not-admitted"
                  }`}
                >
                  {item?.isAdmitted ? "Admitted" : "Not Admitted"}
                </p>
                </div>

                {/* Close Button */}
              </SwiperSlide>
            ))}
          </Swiper>

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
