import React, { useEffect, useState } from "react";
import "./FamilyConsultation.css";
import { get, post } from "../../../utility/fetch";
import { post as posts, get as gets } from "../../../utility/fetchLab";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import ReferPatient from "../../modals/ReferPatient";
import toast from "react-hot-toast";
import LabRequestTable from "./LabRequestTable";
import AddTreatmentOld from "../../modals/AddTreatmentOld";
import MedicationTable from "./MedicationTable";
import VitalsRecords from "../../modals/VitalsRecord";
import GhostTextCompletion from "../../UI/TextPrediction";

// import IVFConsultation from "./IVFConsultation";

const Orthopedic = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const treatmentId = searchParams.get("id");
  const docInfo = JSON.parse(sessionStorage.getItem("userId"));

  const [repeatedDiagnosis, setRepeatedDiagnosis] = useState("");
  const [vitals, setvitals] = useState();
  const [dataFromLab, setDataFromLab] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [lastVisit, setLastVisit] = useState(null);
  const [treatmentModal, setTreatmentModal] = useState(false);

  const { patientId } = useParams();
  const [records, setRecords] = useState({});
  const [displaydoc, setDisplayDocuments] = useState({});
  const [displaydocPelvic, setDisplayDocumentsPelvic] = useState({});
  const [
    displaydocPelvicInvestigation,
    setDisplayDocumentsPelvicInvestigation,
  ] = useState({});
  const [displaydocAfm, setDisplayDocumentsAfm] = useState({});

  const [loading, setLoading] = useState(true);
  const [diagnosis, setDiagnosis] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [carePlan, setcarePlan] = useState("");

  const [newLab, setNewLab] = useState({ test: "", location: "" });
  const [newPrescription, setNewPrescription] = useState({
    name: "",
    quantity: "",
    freq: "",
    duration: "",
  });

  const [labRequests, setLabRequests] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);

  const [isOpen, setIsOpen] = useState(false);

  const getRecord = async () => {
    try {
      const response = await get(`/Orthopedic/${treatmentId}`);
      if (response.isSuccess) {
        console.log(response.data);
        const mappedData = mapResponseToFormData(response.data);
        setFormData(mappedData);
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

  const toggleModal = () => {
    if (lastVisit === null) {
      toast("A visit has to exist before you can refer patient");
      return;
    }
    setShowModal(!showModal);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      patientId: Number(patientId),

      symptomAnalysis: {
        affectedBodyPart: formData["symptomAnalysis.affectedBodyPart"],
        painStartedWhen: formData["symptomAnalysis.painStartedWhen"],
        inJuryEventCaused: {
          anyInJuryEventCaused:
            formData[
              "symptomAnalysis.inJuryEventCaused.anyInJuryEventCaused"
            ] === "true",
          details: formData["symptomAnalysis.inJuryEventCaused.details"],
        },
        describePain: formData["symptomAnalysis.describePain"],
        painSeverityLevel: Number(
          formData["symptomAnalysis.painSeverityLevel"]
        ),
      },

      painBehavior: {
        painType: Number(formData["painBehavior.painType"]),
        painReliever: formData["painBehavior.painReliever"],
        painAggravator: formData["painBehavior.painAggravator"],
        associatedSymptom: {
          stiffnessWeaknessSwelling:
            formData[
              "painBehavior.associatedSymptom.stiffnessWeaknessSwelling"
            ] === "true",
          details: formData["painBehavior.associatedSymptom.details"],
        },
        dailyActivityTrouble: {
          anyDailyTrouble:
            formData["painBehavior.dailyActivityTrouble.anyDailyTrouble"] ===
            "true",
          details: formData["painBehavior.dailyActivityTrouble.details"],
        },
      },

      rangeOfMotion: {
        affectedJoint: {
          fullyMoveJoint:
            formData["rangeOfMotion.affectedJoint.fullyMoveJoint"] === "true",
          describeLimitation:
            formData["rangeOfMotion.affectedJoint.describeLimitation"],
        },
        anySound: formData["rangeOfMotion.anySound"] === "true",
        affectedLimb: {
          ableToPutWeight:
            formData["rangeOfMotion.affectedLimb.ableToPutWeight"] === "true",
          describeDifficult:
            formData["rangeOfMotion.affectedLimb.describeDifficult"],
        },
        maintainingBalance: {
          anyDifficulty:
            formData["rangeOfMotion.maintainingBalance.anyDifficulty"] ===
            "true",
          specifyWhen: formData["rangeOfMotion.maintainingBalance.specifyWhen"],
        },
      },

      circulatorySymptoms: {
        affectedArea: {
          anyNumbnessTinglingWeakness:
            formData[
              "circulatorySymptoms.affectedArea.anyNumbnessTinglingWeakness"
            ] === "true",
          describe: formData["circulatorySymptoms.affectedArea.describe"],
        },
        affectedAreaSeverity: {
          anySwellingBruisingRedness:
            formData[
              "circulatorySymptoms.affectedAreaSeverity.anySwellingBruisingRedness"
            ] === "true",
          describe:
            formData["circulatorySymptoms.affectedAreaSeverity.describe"],
        },
        affectedAreaColor: {
          anyColdPaleDiscolored:
            formData[
              "circulatorySymptoms.affectedAreaColor.anyColdPaleDiscolored"
            ] === "true",
          specify: formData["circulatorySymptoms.affectedAreaColor.specify"],
        },
      },

      lifeStyleRisk: {
        injurySurgery: {
          anyPrevious:
            formData["lifeStyleRisk.injurySurgery.anyPrevious"] === "true",
          describe: formData["lifeStyleRisk.injurySurgery.describe"],
        },
        anyArthritisOsteoporosisJointIssue:
          formData["lifeStyleRisk.anyArthritisOsteoporosisJointIssue"] ===
          "true",
        demandingActivities: {
          anySportsPhysicallyActivities:
            formData[
              "lifeStyleRisk.demandingActivities.anySportsPhysicallyActivities"
            ] === "true",
          specify: formData["lifeStyleRisk.demandingActivities.specify"],
        },
        workEnvironment: {
          anyLiftingRepetitiveMotion:
            formData[
              "lifeStyleRisk.workEnvironment.anyLiftingRepetitiveMotion"
            ] === "true",
          describe: formData["lifeStyleRisk.workEnvironment.describe"],
        },
      },

      treatmentSchedule: formData.treatmentSchedule,
      appointmentId: +localStorage.getItem("appointmentId"),
      doctorId: docInfo,
    };

    console.log("Payload:", payload);

    // return
    // ...then call your API

    try {
      const response = await post("/Orthopedic", payload);
      if (response.isSuccess) {
        navigate(`/doctor/patients/patient-details/${patientId}`);
      }
      console.log("API Response:", response);
    } catch (error) {
      console.error("Submission failed:", error);
    }

    console.log(payload); // check your payload structure
    // alert("Appointment created!");
  };

  const mapResponseToFormData = (data) => {
    return {
      // Symptom Analysis
      "symptomAnalysis.affectedBodyPart":
        data.symptomAnalysis?.affectedBodyPart || "",
      "symptomAnalysis.painStartedWhen":
        data.symptomAnalysis?.painStartedWhen || "",
      "symptomAnalysis.inJuryEventCaused.anyInJuryEventCaused": data
        .symptomAnalysis?.inJuryEventCaused?.anyInJuryEventCaused
        ? "true"
        : "false",
      "symptomAnalysis.inJuryEventCaused.details":
        data.symptomAnalysis?.inJuryEventCaused?.details || "",
      "symptomAnalysis.describePain": data.symptomAnalysis?.describePain || "",
      "symptomAnalysis.painSeverityLevel": String(
        data.symptomAnalysis?.painSeverityLevel || ""
      ),

      // Pain Behavior
      "painBehavior.painType": String(data.painBehavior?.painType || ""),
      "painBehavior.painReliever": data.painBehavior?.painReliever || "",
      "painBehavior.painAggravator": data.painBehavior?.painAggravator || "",
      "painBehavior.associatedSymptom.stiffnessWeaknessSwelling": data
        .painBehavior?.associatedSymptom?.stiffnessWeaknessSwelling
        ? "true"
        : "false",
      "painBehavior.associatedSymptom.details":
        data.painBehavior?.associatedSymptom?.details || "",
      "painBehavior.dailyActivityTrouble.anyDailyTrouble": data.painBehavior
        ?.dailyActivityTrouble?.anyDailyTrouble
        ? "true"
        : "false",
      "painBehavior.dailyActivityTrouble.details":
        data.painBehavior?.dailyActivityTrouble?.details || "",

      // Range of Motion
      "rangeOfMotion.affectedJoint.fullyMoveJoint": data.rangeOfMotion
        ?.affectedJoint?.fullyMoveJoint
        ? "true"
        : "false",
      "rangeOfMotion.affectedJoint.describeLimitation":
        data.rangeOfMotion?.affectedJoint?.describeLimitation || "",
      "rangeOfMotion.anySound": data.rangeOfMotion?.anySound ? "true" : "false",
      "rangeOfMotion.affectedLimb.ableToPutWeight": data.rangeOfMotion
        ?.affectedLimb?.ableToPutWeight
        ? "true"
        : "false",
      "rangeOfMotion.affectedLimb.describeDifficult":
        data.rangeOfMotion?.affectedLimb?.describeDifficult || "",
      "rangeOfMotion.maintainingBalance.anyDifficulty": data.rangeOfMotion
        ?.maintainingBalance?.anyDifficulty
        ? "true"
        : "false",
      "rangeOfMotion.maintainingBalance.specifyWhen":
        data.rangeOfMotion?.maintainingBalance?.specifyWhen || "",

      // Circulatory Symptoms
      "circulatorySymptoms.affectedArea.anyNumbnessTinglingWeakness": data
        .circulatorySymptoms?.affectedArea?.anyNumbnessTinglingWeakness
        ? "true"
        : "false",
      "circulatorySymptoms.affectedArea.describe":
        data.circulatorySymptoms?.affectedArea?.describe || "",
      "circulatorySymptoms.affectedAreaSeverity.anySwellingBruisingRedness":
        data.circulatorySymptoms?.affectedAreaSeverity
          ?.anySwellingBruisingRedness
          ? "true"
          : "false",
      "circulatorySymptoms.affectedAreaSeverity.describe":
        data.circulatorySymptoms?.affectedAreaSeverity?.describe || "",
      "circulatorySymptoms.affectedAreaColor.anyColdPaleDiscolored": data
        .circulatorySymptoms?.affectedAreaColor?.anyColdPaleDiscolored
        ? "true"
        : "false",
      "circulatorySymptoms.affectedAreaColor.specify":
        data.circulatorySymptoms?.affectedAreaColor?.specify || "",

      // Lifestyle Risk
      "lifeStyleRisk.injurySurgery.anyPrevious": data.lifeStyleRisk
        ?.injurySurgery?.anyPrevious
        ? "true"
        : "false",
      "lifeStyleRisk.injurySurgery.describe":
        data.lifeStyleRisk?.injurySurgery?.describe || "",
      "lifeStyleRisk.anyArthritisOsteoporosisJointIssue": data.lifeStyleRisk
        ?.anyArthritisOsteoporosisJointIssue
        ? "true"
        : "false",
      "lifeStyleRisk.demandingActivities.anySportsPhysicallyActivities": data
        .lifeStyleRisk?.demandingActivities?.anySportsPhysicallyActivities
        ? "true"
        : "false",
      "lifeStyleRisk.demandingActivities.specify":
        data.lifeStyleRisk?.demandingActivities?.specify || "",
      "lifeStyleRisk.workEnvironment.anyLiftingRepetitiveMotion": data
        .lifeStyleRisk?.workEnvironment?.anyLiftingRepetitiveMotion
        ? "true"
        : "false",
      "lifeStyleRisk.workEnvironment.describe":
        data.lifeStyleRisk?.workEnvironment?.describe || "",

      // Treatment
      treatmentSchedule: data.treatmentSchedule || "",
    };
  };

  useEffect(() => {
    // if (patientId) fetchRecord();
    if (treatmentId) {
      getRecord();
      fetcLabhData(treatmentId);
      fetchVisit();
    }
    fetchTreatmentVitalsRecord();
  }, [patientId]);

  // const fetchRecord = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await get(`/FamilyMedicine/${treatmentId}`);
  //     if (response?.isSuccess) {
  //       setRecords(response.data || {});
  //     }
  //   } catch (error) {
  //     console.error("Failed to fetch record:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const deliveryTypes = {
    1: "Normal",
    2: "C-Section",
    3: "Assisted",
  };

  const investigations = {
    1: "FBC",
    2: "PT",
    3: "LFT",
    4: "EUC",
    5: "RBS",
  };

  const plans = {
    1: "IUCD",
    2: "Pills",
    3: "Injectable-two months",
    4: "Injectable-three months",
    5: "Implant",
  };

  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    console.log(name);
    console.log(value);
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const fetcLabhData = async (treatmentId) => {
    // setIsLoading(true);
    try {
      const response = await get(
        `/patients/list/orthopedic/${treatmentId}/is-family-medicine/false/1/10/orthopedic-patients-lab-requests`
      );
      setDataFromLab(response.resultList);
      console.log(response.resultList);
      // response.data && setRepeatedDiagnosis(response.data[0]?.diagnosis);
    } catch (e) {
      console.log(e);
    }
    // setIsLoading(false);
  };

  const fetchVisit = async () => {
    // setIsLoading(true);
    try {
      const response = await get(
        `/appointment/get-appointment-bypatientId/${patientId}/`
      );
      setLastVisit(response.data[response.data.length - 1]);
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

  const toggleTreatmentModal = () => {
    if (lastVisit === null) {
      alert("");

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
      orthopedicId: +treatmentId || 0,
      generalSurgeryId: 0,
      pediatricId: 0,
      generalPracticeId: 0,
      antenatalId: 0,
      ...load,
    };

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
    <div style={{ paddingTop: "60px" }} className="w-100">
      <div class="flex-between align-center">
        <div class="flex" style={{ padding: "20px" }}>
          <FiArrowLeft />
          <p onClick={() => navigate(-1)}> Back</p>
        </div>

        {treatmentId && (
          <div class="flex-row-gap">
            <button className="rounded-btn" onClick={toggleModal}>
              + Refer Patient To Lab
            </button>
            <button className="rounded-btn" onClick={toggleTreatmentModal}>
              + Add Treatment
            </button>
          </div>
        )}
      </div>
      <div class="flex-row-gap-start">
        <div>
          <section className="">
            <h2 style={{ textAlign: "center" }} className="w-100">
              Orthopedic
            </h2>
            <div className="section-box m-t-20">
              {/* 1. Symptom Analysis */}
              <div className="input-row">
                <div className="field-row">
                  <label>Which body part is affected</label>
                  <input
                    type="text"
                    name="symptomAnalysis.affectedBodyPart"
                    onChange={handleChange}
                    className="input-field"
                    value={formData["symptomAnalysis.affectedBodyPart"] || ""}
                  />
                </div>
                <div className="field-row">
                  <label>When did pain start</label>
                  <input
                    type="text"
                    name="symptomAnalysis.painStartedWhen"
                    onChange={handleChange}
                    className="input-field"
                    value={formData["symptomAnalysis.painStartedWhen"] || ""}
                  />
                </div>
                <div className="radio-row">
                  <span>Was there specific injury?</span>
                  <label>
                    <input
                      type="radio"
                      name="symptomAnalysis.inJuryEventCaused.anyInJuryEventCaused"
                      value="true"
                      onChange={handleChange}
                      checked={
                        formData[
                          "symptomAnalysis.inJuryEventCaused.anyInJuryEventCaused"
                        ] === "true"
                      }
                    />{" "}
                    Yes
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="symptomAnalysis.inJuryEventCaused.anyInJuryEventCaused"
                      value="false"
                      onChange={handleChange}
                      checked={
                        formData[
                          "symptomAnalysis.inJuryEventCaused.anyInJuryEventCaused"
                        ] === "false"
                      }
                    />{" "}
                    No
                  </label>
                </div>
                <div className="field-column">
                  <label>Provide injury details</label>
                  {treatmentId ? (
                    <textarea
                      name="symptomAnalysis.inJuryEventCaused.details"
                      onChange={handleChange}
                      className="input-field"
                      rows={6}
                      value={
                        formData["symptomAnalysis.inJuryEventCaused.details"] ||
                        ""
                      }
                    />
                  ) : (
                    <GhostTextCompletion
                      // label="Patient Diagnosis"
                      name="symptomAnalysis.inJuryEventCaused.details"
                      value={
                        formData["symptomAnalysis.inJuryEventCaused.details"] ||
                        ""
                      }
                      handleChange={handleChange}
                      none={true}
                    />
                  )}
                  {/* <textarea
                      name="symptomAnalysis.inJuryEventCaused.details"
                      onChange={handleChange}
                      className="input-field"
                      rows={6}
                      value={
                        formData["symptomAnalysis.inJuryEventCaused.details"] ||
                        ""
                      }
                    /> */}
                </div>
                <div className="field-column">
                  <label>Describe pain</label>
                  {treatmentId ? (
                    <textarea
                      name="symptomAnalysis.describePain"
                      onChange={handleChange}
                      className="input-field"
                      rows={6}
                      value={formData["symptomAnalysis.describePain"] || ""}
                    />
                  ) : (
                    <GhostTextCompletion
                      // label="Patient Diagnosis"
                      name="symptomAnalysis.describePain"
                      value={formData["symptomAnalysis.describePain"] || ""}
                      handleChange={handleChange}
                      none={true}
                    />
                  )}
                  {/**/}
                </div>
                <div className="field-row">
                  <label>Pain severity level</label>
                  <input
                    type="number"
                    name="symptomAnalysis.painSeverityLevel"
                    onChange={handleChange}
                    className="input-field"
                    value={formData["symptomAnalysis.painSeverityLevel"] || ""}
                  />
                </div>
              </div>
              {/* 2. Pain Behavior */}
              <div className="section-box m-t-10">
                <p>Functional Impact and Pain Behaviors</p>
                <div className="field-row">
                  <label>Is pain constant?</label>
                  <label>
                    <input
                      type="radio"
                      name="painBehavior.painType"
                      value="1"
                      onChange={handleChange}
                      checked={formData["painBehavior.painType"] === "1"}
                    />{" "}
                    Yes
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="painBehavior.painType"
                      value="2"
                      onChange={handleChange}
                      checked={formData["painBehavior.painType"] === "2"}
                    />{" "}
                    No
                  </label>
                </div>
                <div className="field-column">
                  <label>What makes pain better</label>
                  {treatmentId ? (
                    <textarea
                      name="painBehavior.painReliever"
                      onChange={handleChange}
                      className="input-field"
                      rows={6}
                      value={formData["painBehavior.painReliever"] || ""}
                    />
                  ) : (
                    <GhostTextCompletion
                      // label="Patient Diagnosis"
                      name="painBehavior.painReliever"
                      value={formData["painBehavior.painReliever"] || ""}
                      handleChange={handleChange}
                      none={true}
                    />
                  )}
                  {/* <textarea
                    name="painBehavior.painReliever"
                    onChange={handleChange}
                    className="input-field"
                    rows={6}
                    value={formData["painBehavior.painReliever"] || ""}
                  /> */}
                </div>
                <div className="field-column">
                  <label>What makes pain worse</label>
                  {treatmentId ? (
                    <textarea
                      name="painBehavior.painAggravator"
                      onChange={handleChange}
                      className="input-field"
                      rows={6}
                      value={formData["painBehavior.painAggravator"] || ""}
                    />
                  ) : (
                    <GhostTextCompletion
                      // label="Patient Diagnosis"
                      name="painBehavior.painAggravator"
                      value={formData["painBehavior.painAggravator"] || ""}
                      handleChange={handleChange}
                      none={true}
                    />
                  )}
                  {/* <textarea
                    name="painBehavior.painAggravator"
                    onChange={handleChange}
                    className="input-field"
                    rows={6}
                    value={formData["painBehavior.painAggravator"] || ""}
                  /> */}
                </div>
                <div className="radio-row">
                  <span>Associated stiffness/weakness/swelling?</span>
                  <label>
                    <input
                      type="radio"
                      name="painBehavior.associatedSymptom.stiffnessWeaknessSwelling"
                      value="true"
                      onChange={handleChange}
                      checked={
                        formData[
                          "painBehavior.associatedSymptom.stiffnessWeaknessSwelling"
                        ] === "true"
                      }
                    />{" "}
                    Yes
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="painBehavior.associatedSymptom.stiffnessWeaknessSwelling"
                      value="false"
                      onChange={handleChange}
                      checked={
                        formData[
                          "painBehavior.associatedSymptom.stiffnessWeaknessSwelling"
                        ] === "false"
                      }
                    />{" "}
                    No
                  </label>
                </div>
                <div className="field-column">
                  <label>Provide associated symptom details</label>
                  {treatmentId ? (
                    <textarea
                      name="painBehavior.associatedSymptom.details"
                      onChange={handleChange}
                      className="input-field"
                      rows={6}
                      value={
                        formData["painBehavior.associatedSymptom.details"] || ""
                      }
                    />
                  ) : (
                    <GhostTextCompletion
                      // label="Patient Diagnosis"
                      name="painBehavior.associatedSymptom.details"
                      value={
                        formData["painBehavior.associatedSymptom.details"] || ""
                      }
                      handleChange={handleChange}
                      none={true}
                    />
                  )}
                  {/* <textarea
                    name="painBehavior.associatedSymptom.details"
                    onChange={handleChange}
                    className="input-field"
                    rows={6}
                    value={
                      formData["painBehavior.associatedSymptom.details"] || ""
                    }
                  /> */}
                </div>
                <div className="radio-row">
                  <span>Trouble with daily activities?</span>
                  <label>
                    <input
                      type="radio"
                      name="painBehavior.dailyActivityTrouble.anyDailyTrouble"
                      value="true"
                      onChange={handleChange}
                      checked={
                        formData[
                          "painBehavior.dailyActivityTrouble.anyDailyTrouble"
                        ] === "true"
                      }
                    />{" "}
                    Yes
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="painBehavior.dailyActivityTrouble.anyDailyTrouble"
                      value="false"
                      onChange={handleChange}
                      checked={
                        formData[
                          "painBehavior.dailyActivityTrouble.anyDailyTrouble"
                        ] === "false"
                      }
                    />{" "}
                    No
                  </label>
                </div>
                <div className="field-column">
                  <label>Provide daily trouble details</label>
                  {treatmentId ? (
                    <textarea
                      name="painBehavior.dailyActivityTrouble.details"
                      onChange={handleChange}
                      className="input-field"
                      rows={6}
                      value={
                        formData["painBehavior.dailyActivityTrouble.details"] ||
                        ""
                      }
                    />
                  ) : (
                    <GhostTextCompletion
                      // label="Patient Diagnosis"
                      name="painBehavior.dailyActivityTrouble.details"
                      value={
                        formData["painBehavior.dailyActivityTrouble.details"] ||
                        ""
                      }
                      handleChange={handleChange}
                      none={true}
                    />
                  )}
                  {/* <textarea
                    name="painBehavior.dailyActivityTrouble.details"
                    onChange={handleChange}
                    className="input-field"
                    rows={6}
                    value={
                      formData["painBehavior.dailyActivityTrouble.details"] || ""
                    }
                  /> */}
                </div>
              </div>
              {/* 3. Range of Motion */}
              <div className="section-box m-t-10">
                <p>Mobility & Range of Motion</p>
                <div className="radio-row">
                  <span>Can you fully move the joint?</span>
                  <label>
                    <input
                      type="radio"
                      name="rangeOfMotion.affectedJoint.fullyMoveJoint"
                      value="true"
                      onChange={handleChange}
                      checked={
                        formData[
                          "rangeOfMotion.affectedJoint.fullyMoveJoint"
                        ] === "true"
                      }
                    />{" "}
                    Yes
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="rangeOfMotion.affectedJoint.fullyMoveJoint"
                      value="false"
                      onChange={handleChange}
                      checked={
                        formData[
                          "rangeOfMotion.affectedJoint.fullyMoveJoint"
                        ] === "false"
                      }
                    />{" "}
                    No
                  </label>
                </div>
                <div className="field-column">
                  <label>Describe limitation</label>
                  {treatmentId ? (
                    <textarea
                      name="rangeOfMotion.affectedJoint.describeLimitation"
                      onChange={handleChange}
                      className="input-field"
                      rows={6}
                      value={
                        formData[
                          "rangeOfMotion.affectedJoint.describeLimitation"
                        ] || ""
                      }
                    />
                  ) : (
                    <GhostTextCompletion
                      // label="Patient Diagnosis"
                      name="rangeOfMotion.affectedJoint.describeLimitation"
                      value={
                        formData[
                          "rangeOfMotion.affectedJoint.describeLimitation"
                        ] || ""
                      }
                      handleChange={handleChange}
                      none={true}
                    />
                  )}
                  {/* <textarea
                    name="rangeOfMotion.affectedJoint.describeLimitation"
                    onChange={handleChange}
                    className="input-field"
                    rows={6}
                    value={
                      formData[
                        "rangeOfMotion.affectedJoint.describeLimitation"
                      ] || ""
                    }
                  /> */}
                </div>
                <div className="radio-row">
                  <span>Clicking/popping sounds?</span>
                  <label>
                    <input
                      type="radio"
                      name="rangeOfMotion.anySound"
                      value="true"
                      onChange={handleChange}
                      checked={formData["rangeOfMotion.anySound"] === "true"}
                    />{" "}
                    Yes
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="rangeOfMotion.anySound"
                      value="false"
                      onChange={handleChange}
                      checked={formData["rangeOfMotion.anySound"] === "false"}
                    />{" "}
                    No
                  </label>
                </div>
                <div className="radio-row">
                  <span>Can you put weight on limb?</span>
                  <label>
                    <input
                      type="radio"
                      name="rangeOfMotion.affectedLimb.ableToPutWeight"
                      value="true"
                      onChange={handleChange}
                      checked={
                        formData[
                          "rangeOfMotion.affectedLimb.ableToPutWeight"
                        ] === "true"
                      }
                    />{" "}
                    Yes
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="rangeOfMotion.affectedLimb.ableToPutWeight"
                      value="false"
                      onChange={handleChange}
                      checked={
                        formData[
                          "rangeOfMotion.affectedLimb.ableToPutWeight"
                        ] === "false"
                      }
                    />{" "}
                    No
                  </label>
                </div>
                <div className="field-column">
                  <label>Describe difficulty</label>
                  {treatmentId ? (
                    <textarea
                      name="rangeOfMotion.affectedLimb.describeDifficult"
                      onChange={handleChange}
                      className="input-field"
                      rows={6}
                      value={
                        formData[
                          "rangeOfMotion.affectedLimb.describeDifficult"
                        ] || ""
                      }
                    />
                  ) : (
                    <GhostTextCompletion
                      // label="Patient Diagnosis"
                      name="rangeOfMotion.affectedLimb.describeDifficult"
                      value={
                        formData[
                          "rangeOfMotion.affectedLimb.describeDifficult"
                        ] || ""
                      }
                      handleChange={handleChange}
                      none={true}
                    />
                  )}
                  {/* <textarea
                    name="rangeOfMotion.affectedLimb.describeDifficult"
                    onChange={handleChange}
                    className="input-field"
                    rows={6}
                    value={
                      formData["rangeOfMotion.affectedLimb.describeDifficult"] ||
                      ""
                    }
                  /> */}
                </div>
                <div className="radio-row">
                  <span>Difficulty maintaining balance?</span>
                  <label>
                    <input
                      type="radio"
                      name="rangeOfMotion.maintainingBalance.anyDifficulty"
                      value="true"
                      onChange={handleChange}
                      checked={
                        formData[
                          "rangeOfMotion.maintainingBalance.anyDifficulty"
                        ] === "true"
                      }
                    />{" "}
                    Yes
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="rangeOfMotion.maintainingBalance.anyDifficulty"
                      value="false"
                      onChange={handleChange}
                      checked={
                        formData[
                          "rangeOfMotion.maintainingBalance.anyDifficulty"
                        ] === "false"
                      }
                    />{" "}
                    No
                  </label>
                </div>
                <div className="field-column">
                  <label>Specify when</label>
                  {treatmentId ? (
                    <textarea
                      name="rangeOfMotion.maintainingBalance.specifyWhen"
                      onChange={handleChange}
                      className="input-field"
                      rows={6}
                      value={
                        formData[
                          "rangeOfMotion.maintainingBalance.specifyWhen"
                        ] || ""
                      }
                    />
                  ) : (
                    <GhostTextCompletion
                      // label="Patient Diagnosis"
                      name="rangeOfMotion.maintainingBalance.specifyWhen"
                      value={
                        formData[
                          "rangeOfMotion.maintainingBalance.specifyWhen"
                        ] || ""
                      }
                      handleChange={handleChange}
                      none={true}
                    />
                  )}
                  {/* <textarea
                    name="rangeOfMotion.maintainingBalance.specifyWhen"
                    onChange={handleChange}
                    className="input-field"
                    rows={6}
                    value={
                      formData["rangeOfMotion.maintainingBalance.specifyWhen"] ||
                      ""
                    }
                  /> */}
                </div>
              </div>
              {/* 4. Circulatory Symptoms */}
              <div className="section-box m-t-10">
                <p>Neurological & Circulatory Symptoms</p>
                <div className="radio-row">
                  <span>Numbness/tingling/weakness?</span>
                  <label>
                    <input
                      type="radio"
                      name="circulatorySymptoms.affectedArea.anyNumbnessTinglingWeakness"
                      value="true"
                      onChange={handleChange}
                      checked={
                        formData[
                          "circulatorySymptoms.affectedArea.anyNumbnessTinglingWeakness"
                        ] === "true"
                      }
                    />{" "}
                    Yes
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="circulatorySymptoms.affectedArea.anyNumbnessTinglingWeakness"
                      value="false"
                      onChange={handleChange}
                      checked={
                        formData[
                          "circulatorySymptoms.affectedArea.anyNumbnessTinglingWeakness"
                        ] === "false"
                      }
                    />{" "}
                    No
                  </label>
                </div>
                <div className="field-column">
                  <label>Describe where & how often</label>
                  {treatmentId ? (
                    <textarea
                      name="circulatorySymptoms.affectedArea.describe"
                      onChange={handleChange}
                      className="input-field"
                      rows={6}
                      value={
                        formData["circulatorySymptoms.affectedArea.describe"] ||
                        ""
                      }
                    />
                  ) : (
                    <GhostTextCompletion
                      // label="Patient Diagnosis"
                      name="circulatorySymptoms.affectedArea.describe"
                      value={
                        formData["circulatorySymptoms.affectedArea.describe"] ||
                        ""
                      }
                      handleChange={handleChange}
                      none={true}
                    />
                  )}
                  {/* <textarea
                    name="circulatorySymptoms.affectedArea.describe"
                    onChange={handleChange}
                    className="input-field"
                    rows={6}
                    value={
                      formData["circulatorySymptoms.affectedArea.describe"] || ""
                    }
                  /> */}
                </div>
                <div className="radio-row">
                  <span>Swelling/bruising/redness?</span>
                  <label>
                    <input
                      type="radio"
                      name="circulatorySymptoms.affectedAreaSeverity.anySwellingBruisingRedness"
                      value="true"
                      onChange={handleChange}
                      checked={
                        formData[
                          "circulatorySymptoms.affectedAreaSeverity.anySwellingBruisingRedness"
                        ] === "true"
                      }
                    />{" "}
                    Yes
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="circulatorySymptoms.affectedAreaSeverity.anySwellingBruisingRedness"
                      value="false"
                      onChange={handleChange}
                      checked={
                        formData[
                          "circulatorySymptoms.affectedAreaSeverity.anySwellingBruisingRedness"
                        ] === "false"
                      }
                    />{" "}
                    No
                  </label>
                </div>
                <div className="field-column">
                  <label>Describe severity</label>
                  {treatmentId ? (
                    <textarea
                      name="circulatorySymptoms.affectedAreaSeverity.describe"
                      onChange={handleChange}
                      className="input-field"
                      rows={6}
                      value={
                        formData[
                          "circulatorySymptoms.affectedAreaSeverity.describe"
                        ] || ""
                      }
                    />
                  ) : (
                    <GhostTextCompletion
                      // label="Patient Diagnosis"
                      name="circulatorySymptoms.affectedAreaSeverity.describe"
                      value={
                        formData[
                          "circulatorySymptoms.affectedAreaSeverity.describe"
                        ] || ""
                      }
                      handleChange={handleChange}
                      none={true}
                    />
                  )}
                  {/* <textarea
                    name="circulatorySymptoms.affectedAreaSeverity.describe"
                    onChange={handleChange}
                    className="input-field"
                    rows={6}
                    value={
                      formData[
                        "circulatorySymptoms.affectedAreaSeverity.describe"
                      ] || ""
                    }
                  /> */}
                </div>
                <div className="radio-row">
                  <span>Cold/pale/discolored?</span>
                  <label>
                    <input
                      type="radio"
                      name="circulatorySymptoms.affectedAreaColor.anyColdPaleDiscolored"
                      value="true"
                      onChange={handleChange}
                      checked={
                        formData[
                          "circulatorySymptoms.affectedAreaColor.anyColdPaleDiscolored"
                        ] === "true"
                      }
                    />{" "}
                    Yes
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="circulatorySymptoms.affectedAreaColor.anyColdPaleDiscolored"
                      value="false"
                      onChange={handleChange}
                      checked={
                        formData[
                          "circulatorySymptoms.affectedAreaColor.anyColdPaleDiscolored"
                        ] === "false"
                      }
                    />{" "}
                    No
                  </label>
                </div>
                <div className="field-column">
                  <label>Specify color/sensation changes</label>
                  {treatmentId ? (
                    <textarea
                      name="circulatorySymptoms.affectedAreaColor.specify"
                      onChange={handleChange}
                      className="input-field"
                      rows={6}
                      value={
                        formData[
                          "circulatorySymptoms.affectedAreaColor.specify"
                        ] || ""
                      }
                    />
                  ) : (
                    <GhostTextCompletion
                      // label="Patient Diagnosis"
                      name="circulatorySymptoms.affectedAreaColor.specify"
                      value={
                        formData[
                          "circulatorySymptoms.affectedAreaColor.specify"
                        ] || ""
                      }
                      handleChange={handleChange}
                      none={true}
                    />
                  )}
                  {/* <textarea
                    name="circulatorySymptoms.affectedAreaColor.specify"
                    onChange={handleChange}
                    className="input-field"
                    rows={6}
                    value={
                      formData["circulatorySymptoms.affectedAreaColor.specify"] ||
                      ""
                    }
                  /> */}
                </div>
              </div>
              {/* 5. Lifestyle Risk */}
              <div className="section-box m-t-10">
                <p>Medical History & Lifestyle Risks</p>
                <div className="radio-row">
                  <span>Previous injuries/surgeries?</span>
                  <label>
                    <input
                      type="radio"
                      name="lifeStyleRisk.injurySurgery.anyPrevious"
                      value="true"
                      onChange={handleChange}
                      checked={
                        formData["lifeStyleRisk.injurySurgery.anyPrevious"] ===
                        "true"
                      }
                    />{" "}
                    Yes
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="lifeStyleRisk.injurySurgery.anyPrevious"
                      value="false"
                      onChange={handleChange}
                      checked={
                        formData["lifeStyleRisk.injurySurgery.anyPrevious"] ===
                        "false"
                      }
                    />{" "}
                    No
                  </label>
                </div>
                <div className="field-column">
                  <label>Describe injury/surgery</label>
                  {treatmentId ? (
                    <textarea
                      name="lifeStyleRisk.injurySurgery.describe"
                      onChange={handleChange}
                      className="input-field"
                      rows={6}
                      value={
                        formData["lifeStyleRisk.injurySurgery.describe"] || ""
                      }
                    />
                  ) : (
                    <GhostTextCompletion
                      // label="Patient Diagnosis"
                      name="lifeStyleRisk.injurySurgery.describe"
                      value={
                        formData["lifeStyleRisk.injurySurgery.describe"] || ""
                      }
                      handleChange={handleChange}
                      none={true}
                    />
                  )}
                  {/*  */}
                </div>
                <div className="radio-row">
                  <span>Arthritis/osteoporosis/joint issue?</span>
                  <label>
                    <input
                      type="radio"
                      name="lifeStyleRisk.anyArthritisOsteoporosisJointIssue"
                      value="true"
                      onChange={handleChange}
                      checked={
                        formData[
                          "lifeStyleRisk.anyArthritisOsteoporosisJointIssue"
                        ] === "true"
                      }
                    />{" "}
                    Yes
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="lifeStyleRisk.anyArthritisOsteoporosisJointIssue"
                      value="false"
                      onChange={handleChange}
                      checked={
                        formData[
                          "lifeStyleRisk.anyArthritisOsteoporosisJointIssue"
                        ] === "false"
                      }
                    />{" "}
                    No
                  </label>
                </div>
                <div className="radio-row">
                  <span>Sports/physically demanding?</span>
                  <label>
                    <input
                      type="radio"
                      name="lifeStyleRisk.demandingActivities.anySportsPhysicallyActivities"
                      value="true"
                      onChange={handleChange}
                      checked={
                        formData[
                          "lifeStyleRisk.demandingActivities.anySportsPhysicallyActivities"
                        ] === "true"
                      }
                    />{" "}
                    Yes
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="lifeStyleRisk.demandingActivities.anySportsPhysicallyActivities"
                      value="false"
                      onChange={handleChange}
                      checked={
                        formData[
                          "lifeStyleRisk.demandingActivities.anySportsPhysicallyActivities"
                        ] === "false"
                      }
                    />{" "}
                    No
                  </label>
                </div>
                <div className="field-column">
                  <label>Specify activities</label>
                  {treatmentId ? (
                    <textarea
                      name="lifeStyleRisk.demandingActivities.specify"
                      onChange={handleChange}
                      className="input-field"
                      rows={6}
                      value={
                        formData["lifeStyleRisk.demandingActivities.specify"] ||
                        ""
                      }
                    />
                  ) : (
                    <GhostTextCompletion
                      // label="Patient Diagnosis"
                      name="lifeStyleRisk.demandingActivities.specify"
                      value={
                        formData["lifeStyleRisk.demandingActivities.specify"] ||
                        ""
                      }
                      handleChange={handleChange}
                      none={true}
                    />
                  )}
                  {/* */}
                </div>
                <div className="radio-row">
                  <span>Heavy lifting/repetitive motion at work?</span>
                  <label>
                    <input
                      type="radio"
                      name="lifeStyleRisk.workEnvironment.anyLiftingRepetitiveMotion"
                      value="true"
                      onChange={handleChange}
                      checked={
                        formData[
                          "lifeStyleRisk.workEnvironment.anyLiftingRepetitiveMotion"
                        ] === "true"
                      }
                    />{" "}
                    Yes
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="lifeStyleRisk.workEnvironment.anyLiftingRepetitiveMotion"
                      value="false"
                      onChange={handleChange}
                      checked={
                        formData[
                          "lifeStyleRisk.workEnvironment.anyLiftingRepetitiveMotion"
                        ] === "false"
                      }
                    />{" "}
                    No
                  </label>
                </div>
                <div className="field-column">
                  <label>Describe work environment</label>
                  {treatmentId ? (
                    <textarea
                      name="lifeStyleRisk.workEnvironment.describe"
                      onChange={handleChange}
                      className="input-field"
                      rows={6}
                      value={
                        formData["lifeStyleRisk.workEnvironment.describe"] || ""
                      }
                    />
                  ) : (
                    <GhostTextCompletion
                      // label="Patient Diagnosis"
                      name="lifeStyleRisk.workEnvironment.describe"
                      value={
                        formData["lifeStyleRisk.workEnvironment.describe"] || ""
                      }
                      handleChange={handleChange}
                      none={true}
                    />
                  )}
                  {/* */}
                </div>
              </div>
              {treatmentId && dataFromLab && (
                <div className="field-column">
                  <label>Patient's Lab Results</label>
                  <LabRequestTable data={dataFromLab} isFamily={false} />
                </div>
              )}
              {treatmentId && (
                <MedicationTable
                  data={{
                    treatmentType: "Orthopedic",
                    treatmentId: treatmentId,
                  }}
                />
              )}
              {/* 6. Treatment Schedule & Submit */}
              <div className="field-column m-t-20">
                <label>Treatment Schedule</label>
                {treatmentId ? (
                  <textarea
                    name="treatmentSchedule"
                    onChange={handleChange}
                    className="input-field"
                    rows={6}
                    value={formData["treatmentSchedule"] || ""}
                  />
                ) : (
                  <GhostTextCompletion
                    // label="Patient Diagnosis"
                    name="treatmentSchedule"
                    value={formData["treatmentSchedule"] || ""}
                    handleChange={handleChange}
                    none={true}
                  />
                )}
                {/*  */}
              </div>
              {!treatmentId && (
                <button onClick={handleSubmit} className="submit-btn">
                  Submit
                </button>
              )}
              {showModal && (
                <ReferPatient
                  repeatedDiagnosis={repeatedDiagnosis}
                  setRepeatedDiagnosis={setRepeatedDiagnosis}
                  closeModal={toggleModal}
                  visit={lastVisit}
                  vital={vitals}
                  orthopedic={+treatmentId || 0}
                  // vitalId = {vitals.id}
                  id={patientId}
                  // treatment={data[0] || null}
                />
              )}
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
            </div>
          </section>
        </div>
        <VitalsRecords vitals={vitals} />
      </div>
    </div>
  );
};

export default Orthopedic;
