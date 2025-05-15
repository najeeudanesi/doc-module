import React, { useEffect, useState } from "react";
import "./AccordionPage.css";
import PatientDetails from "./PatientDetails";
import MedicalLog from "./Patient/MedicalLogs";
import FamilyConsultationReadOnly from "./Patient/FamilyConsultationReadOnly";
import AddNotes from "./Patient/AddNotes";
import BirthRecordForm from "./Patient/BirthRecordForm";
import Orthopedic from "./Patient/Orthopedic";
import Pediatrics from "./Patient/Pediatrics";
import GeneralSurgery from "./Patient/GeneralSurgery";
import { useParams } from "react-router-dom";
import { get } from "../../utility/fetch";

const Accordion = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);


  return (
    <div className="accordion-item">
      <div
        className={`accordion-header ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        <span className="arrow">{isOpen ? "▲" : "▼"}</span>
      </div>
      {isOpen && <div className="accordion-body">{children}</div>}
    </div>
  );
};

const PatientDetailsNew = () => {
  const [patient, setPatient] = useState(null);
  const { patientId, } = useParams();
  const getPatientDetails = async () => {
    // setLoading(true);
    try {
      const data = await get(`/patients/${patientId}/data`);
      setPatient(data);
      console.log(data);
      console.log(data?.id);

      // setVisit(data?.visits?.pop());
    } catch (e) {
      console.log(e);
    }
    // setLoading(false);
  };

  useEffect(() => {
    getPatientDetails();
  }, []);
  return (
    <div className="accordion-container">
      <h4>{patient?.firstName + " " + patient?.lastName}</h4>

      <Accordion title="Patient Information">
        <PatientDetails
          visibleTabs={[
            "personal",
            "contactDetails",
            "emergencyContact",
            "immunization",
            "appointments",
            'visits'
          ]}
        />
      </Accordion>

      <Accordion title="Specialty Clinic">
        {/* <Orthopedic /> */}
        {/* <BirthRecordForm /> */}

        <MedicalLog patient={patient} />
        {/* <Pediatrics/> */}
        {/* <GeneralSurgery/> */}
        {/*  <FamilyConsultationReadOnly />
        <AddNotes /> */}
      </Accordion>
    </div>
  );
};

export default PatientDetailsNew;
