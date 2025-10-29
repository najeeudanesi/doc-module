import React, { useEffect, useState } from "react";
import "./FamilyConsultation.css";
import { get, post } from "../../../utility/fetch";
import { post as posts, get as gets } from "../../../utility/fetchLab";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import toast from "react-hot-toast";
import ReferPatient from "../../modals/ReferPatient";
import ReferPatientToSpecialist from "../../modals/ReferPatientToSpecialist";
import LabRequestTable from "./LabRequestTable";
import AddTreatmentOld from "../../modals/AddTreatmentOld";
import MedicationTable from "./MedicationTable";
import VitalsRecords from "../../modals/VitalsRecord";
import GhostTextCompletion from "../../UI/TextPrediction";
import DetailedNurseNotes from "../../modals/DetailedNurseNotes";

// import IVFConsultation from "./IVFConsultation";

const GeneralPracticeForm = ({ patient }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const treatmentId = searchParams.get("treatmentId");
  const docInfo = JSON.parse(localStorage.getItem("USER_INFO"));
  const [formData, setFormData] = useState({});
  const [repeatedDiagnosis, setRepeatedDiagnosis] = useState("");
  const [treatmentModal, setTreatmentModal] = useState(false);

  const { patientId } = useParams();
  const [detailedNurseModal, setDetailedNurseModal] = useState(false);
  const [surgeonList, setsurgeonList] = useState([]);
  const [newData, setNewData] = useState([]);
  const [displaydoc, setDisplayDocuments] = useState({});
  const [displaydocPelvic, setDisplayDocumentsPelvic] = useState({});
  const [
    displaydocPelvicInvestigation,
    setDisplayDocumentsPelvicInvestigation,
  ] = useState({});
  const [displaydocAfm, setDisplayDocumentsAfm] = useState({});

  const [loading, setLoading] = useState(true);
  const [surgicalOpList, setsurgicalOpList] = useState([]);
  const [anasOPList, setanasOPList] = useState([]);
  const [carePlan, setcarePlan] = useState("");

  const [vitals, setvitals] = useState();
  const [dataFromLab, setDataFromLab] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showSpecialistModal, setShowSpecialistModal] = useState(false);
  const [lastVisit, setLastVisit] = useState(null);

  const [newLab, setNewLab] = useState({ test: "", location: "" });
  const [newPrescription, setNewPrescription] = useState({
    name: "",
    quantity: "",
    freq: "",
    duration: "",
  });

  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e) => {
    // e.preventDefault();

    const payload = {
      patientId: +patientId || 0, // include if applicable
      title: "",
      patientComplaint: formData.patientComplaint,
      details: formData.details,
      history: formData.history,
      diagnosis: formData.diagnosis,
      physicalExamination: formData.physicalExamination,
      investigation: formData.investigation,
      appointmentId: +localStorage.getItem("appointmentId"),
      doctorId: +docInfo.employeeId,
    };

    console.log("Payload:", payload);
    // ...then call your API
    // return;
    try {
      const response = await post("/GeneralPractice", payload);
      if (response.isSuccess) {
        navigate(
          `/doctor/patients/general-practice/${patientId}/?treatmentId=${response?.data?.generalPracticeId}`
        );
        fetchVisit();

        // navigate(`/doctor/patients/patient-details/${patientId}`);
      }
      console.log("API Response:", response);
    } catch (error) {
      console.error("Submission failed:", error);
    }

    console.log(payload); // check your payload structure
    // alert("Appointment created!");
  };

  const getRecord = async () => {
    try {
      const response = await get(`/GeneralPractice/${treatmentId}`);
      if (response.isSuccess) {
        console.log(response.data);
        setFormData({
          ...response.data,
          patientId: response.data?.patient?.id || 0,
          title: response.data?.title,
          details: response.data?.details,
          history: response.data?.history,
          physicalExamination: response.data?.physicalExamination,
          investigation: response.data?.investigation,
          appointmentId: response.data?.appointmentId || 0,
        });

        setDetailedNurseModal(false);

        // const mappedData = mapResponseToFormData(response.data);
        // setFormData(mappedData);
        // setBirthRecords(
        //   response.data.recordList?.find((e) => e.patient.id == patientId)
        // );
        // navigate(`/doctor/patients/patient-details/${patientId}`);
      }
    } catch (error) {
      console.error("Submission failed:", error);
    }
    // https://edogoverp.com/medicals/api/OG_BirthRecord/list/1/10
  };
 const handleSubmitSpecialist = async (e) => {
    // e.preventDefault();

    const payload = {
      patientId: +patientId || 0, // include if applicable
      title: "",
      patientComplaint: formData.patientComplaint,
      details: formData.details,
      history: formData.history,
      diagnosis: formData.diagnosis,
      physicalExamination: formData.physicalExamination,
      investigation: formData.investigation,
      appointmentId: +localStorage.getItem("appointmentId"),
      doctorId: +docInfo.employeeId,
      specialistId: 23,
    };

    console.log("Payload:", payload);
    // ...then call your API
    // return;
    try {
      const response = await post("/SpecialistExaminations", payload);
      console.log(response);
      return;
      if (response.isSuccess) {
        navigate(
          `/doctor/patients/general-practice/${patientId}/?treatmentId=${response?.data?.generalPracticeId}`
        );
        fetchVisit();

        // navigate(`/doctor/patients/patient-details/${patientId}`);
      }
      console.log("API Response:", response);
    } catch (error) {
      console.error("Submission failed:", error);
    }

    console.log(payload); // check your payload structure
    // alert("Appointment created!");
  };

  useEffect(() => {
    // if (patientId) fetchSurgeonRecord();
    if (treatmentId) {
      fetchVisit();
      fetcLabhData(treatmentId);
    }
    fetchTreatmentVitalsRecord();

    getRecord();
    // getSpecialist()

    console.log(formData);
  }, [patientId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };
  const toggleModal = () => {
    console.log(lastVisit);
    if (lastVisit.id === null|| lastVisit.id === undefined|| lastVisit.id === 0||!lastVisit.id) {
      toast("A visit has to exist before you can refer patient");
      return;
    }
    setShowModal(!showModal);
  };

  const fetchVisit = async () => {
    // setIsLoading(true);
    try {
      const response = await get(
        `/appointment/get-appointment-bypatientId/${patientId}/`
      );
      setLastVisit(response.data[response?.data?.length - 1]);
    } catch (e) {
      console.log(e);
    }
    // setIsLoading(false);
  };
  const fetchTreatmentVitalsRecord = async () => {
    setLoading(true);
    try {
      const response = await get(
        `/patients/vital-by-appointmentId?appointmentId=${+localStorage.getItem(
          "appointmentId"
        )}&pageIndex=1&pageSize=10`
      );
      if (true) {
        setvitals(response.data);
        console.log(response.data);
        // console.log(response.data.recordList[0] || {});
        // setDiagnosis(response.data.recordList[0].diagnosis || 89);
        // setCarePlan(response.data.recordList[0].carePlan || 89);
        // setAdditionalNotes(response.data.recordList[0].additionalNotes || 89);

        // setFormData({
        //   ...response.data.recordList[0],
        // });
        // console.log({
        //   ...response.data.recordList[0],
        // });
      }
    } catch (error) {
      console.error("Failed to fetch record:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetcLabhData = async (treatmentId) => {
    // setIsLoading(true);
    try {
      const response = await get(
        `/lab/list/generalPractice/${treatmentId}/1/10/lab-request`
      );
      setDataFromLab(response?.data?.resultList);
      console.log(response.data?.resultList);
      // response.data && setRepeatedDiagnosis(response.data[0]?.diagnosis);
    } catch (e) {
      console.log(e);
      setDataFromLab([]);
    }
    // setIsLoading(false);
  };
  const parentMeds = (data) => {
    console.log(data);
    setNewData(data);
  };
  const toggleSpecialistModal = () => {
    if (lastVisit === null) {
      toast("A visit has to exist before you can refer patient");
      return;
    }
    setShowSpecialistModal(!showSpecialistModal);
  };
  const toggleTreatmentModal = () => {
    if (lastVisit === null) {
      alert("");

      toast("A visit has to exist before you can add treatment");
      return;
    }
    setTreatmentModal(!treatmentModal);
  };

  const toggleDetailedNurseModal = () => {
    if (lastVisit === null) {
      alert("");

      toast("A visit has to exist before you can add treatment");
      return;
    }
    setDetailedNurseModal(!detailedNurseModal);
  };

  const createTreatmet = async (load) => {
    let payload = {
      dateOfVisit: "2025-05-01T05:09:59.302Z",
      appointmentId: +localStorage.getItem("appointmentId"),
      diagnosis: "string",
      isAdmitted: false,
      patientId: +patientId,
      medications: [
        {
          pharmacyInventoryId: 1,
          quantity: 1,
          frequency: 2,
          duration: 0,
        },
      ],
      otherMedications: [
        {
          name: "fhhkjkkkhk",
          quantity: 0,
          frequency: 0,
          duration: 0,
        },
      ],
      followUpAppointment: {
        id: 0,
        appointDate: "1920/09/1",
        appointTime: "23:09",
        description: "string",
        doctorEmployeeId: 0,
        nurseEmployeeId: 0,
        isAdmitted: true,
        patientId: 0,
        serviceId: 0,
        isEmergency: true,
        careType: 0,
      },
      carePlan: "string",
      familyMedicineId: 0,
      oG_IVFId: 0,
      oG_BirthRecordId: 0,
      orthopedicId: 0,
      generalSurgeryId: 0,
      pediatricId: 0,
      generalPracticeId: +treatmentId || 0,
      antenatalId: 0,
      ...load,
    };

    console.log(payload);
    // return

    try {
      await post(`/ServiceTreatment`, payload);
      // await fetchData();
      toast.success("Treatment added successfully");
      // closeModal();
      toggleTreatmentModal();
    } catch (error) {
      toast.error("Error adding treatment");
      console.log(error);
    }
  };
  return (
    <div className="w-100">
      <div class="flex-between align-center w-70">
        <div class="flex" style={{ padding: "20px", cursor: "pointer" }}>
          <FiArrowLeft />
          <p onClick={() => navigate(-1)}> Back</p>
        </div>
        <div className=""></div>
        {treatmentId && (
          <div class="flex-row-gap">
            <button className="rounded-btn" onClick={toggleModal}>
              + Refer Patient To Lab
            </button>
            {newData.length < 1 ? (
              <button className="rounded-btn" onClick={toggleTreatmentModal}>
                + Add Treatment
              </button>
            ) : (
              <button
                className="rounded-btn"
                onClick={toggleDetailedNurseModal}
              >
                + Add additional Medication
              </button>
            )}
            <button className="rounded-btn" onClick={toggleSpecialistModal}>
              + Refer Patient To Specialist
            </button>
          </div>
        )}
      </div>
      <div class="flex-row-gap-start w-100 m-t-10">
        <div class="section-box w-100">
          <h2 style={{ textAlign: "center" }} className="w-100">
            General Practice
          </h2>

          <main className="w-70 m-t-20">
            <section className="">
              <div className="section-box flex-col-gap">
                <div className="field-column">
                  <label>Patient Complaint</label>
                  {!treatmentId ? (
                    <GhostTextCompletion
                      // label="Patient Diagnosis"
                      name="patientComplaint"
                      value={formData.patientComplaint || ""}
                      handleChange={handleChange}
                      none={true}
                    />
                  ) : (
                    <textarea
                      name="patientComplaint"
                      onChange={handleChange}
                      // className="input-field"
                      rows={2}
                      value={formData.patientComplaint}
                    />
                  )}
                </div>
                {/* <div className="field-column">
                  <label>Patient Complaint</label>
                  <textarea
                    name="patientComplaint"
                    placeholder="Patient"
                    value={formData.patientComplaint}
                    handleChange={handleChange}
                    rows={3}
                  />
                </div> */}
                <div className="field-column">
                  <label>History</label>
                  {!treatmentId ? (
                    <GhostTextCompletion
                      // label="Patient Diagnosis"
                      name="history"
                      value={formData.history || ""}
                      handleChange={handleChange}
                      none={true}
                    />
                  ) : (
                    <textarea
                      name="history"
                      onChange={handleChange}
                      rows={8}
                      value={formData.history}
                    />
                  )}
                </div>
                <div className="field-column">
                  <label>Physical Examination</label>
                  {!treatmentId ? (
                    <GhostTextCompletion
                      // label="Patient Diagnosis"
                      name="physicalExamination"
                      value={formData.physicalExamination || ""}
                      handleChange={handleChange}
                      none={true}
                    />
                  ) : (
                    <textarea
                      name="physicalExamination"
                      onChange={handleChange}
                      rows={8}
                      value={formData.physicalExamination}
                    />
                  )}
                </div>
                <div className="field-column">
                  <label>Diagnosis</label>
                  {!treatmentId ? (
                    <GhostTextCompletion
                      // label="Patient Diagnosis"
                      name="diagnosis"
                      value={formData.diagnosis || ""}
                      handleChange={handleChange}
                      none={true}
                    />
                  ) : (
                    <textarea
                      name="diagnosis"
                      onChange={handleChange}
                      rows={8}
                      value={formData.diagnosis}
                    />
                  )}
                </div>
                <div className="field-column">
                  <label>Investigation</label>
                  {!treatmentId ? (
                    <GhostTextCompletion
                      // label="Patient Diagnosis"
                      name="investigation"
                      value={formData.investigation || ""}
                      handleChange={handleChange}
                      none={true}
                    />
                  ) : (
                    <textarea
                      name="investigation"
                      onChange={handleChange}
                      rows={8}
                      value={formData.investigation}
                    />
                  )}
                </div>

                {/* <div className="field-column">
                  <label>Surgeon Signature</label>
                  <textarea
                    value={formData.surgeonSignature || ""}
                    name="surgeonSignature"
                    onChange={handleChange}
                    className="input-field"
                    rows={3}
                  />
                </div> */}
              </div>
              <h2 style={{ marginTop: "40px", marginBottom: "20px" }}>
                Lab Reports{" "}
              </h2>
              {treatmentId && dataFromLab?.length > 0 ? (
                <div className="field-column">
                  <label>Patient's Lab Results</label>
                  <LabRequestTable
                    data={dataFromLab}
                    isFamily={"OG_IVF"}
                    treatmentId={treatmentId}
                  />
                </div>
              ) : (
                <p>No lab records</p>
              )}
              <h2 style={{ marginTop: "40px", marginBottom: "20px" }}>
                Treatments{" "}
              </h2>
              {treatmentId && (
                <MedicationTable
                  parentMeds={parentMeds}
                  data={{
                    treatmentType: "GeneralPractice",
                    treatmentId: treatmentId,
                  }}
                />
              )}
              {!treatmentId && (
                <button onClick={handleSubmit} className="submit-btn">
                  Submit
                </button>
              )}
            </section>
          </main>
        </div>
        <VitalsRecords vitals={vitals} />
      </div>
      {treatmentModal && (
        <AddTreatmentOld
          createTreatment={createTreatmet}
          repeatedDiagnosis={repeatedDiagnosis}
          setRepeatedDiagnosis={setRepeatedDiagnosis}
          closeModal={toggleTreatmentModal}
          visit={lastVisit}
          // data={data}
          id={patientId}
          // fetchData={fetchData}
        />
      )}
      {showModal && (
        <ReferPatient
          repeatedDiagnosis={repeatedDiagnosis}
          setRepeatedDiagnosis={setRepeatedDiagnosis}
          closeModal={toggleModal}
          visit={lastVisit}
          vital={vitals}
          generalPractice={+treatmentId || 0}
          // vitalId = {vitals.id}
          id={patientId}
          // treatment={data[0] || null}
        />
      )}
      {showSpecialistModal && (
        <ReferPatientToSpecialist
          patient={patient}
          closeModal={toggleSpecialistModal}
          id={patientId}
          userId={docInfo?.employeeId || 0}
          clinicId={lastVisit?.clinicId || 0}
        />
      )}

      {detailedNurseModal && (
        <DetailedNurseNotes
          closeModal={toggleDetailedNurseModal}
          getAllAdmittedPatients={getRecord}
          treatment={newData[0]}
          patientId={patientId}
        />
      )}
    </div>
  );
};

export default GeneralPracticeForm;
