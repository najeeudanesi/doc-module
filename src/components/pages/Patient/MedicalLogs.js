import React, { useState, useEffect } from "react";
import "./ConsultationLog.css";
import { FaPlus, FaRegNoteSticky } from "react-icons/fa6";
import { FiEdit } from "react-icons/fi";
import FamilyConsultation from "./FamilyConsultation";
import AddNotes from "./AddNotes";
import FamilyConsultationReadOnly from "./FamilyConsultationReadOnly";
import FamilyMedicineTable from "./FamilyMedicineTable";
import { get } from "../../../utility/fetch";
import BirthRecordForm from "./BirthRecordForm";
import IVFConsultationTable from "./IVFConsultationTable";
import OrthopedicTable from "./OrthopedicTable";
import GeneralSurgery from "./GeneralSurgery";
import GeneralSurgeryTable from "./GeneralSurgeryTable";
import GeneralPractice from "./GeneralPracticeTable";
import AntinatalTable from "./AntinatalTable";

const MedicalLog = ({ patient }) => {
  const [selectedSection, setSelectedSection] = useState("familymedcine");
  // const [patient, setPatient] = useState(null);
  const [visit, setVisit] = useState(null);
  const [loading, setLoading] = useState(false);

  //   const getPatientDetails = async () => {
  //     setLoading(true);
  //     try {
  //       const data = await get(`/FamilyMedicine/list/1/10`);
  //       setPatient(data);
  //       console.log(data);
  //       console.log(data?.id);
  //       setVisit(data?.visits?.pop());
  //     } catch (e) {
  //       console.log(e);
  //     }
  //     setLoading(false);
  //   };

  //   useEffect(() => {
  //     getPatientDetails();
  //   }, []);

  const logs = [
    {
      date: "02.04.2025",
      type: "Case Note",
      history: "Family Planning Consultation Analysis",
      doctor: "Dr. Williams Humphrey",
    },
    {
      date: "02.04.2025",
      type: "Follow-up Consultation",
      history: "Family Planning Consultation Analysis",
      doctor: "Dr. Williams Humphrey",
    },
  ];

  const renderComponent = () => {
    switch (selectedSection) {
      case "familymedcine":
        return <FamilyMedicineTable patient={patient} />;
      case "birthrecord":
        return <BirthRecordForm patient={patient} />;
      case "ivf":
        return <IVFConsultationTable patient={patient} />;
      case "Orthopedic":
        return <OrthopedicTable patient={patient} />;
      case "generalsurgery":
        return <GeneralSurgeryTable patient={patient} />;
        case "atenatal":
          return <AntinatalTable patient={patient} />;
        case "generalPractie":
          return <GeneralPractice patient={patient} />;

      default:
        return <div>Select a section</div>;
    }
  };

  const sections = [
    { key: "familymedcine", label: "Family Planning" },
    { key: "ivf", label: "O&G IVF" },
    // { key: "birthrecord", label: "O&G Birth Record" },
    { key: "Orthopedic", label: "Orthopedic" },
    { key: "atenatal", label: " O&G Antenatal/Post-natal" },
    { key: "generalsurgery", label: "General Surgery" },
    { key: "generalPractie", label: "General Practice" },
    // { key: "pediatrics", label: "Pediatrics" },
    
  ];

  return (
    <div className="consultation-page">
      <div className="sidebar">
        <ul>
          {sections.map((section) => (
            <li
              key={section.key}
              className={selectedSection === section.key ? "active" : ""}
              onClick={() => setSelectedSection(section.key)}
            >
              {section.label}
            </li>
          ))}
        </ul>
      </div>
      <div className="">
        {loading ? <p>Loading patient details...</p> : renderComponent()}
      </div>
    </div>
  );
};

export default MedicalLog;
