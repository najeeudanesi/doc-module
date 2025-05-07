import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import { get } from "../../utility/fetch";
// import Treatments from "./Patient/Treatments";
import MedicalHistory from "../../modals/MedicalHistory";
import { get } from "../../../utility/fetch";
import Treatments from "./Treatments";
import { FiArrowLeft } from "react-icons/fi";
import GeneralPractice from "./GeneralPracticeTable";
import GeneralPracticeForm from "./GeneralPracticeForm";
// import MedicalHistory from "../../../../modals/MedicalHistory";

function PatientDetails() {
  const [selectedTab, setSelectedTab] = useState("personal");
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const { patientId } = useParams();
  const [visit, setVisit] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [id, setId] = useState(null);

  const navigate = useNavigate();

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

  //   const renderTabContent = () => {
  //     switch (selectedTab) {
  //       case "personal":
  //         return <Personal data={patient} />;
  //       case "contactDetails":
  //         return <ContactDetails data={patient?.contact} />;
  //       case "emergencyContact":
  //         return (
  //           <EmergencyContact
  //             data={patient?.emergencyContact}
  //             next={() => switchToTab("medicalRecord")}
  //           />
  //         );
  //       case "medicalRecord":
  //         return <MedicalRecord data={patient.medicalRecords} next={() => switchToTab("immunization")} fetchData={getPatientDetails} patientId={patientId} />;
  //       case "visits":
  //         return (
  //           <VisitTable
  //             patientId={patientId}
  //             next={() => switchToTab("treatment")}
  //           />
  //         );
  //       case "immunization":
  //         return <ImmunizationTable patientId={patientId} />;
  //       case "treatment":
  //         return <Treatments data={patient?.treatments} visit={visit || null} id={patientId} />;
  //       case "appointments":
  //         return (
  //           <AppointmentTable
  //             patientId={patientId}
  //             next={() => switchToTab("labs")}
  //           />
  //         )
  //       case "labs":
  //         return <Labs visit={visit} id={patientId} />;
  //       case "discounts":
  //         return <Discounts id={patientId} />;
  //       case "procedures":
  //         return <Procedure id={patientId} name={`${patient?.firstName} ${patient?.lastName}`} />;
  //       default:
  //         return null;
  //     }
  //   };

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
              <div class="flex m-t-80" style={{ padding: "20px" }}>
                <FiArrowLeft />
                <p onClick={() => navigate(-1)}> Back</p>
              </div>
              <div className=" flex space-between">
                <h1>{patient?.firstName + " " + patient?.lastName}</h1>
                {/* <button onClick={handlePatientId} className="btn">
                  View Medical History
                </button> */}
              </div>
              <div className="m-t-10">
                  <GeneralPracticeForm />
              </div>

             
              {/* <div className="w-100 p-x-20 m-t-10">
                {
                  <Treatments
                    data={patient?.treatments}
                    visit={visit || null}
                    id={patientId}
                  />
                }
              </div> */}

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
