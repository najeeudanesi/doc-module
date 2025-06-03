import React, { useEffect, useState } from "react";
import Personal from "./Patient/Personal";
import ContactDetails from "./Patient/ContactDetails";
import EmergencyContact from "./Patient/EmergencyContact";
import MedicalRecord from "./Patient/MedicalRecord";
import { useParams } from "react-router-dom";
import { get } from "../../utility/fetch";
import VisitTable from "../tables/VisitTable";
import ImmunizationTable from "../tables/ImmunizationTable";
import Treatments from "./Patient/Treatments";
import Labs from "./Patient/Labs";
import AppointmentTable from "../tables/AppointmentTable";
import MedicalHistory from "../modals/MedicalHistory";
import Discounts from "./Patient/Discounts";
import Procedure from "./Patient/Procedures";

function PatientDetails({ visibleTabs = [] }) {
  const [selectedTab, setSelectedTab] = useState("personal");
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const { patientId } = useParams();
  const [visit, setVisit] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [id, setId] = useState(null);

  const switchToTab = (tab) => {
    setSelectedTab(tab);
  };

  const getPatientDetails = async () => {
    setLoading(true);
    try {
      const data = await get(`/patients/${patientId}/data`);
      setPatient(data);
      console.log(data);
      console.log(data?.id);

      setVisit(data?.visits?.pop());
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    getPatientDetails();
  }, []);

  const renderTabContent = () => {
    switch (selectedTab) {
      case "personal":
        return <Personal data={patient} />;
      case "contactDetails":
        return <ContactDetails data={patient?.contact} />;
      case "emergencyContact":
        return (
          <EmergencyContact
            data={patient?.emergencyContact}
            next={() => switchToTab("medicalRecord")}
          />
        );
      case "medicalRecord":
        return (
          <MedicalRecord
            data={patient.medicalRecords}
            next={() => switchToTab("immunization")}
            fetchData={getPatientDetails}
            patientId={patientId}
          />
        );
      case "visits":
        return (
          <VisitTable
            patientId={patientId}
            next={() => switchToTab("treatment")}
          />
        );
      case "immunization":
        return <ImmunizationTable patientId={patientId} />;
      case "treatment":
        return (
          <Treatments
            data={patient?.treatments}
            visit={visit || null}
            id={patientId}
          />
        );
      case "appointments":
        return (
          <AppointmentTable
            patientId={patientId}
            next={() => switchToTab("labs")}
          />
        );
      case "labs":
        return <Labs visit={visit} id={patientId} />;
      case "discounts":
        return <Discounts id={patientId} />;
      case "procedures":
        return (
          <Procedure
            id={patientId}
            name={`${patient?.firstName} ${patient?.lastName}`}
          />
        );
      default:
        return null;
    }
  };

  const handlePatientId = () => {
    console.log(patientId);
    setId(patientId);
    setShowHistory(true);
  };

  return (
    <div className="w-100">
      {loading ? (
        <div className="m-t-40">
          <h1>Loading......</h1>
        </div>
      ) : (
        <>
          {patient ? (
            <>
              <div className=" flex space-between">
                <h1>{patient?.firstName + " " + patient?.lastName}</h1>
                <button onClick={handlePatientId} className="btn">
                  View Medical History
                </button>
              </div>

              <div className="tabs flex space-between m-t-20 bold-text w-100">
                {visibleTabs.includes("personal") && (
                  <div
                    className={`tab-item ${
                      selectedTab === "personal" ? "active" : ""
                    }`}
                    onClick={() => switchToTab("personal")}
                  >
                    Personal
                  </div>
                )}
                {visibleTabs.includes("contactDetails") && (
                  <div
                    className={`tab-item ${
                      selectedTab === "contactDetails" ? "active" : ""
                    }`}
                    onClick={() => switchToTab("contactDetails")}
                  >
                    Contact Details
                  </div>
                )}
                {visibleTabs.includes("emergencyContact") && (
                  <div
                    className={`tab-item ${
                      selectedTab === "emergencyContact" ? "active" : ""
                    }`}
                    onClick={() => switchToTab("emergencyContact")}
                  >
                    Emergency Contact
                  </div>
                )}
                {visibleTabs.includes("medicalRecord") && (
                  <div
                    className={`tab-item ${
                      selectedTab === "medicalRecord" ? "active" : ""
                    }`}
                    onClick={() => switchToTab("medicalRecord")}
                  >
                    Medical Record
                  </div>
                )}
                {visibleTabs.includes("immunization") && (
                  <div
                    className={`tab-item ${
                      selectedTab === "immunization" ? "active" : ""
                    }`}
                    onClick={() => switchToTab("immunization")}
                  >
                    Immunization
                  </div>
                )}
                {visibleTabs.includes("visits") && (
                  <div
                    className={`tab-item ${
                      selectedTab === "visits" ? "active" : ""
                    }`}
                    onClick={() => switchToTab("visits")}
                  >
                    Vitals
                  </div>
                )}
                {visibleTabs.includes("treatment") && (
                  <div
                    className={`tab-item ${
                      selectedTab === "treatment" ? "active" : ""
                    }`}
                    onClick={() => switchToTab("treatment")}
                  >
                    Treatment
                  </div>
                )}
                {visibleTabs.includes("appointments") && (
                  <div
                    className={`tab-item ${
                      selectedTab === "appointments" ? "active" : ""
                    }`}
                    onClick={() => switchToTab("appointments")}
                  >
                    Appointments
                  </div>
                )}
                {visibleTabs.includes("labs") && (
                  <div
                    className={`tab-item ${
                      selectedTab === "labs" ? "active" : ""
                    }`}
                    onClick={() => switchToTab("labs")}
                  >
                    Labs
                  </div>
                )}
                {visibleTabs.includes("procedures") && (
                  <div
                    className={`tab-item ${
                      selectedTab === "procedures" ? "active" : ""
                    }`}
                    onClick={() => switchToTab("procedures")}
                  >
                    Procedures
                  </div>
                )}
                {visibleTabs.includes("discounts") && (
                  <div
                    className={`tab-item ${
                      selectedTab === "discounts" ? "active" : ""
                    }`}
                    onClick={() => switchToTab("discounts")}
                  >
                    Discounts
                  </div>
                )}
              </div>
              <div className="w-100 p-x-20">{renderTabContent()}</div>
            </>
          ) : (
            <div className="m-t-40 bold-text p-40">
              <h1>Patient not found</h1>
            </div>
          )}
        </>
      )}

      {showHistory && (
        <MedicalHistory
          patientId={id}
          closeModal={() => setShowHistory(false)}
        />
      )}
    </div>
  );
}

export default PatientDetails;
