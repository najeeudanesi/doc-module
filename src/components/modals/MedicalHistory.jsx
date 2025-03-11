import React, { useState, useEffect } from 'react';
import { get } from '../../utility/fetch';
import { RiCloseFill } from 'react-icons/ri';
import logo from '../../assets/images/Group-2.png';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { FaTimes, FaCalendarAlt, FaUserMd, FaHeartbeat, FaThermometerHalf, FaWeight, FaNotesMedical, FaCapsules, FaPills, FaProcedures } from 'react-icons/fa';


import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'animate.css';
import '../../assets/css/medicalHistory.css';

const MedicalHistory = ({ patientId, closeModal }) => {
    const [patientDetails, setPatientDetails] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [direction, setDirection] = useState('next');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const detailsResponse = await get(`/patients/${patientId}/medicalHistory`);
                setPatientDetails(detailsResponse);
                console.log('Patient Details:', detailsResponse);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [patientId]);

    const handleNextPage = () => {
        if (currentPage < patientDetails.length - 1) {
            setDirection('next');
            setCurrentPage((prev) => prev + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 0) {
            setDirection('prev');
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
                        <h1>Medical History</h1>
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
                        onSlideChange={() => console.log('slide change')}
                    >
                        {patientDetails.map((item) => (
                            <SwiperSlide>
                                {/* Date & Doctor Info */}
                                <div className="info-row">
                                    <p><FaCalendarAlt className="icon" /> {new Date(item?.dateOfVisit).toDateString()}</p>
                                    <p><FaUserMd className="icon" /> Dr. {item?.doctor}</p>
                                </div>

                                {/* Vitals Section */}
                                <div className="section">
                                    <h2>Vital Signs</h2>
                                    <div className="grid">
                                        <p><FaThermometerHalf className="icon" /> Temp: {item?.temperature}°C</p>
                                        <p><FaHeartbeat className="icon" /> Heart Rate: {item?.heartPulse} bpm</p>
                                        <p><FaWeight className="icon" /> Weight: {item?.weight} kg</p>
                                        <p><FaNotesMedical className="icon" /> Age: {item?.age}</p>
                                        <p>BP: {item?.bloodPressure}</p>
                                        <p>Respiratory: {item?.respiratory}</p>
                                        {item?.oxygenSaturation && <p>O₂ Saturation: {item?.oxygenSaturation}%</p>}
                                        {item?.bloodSugar && <p>Blood Sugar: {item?.bloodSugar}</p>}
                                    </div>
                                </div>

                                {/* Diagnosis Section */}
                                <div className="section highlight">
                                    <h2>Diagnosis</h2>
                                    <p>{item?.diagnosis}</p>
                                </div>

                                {/* Care Plan */}
                                <div className="section">
                                    <h2>Doctor's Care Plan</h2>
                                    <p>{item?.carePlan || "None"}</p>
                                </div>

                                {/* Medication Details */}
                                <div className="section">
                                    <h2><FaCapsules className="icon" /> Medications</h2>
                                    {item?.drugName ? (
                                        <p><FaPills className="icon" /> {item?.drugName} - {item?.quantity} tab(s) x {item?.frequency} daily for {item?.duration} days</p>
                                    ) : (
                                        <p>No prescribed medications.</p>
                                    )}
                                    {item?.otherMedicationsQuantity > 0 && (
                                        <p>Additional Meds: {item?.otherMedicationsQuantity} tab(s) x {item?.otherMedicationsFrequency} daily for {item?.otherMedicationsDuration} days</p>
                                    )}
                                    <p className="note">{item?.pharmacistNote}</p>
                                </div>

                                {/* Admission Status */}
                                <p className={`status ${item?.isAdmitted ? "admitted" : "not-admitted"}`}>
                                    {item?.isAdmitted ? "Admitted" : "Not Admitted"}
                                </p>

                                {/* Close Button */}

                            </SwiperSlide>
                        ))}

                    </Swiper>

                    <div className="button-container">
                        <button className="close-button" onClick={closeModal}>Close</button>
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
