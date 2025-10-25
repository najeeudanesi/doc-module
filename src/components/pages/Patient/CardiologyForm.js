import React, { useEffect, useState } from "react";
import "./FamilyConsultation.css";
import { get, post } from "../../../utility/fetch";
import { post as posts, get as gets } from "../../../utility/fetchLab";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import toast from "react-hot-toast";
import ReferPatient from "../../modals/ReferPatient";
import LabRequestTable from "./LabRequestTable";
import AddTreatmentOld from "../../modals/AddTreatmentOld";
import MedicationTable from "./MedicationTable";
import VitalsRecords from "../../modals/VitalsRecord";
import GhostTextCompletion from "../../UI/TextPrediction";
import moment from "moment";
import "../AccordionPage.css";

// import IVFConsultation from "./IVFConsultation";

const CardiologyForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const treatmentId = searchParams.get("treatmentId");
  const docInfo = JSON.parse(localStorage.getItem("USER_INFO"));
  const [repeatedDiagnosis, setRepeatedDiagnosis] = useState("");
  const [treatmentModal, setTreatmentModal] = useState(false);

  const { patientId } = useParams();
  const [records, setRecords] = useState({});
  const [surgeonList, setsurgeonList] = useState([]);
  const [anasList, setanasList] = useState([]);
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
  const [lastVisit, setLastVisit] = useState(null);

  const [newLab, setNewLab] = useState({ test: "", location: "" });
  const [newPrescription, setNewPrescription] = useState({
    name: "",
    quantity: "",
    freq: "",
    duration: "",
  });
  const [formData, setFormData] = useState({
    patientId: 0,
    history: "",
    diagnosis: "",
    procedure: {
      procedureType: "",
      deviceImplantType: "",
      vascularIntervention: "",
      procedureNote: {
        procedures: "",
        indications: "",
        guide: "",
        preUpMedication: "",
        parameters: "",
        impedence: "",
        threshold: "",
        lr: "",
        plan: "",
        fluroTime: "",
        complications: "",
        details: "",
      },
    },
    appointmentId: 0,
    doctorId: 0,
  });

  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split(".");

    if (keys?.length === 1) {
      setFormData({ ...formData, [name]: value });
    } else if (keys?.length === 2) {
      setFormData({
        ...formData,
        [keys[0]]: { ...formData[keys[0]], [keys[1]]: value },
      });
    } else if (keys?.length === 3) {
      setFormData({
        ...formData,
        [keys[0]]: {
          ...formData[keys[0]],
          [keys[1]]: {
            ...formData[keys[0]][keys[1]],
            [keys[2]]: value,
          },
        },
      });
    }
  };

  // const handleSubmits = (e) => {
  //   let payload = {
  //     ...formData,
  //     patientId: +patientId || 0, // include if applicable
  //     appointmentId: +localStorage.getItem("appointmentId"),
  //     doctorId: +docInfo.employeeId,

  //     procedure: {
  //       ...formData?.procedure,
  //       deviceImplantType: +formData?.procedure?.deviceImplantType,
  //       procedureType: +formData?.procedure?.procedureType,
  //       vascularIntervention: +formData?.procedure?.vascularIntervention,
  //       procedureNote: {
  //         ...formData?.procedureNote,

  //         fluroTime: `${moment(formData?.procedureNote?.fluroTime).format(
  //           "HH:mm:ss"
  //         )}:00`,
  //       },
  //     },
  //   };
  //   // e.preventDefault();
  //   console.log("Form submitted:", payload);
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const str = (v) => v ?? "";
    let payload = {
      ...formData,
      patientId: +patientId || 0, // include if applicable
      appointmentId: +localStorage.getItem("appointmentId"),
      doctorId: +docInfo.employeeId,
      patientComplaint: str(formData.patientComplaint),
      history: str(formData.history),
      diagnosis: str(formData.diagnosis),
      procedure: {
        ...formData?.procedure,
        deviceImplantType: +formData?.procedure?.deviceImplantType,
        procedureType: +formData?.procedure?.procedureType,
        vascularIntervention: +formData?.procedure?.vascularIntervention,
        procedureNote: {
          ...formData?.procedure?.procedureNote,
          fluroTime: moment(formData?.procedureNote?.fluroTime).format(
            "HH:mm:ss"
          ),
        },
      },
    };
    console.log("Payload:", payload);
    // ...then call your API

    // return;

    try {
      const response = await post("/Cardiology", payload);
      if (response.isSuccess) {
        navigate(
          `/doctor/patients/cardiology/${patientId}/?treatmentId=${response?.data?.cardiologyId}`
        );
        // http://localhost:3003/doctor/patients/cardiology/100/?treatmentId=11
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
      const response = await get(`/cardiology/${treatmentId}`);
      if (response.isSuccess) {
        console.log(response.data);
        setFormData({
          ...formData,
          patientId: response?.data?.patient.id,
          history: response?.data?.history,
          diagnosis: response?.data?.diagnosis,
          procedure: response?.data?.procedure,
          patientComplaint: (response?.data?.patientComplaint),

          appointmentId: response?.data?.appointmentId,
          doctorId: response?.data?.doctor.id,
        });
      }
    } catch (error) {
      console.error("Submission failed:", error);
    }
    // https://edogoverp.com/medicals/api/OG_BirthRecord/list/1/10
  };

  useEffect(() => {
    // if (patientId) fetchSurgeonRecord();
    if (treatmentId) {
      fetchVisit();
      fetcLabhData(treatmentId);
      getRecord();
    }
    fetchTreatmentVitalsRecord();

    console.log(formData);
  }, [patientId]);

  const toggleModal = () => {
    if (lastVisit === null) {
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
        `/patients/list/cardiology/${treatmentId}/1/10/lab-request`
      );
      setDataFromLab(response?.data?.resultList);
      console.log(response.resultList);
      // response.data && setRepeatedDiagnosis(response.data[0]?.diagnosis);
    } catch (e) {
      console.log(e);
      setDataFromLab([]);
    }
    // setIsLoading(false);
  };

  const toggleTreatmentModal = () => {
    if (lastVisit === null) {
      // alert("");

      toast("A visit has to exist before you can add treatment");
      return;
    }
    setTreatmentModal(!treatmentModal);
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
      generalPracticeId: 0,
      antenatalId: 0,
      cardiologyId: +treatmentId || 0,
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
    <div className="w-100 m-t-40">
      <div className="w-100 m-t-40"></div>
      <div className="flex-between align-center w-70">
        <div className="flex" style={{ padding: "20px", cursor: "pointer" }}>
          <FiArrowLeft />
          <p
            onClick={() =>
              navigate(`/doctor/patients/patient-details/${patientId}`)
            }
          >
            {" "}
            Back
          </p>
        </div>
        <div className=""></div>
        {treatmentId && (
          <div className="flex-row-gap">
            <button className="rounded-btn" onClick={toggleModal}>
              + Refer Patient To Lab
            </button>
            <button className="rounded-btn" onClick={toggleTreatmentModal}>
              + Add Treatment
            </button>
          </div>
        )}
      </div>
      <div className="flex-row-gap-start w-100 m-t-10">
        <div className="section-box w-100">
          <h2 style={{ textAlign: "center" }} className="w-100">
            Cardiology
          </h2>

          <main className="w-70 m-t-20">
            <Accordion title="Examination">
              {treatmentId ? (
                 <div className="field-column new">
                  <label>Patient Complaint</label>
                  <textarea
                    name="patientComplaint"
                    value={formData.patientComplaint || ""}
                    onChange={handleChange}
                    rows={6}
                  ></textarea>
                </div>
               
              ) : (
               <div className="field-column new">
                  <label>Patient Complaint</label>
                  <GhostTextCompletion
                    name="patientComplaint"
                    value={formData.patientComplaint || ""}
                    handleChange={handleChange}
                    none={true}
                  />
                </div>
              )}

              <div>
                {treatmentId ? (
                  <div className="field-column new">
                    <label>History</label>
                    <textarea
                      name="history"
                      onChange={handleChange}
                      rows={6}
                      value={formData.history || ""}
                    ></textarea>
                  </div>
                ) : (
                  <div className="field-column new">
                    <label>History</label>
                    <GhostTextCompletion
                      name="history"
                      value={formData.history || ""}
                      handleChange={handleChange}
                      none={true}
                    />
                  </div>
                )}
              </div>
              <div>
                {treatmentId ? (
                  <div className="field-column new">
                    <label>Diagnosis</label>
                    <textarea
                      name="diagnosis"
                      onChange={handleChange}
                      rows={6}
                      value={formData.diagnosis || ""}
                    ></textarea>
                  </div>
                ) : (
                  <div className="field-column new">
                    <label>Diagnosis</label>
                    <GhostTextCompletion
                      name="diagnosis"
                      value={formData.diagnosis || ""}
                      handleChange={handleChange}
                      none={true}
                    />
                  </div>
                )}
              </div>
            </Accordion>
            <div
              style={{
                width: "100%",
                margin: "30px 10px",
              }}
            >
              <Accordion title="Procedures">
                <div className="form-grid">
                  <div className="field-column">
                    <label>Procedure Type</label>
                    <select
                      name="procedure.procedureType"
                      value={formData?.procedure?.procedureType}
                      onChange={handleChange}
                    >
                      <option value="">Select</option>
                      <option value="1">
                        Cardiac catheterization & Angiogram
                      </option>
                      <option value="2">Peripheral Aniogram</option>
                      <option value="3">Vascular Intervention</option>
                      <option value="4">Device Implant</option>
                    </select>
                  </div>
                  {formData?.procedure?.procedureType == 3 && (
                    <div className="field-column">
                      <label>Vascular Intervention</label>
                      <select
                        name="procedure.vascularIntervention"
                        value={formData?.procedure?.vascularIntervention}
                        onChange={handleChange}
                      >
                        <option value="">Select</option>
                        <option value="1">Cardiac</option>
                        <option value="2">Peripheral</option>
                      </select>
                    </div>
                  )}
                  {formData?.procedure?.procedureType == 4 && (
                    <div className="field-column">
                      <label>Device Implant Type</label>
                      <select
                        name="procedure.deviceImplantType"
                        value={formData?.procedure?.deviceImplantType}
                        onChange={handleChange}
                      >
                        <option value="">Select</option>
                        <option value="1">Defibrillator</option>
                        <option value="2">ACID,CRTP, CRTD, PEACEMAKER</option>
                        <option value="3">VENOUS ABLATOR</option>
                        <option value="4">CENTRAL LINE</option>
                        <option value="5">Others</option>
                      </select>
                    </div>
                  )}
                </div>
                <h2
                  style={{
                    textAlign: "center",
                    width: "100%",
                    margin: "30px 10px",
                  }}
                >
                  Procedure Notes
                </h2>
                <div className="form-grid">
                  <div>
                    <label>Procedures</label>
                    <input
                      type="text"
                      name="procedure.procedureNote.procedures"
                      value={formData?.procedure?.procedureNote?.procedures}
                      onChange={handleChange}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label>Indications</label>
                    <input
                      type="text"
                      name="procedure.procedureNote.indications"
                      value={formData?.procedure?.procedureNote?.indications}
                      onChange={handleChange}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label>Guide</label>
                    <input
                      type="text"
                      name="procedure.procedureNote.guide"
                      value={formData?.procedure?.procedureNote?.guide}
                      onChange={handleChange}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label>Pre-up Medication</label>
                    <input
                      type="text"
                      name="procedure.procedureNote.preUpMedication"
                      value={
                        formData?.procedure?.procedureNote?.preUpMedication
                      }
                      onChange={handleChange}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label>Parameters</label>
                    <input
                      type="text"
                      name="procedure.procedureNote.parameters"
                      value={formData?.procedure?.procedureNote?.parameters}
                      onChange={handleChange}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label>Impedance</label>
                    <input
                      type="text"
                      name="procedure.procedureNote.impedence"
                      value={formData?.procedure?.procedureNote?.impedence}
                      onChange={handleChange}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label>Threshold</label>
                    <input
                      type="text"
                      name="procedure.procedureNote.threshold"
                      value={formData?.procedure?.procedureNote?.threshold}
                      onChange={handleChange}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label>LR</label>
                    <input
                      type="text"
                      name="procedure.procedureNote.lr"
                      value={formData?.procedure?.procedureNote?.lr}
                      onChange={handleChange}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label>Plan</label>
                    <input
                      type="text"
                      name="procedure.procedureNote.plan"
                      value={formData?.procedure?.procedureNote?.plan}
                      onChange={handleChange}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label>Fluro Time</label>
                    <input
                      type="time"
                      name="procedure.procedureNote.fluroTime"
                      value={formData?.procedure?.procedureNote.fluroTime}
                      onChange={handleChange}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label>Complications</label>
                    <input
                      type="text"
                      name="procedure.procedureNote.complications"
                      value={formData?.procedure?.procedureNote?.complications}
                      onChange={handleChange}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label>Details</label>
                    <input
                      type="text"
                      name="procedure.procedureNote.details"
                      value={formData?.procedure?.procedureNote?.details}
                      onChange={handleChange}
                      className="input-field"
                    />
                  </div>
                </div>
              </Accordion>

              {!treatmentId && (
                <div className="full-width">
                  <button onClick={handleSubmit} className="submit-btn">
                    Submit Record
                  </button>
                </div>
              )}
            </div>
          </main>
        </div>
        <VitalsRecords vitals={vitals} />
      </div>

      {dataFromLab?.length > 0 && (
        <LabRequestTable
          data={dataFromLab}
          isFamily={"Cardiology"}
          treatmentId={treatmentId}
        />
      )}

      {treatmentId && (
        <MedicationTable
          data={{
            treatmentType: "cardiology",
            treatmentId: treatmentId,
          }}
        />
      )}

      {treatmentModal && (
        <AddTreatmentOld
          createTreatment={createTreatmet}
          repeatedDiagnosis={repeatedDiagnosis}
          setRepeatedDiagnosis={setRepeatedDiagnosis}
          closeModal={toggleTreatmentModal}
          visit={lastVisit}
          id={patientId}
        />
      )}
      {showModal && (
        <ReferPatient
          repeatedDiagnosis={repeatedDiagnosis}
          setRepeatedDiagnosis={setRepeatedDiagnosis}
          closeModal={toggleModal}
          visit={lastVisit}
          vital={vitals}
          cardiologyId={+treatmentId || 0}
          id={patientId}
        />
      )}
    </div>
  );
};

export default CardiologyForm;

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
