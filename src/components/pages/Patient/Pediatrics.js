import React, { useEffect, useState } from "react";
import "./FamilyConsultation.css";
import { get, post } from "../../../utility/fetch";
import { post as posts, get as gets } from "../../../utility/fetchLab";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
// import IVFConsultation from "./IVFConsultation";

const Pediatrics = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const treatmentId = searchParams.get("treatmentId");
  const docInfo = JSON.parse(localStorage.getItem("USER_INFO"));

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
      doctorId: docInfo.employeeId,
    };

    console.log("Payload:", payload);
    // ...then call your API

    try {
      const response = await post("/Pediatrics", payload);
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

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("IFormFile", file);
    console.log(file);
    // └─ ensure “IFormFile” exactly matches your backend’s expected field name

    try {
      // pass the FormData directly
      const res = await posts({
        endpoint: "/document",
        body: formData,
        auth: true,
      });
      //   console.log("Upload successful:", res);
      console.log("Upload successful:", res?.data?.docName);
      setDisplayDocuments(res?.data?.docName);
    } catch (error) {
      console.error("Upload error:", error);
    }
  };
  const handleFileUploadPelvicInvestigation = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("IFormFile", file);
    console.log(file);
    // └─ ensure “IFormFile” exactly matches your backend’s expected field name

    try {
      // pass the FormData directly
      const res = await posts({
        endpoint: "/document",
        body: formData,
        auth: true,
      });
      //   console.log("Upload successful:", res);
      console.log("Upload successful:", res?.data?.docName);
      setDisplayDocumentsPelvicInvestigation(res?.data?.docName);
    } catch (error) {
      console.error("Upload error:", error);
    }
  };
  const handleFileUploadPelvic = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("IFormFile", file);
    console.log(file);
    // └─ ensure “IFormFile” exactly matches your backend’s expected field name

    try {
      // pass the FormData directly
      const res = await posts({
        endpoint: "/document",
        body: formData,
        auth: true,
      });
      //   console.log("Upload successful:", res);
      console.log("Upload successful:", res?.data?.docName);
      setDisplayDocumentsPelvic(res?.data?.docName);
    } catch (error) {
      console.error("Upload error:", error);
    }
  };
  const handleFileUploadAfm = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("IFormFile", file);
    console.log(file);
    // └─ ensure “IFormFile” exactly matches your backend’s expected field name

    try {
      // pass the FormData directly
      const res = await posts({
        endpoint: "/document",
        body: formData,
        auth: true,
      });
      //   console.log("Upload successful:", res);
      console.log("Upload successful:", res?.data?.docName);
      setDisplayDocumentsAfm(res?.data?.docName);
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  const getDocs = async (array) => {
    console.log(array);
    let res = await gets({
      // endpoint: `patientlabreport/patient-report/${patientId?.id}/labtechnician/${userAuth?.resultList?.userId}`,
      endpoint: `document/view-document/${array[0]?.docName}`,

      // body: formData,
      // auth: false,
    });
    console.log(res);
    setDisplayDocuments(res?.data);
    //
  };

  //   /const handleFileChange = async (e) => {
  //     const formData = new FormData();

  //     const file = e.target.files[0];
  //     setSelectedFile(file);
  //     console.log(file);

  //     // Callback to parent component with the selected file

  //     formData.append("IFormFile", file);

  //     setisLoading(true);

  //     const res = await post({
  //       endpoint: "document",
  //       body: formData,
  //       auth: false,
  //     });

  //     if (res && res.status == 200) {
  //       setisLoading(false);
  //       // if (onFileChange) {
  //         onFileChange(res.data, file.name);
  //         console.log(res.data, file.name);
  //       // }

  //       console.log(res)
  //     }

  //     // https://edogoverp.com/services/api/documents/admin-stores
  //   };

  const onClose = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (patientId) fetchRecord();
  }, [patientId]);

  const fetchRecord = async () => {
    setLoading(true);
    try {
      const response = await get(`/FamilyMedicine/${treatmentId}`);
      if (response?.isSuccess) {
        setRecords(response.data || {});
      }
    } catch (error) {
      console.error("Failed to fetch record:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    return dateStr ? new Date(dateStr).toISOString().split("T")[0] : "-";
  };

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

  const handleLabAdd = () => {
    setLabRequests([...labRequests, newLab]);
    setNewLab({ test: "", location: "" });
  };

  const handlePrescriptionAdd = () => {
    setPrescriptions([...prescriptions, newPrescription]);
    setNewPrescription({ name: "", quantity: "", freq: "", duration: "" });
  };
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  return (
    <div style={{ paddingTop: "60px" }} className="w-100">
      <main className="">
        <section className="">
          <div className="section-box">
            {/* 1. Symptom Analysis */}
            <p>Patient Identification a& GEneral information</p>

           
            <div className="input-row">
            <div className="radio-row">
                <span>Does the child have any ongoing medical conditions?</span>
                <label>
                  <input
                    type="radio"
                    name="symptomAnalysis.inJuryEventCaused.anyInJuryEventCaused"
                    value="true"
                    onChange={handleChange}
                  />{" "}
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="symptomAnalysis.inJuryEventCaused.anyInJuryEventCaused"
                    value="false"
                    onChange={handleChange}
                  />{" "}
                  No
                </label>
              </div>
              <div className="field-row">
                <label>Provide Details</label>
                <input
                  type="text"
                  name="symptomAnalysis.affectedBodyPart"
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
              <div className="radio-row">
                <span>Is the child currently on any medications??</span>
                <label>
                  <input
                    type="radio"
                    name="symptomAnalysis.inJuryEventCaused.anyInJuryEventCaused"
                    value="true"
                    onChange={handleChange}
                  />{" "}
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="symptomAnalysis.inJuryEventCaused.anyInJuryEventCaused"
                    value="false"
                    onChange={handleChange}
                  />{" "}
                  No
                </label>
              </div>
             
              <div className="field-row">
                <label>Provide Details</label>
                <input
                  type="text"
                  name="symptomAnalysis.affectedBodyPart"
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
            </div>

           {/* {2} */}

          <div className="section-box">
          <p>Patient Identification a& GEneral information</p>

              <div className="field-row">
                <label>When did the symptoms start?</label>
                <input
                  type="text"
                  name="symptomAnalysis.affectedBodyPart"
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
              <div className="field-row">
                <label>Symptom status?</label>
                <input
                  type="text"
                  name="symptomAnalysis.painStartedWhen"
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div className="radio-row">
                <span>Was there any triggering event (injury, exposure, food, activity)?</span>
                <label>
                  <input
                    type="radio"
                    name="symptomAnalysis.inJuryEventCaused.anyInJuryEventCaused"
                    value="true"
                    onChange={handleChange}
                  />{" "}
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="symptomAnalysis.inJuryEventCaused.anyInJuryEventCaused"
                    value="false"
                    onChange={handleChange}
                  />{" "}
                  No
                </label>
              </div>
             
              <div className="field-column">
                <label>Provide details</label>
                <textarea
                  name="symptomAnalysis.inJuryEventCaused.details"
                  onChange={handleChange}
                  className="input-field"
                  rows={6}
                />
              </div>
             
            </div>

            <div className="section-box m-t-10">
              <p>Pain & Discomfort Assessment</p>
              <div className="field-row">
                <label>Is the child in pain??</label>
                <label>
                  <input
                    type="radio"
                    name="painBehavior.painType"
                    value="1"
                    onChange={handleChange}
                  />{" "}
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="painBehavior.painType"
                    value="2"
                    onChange={handleChange}
                  />{" "}
                  No
                </label>
              </div>
              <div className="field-column">
                <label>What makes pain better</label>
                <textarea
                  name="painBehavior.painReliever"
                  onChange={handleChange}
                  className="input-field"
                  rows={6}
                />
              </div>
              <div className="field-column">
                <label>Specify location and severity</label>
                <textarea
                  name="painBehavior.painAggravator"
                  onChange={handleChange}
                  className="input-field"
                  rows={6}
                />
              </div>

              <div className="field-column">
                <label>How would you describe the pain?</label>
                <textarea
                  name="painBehavior.painAggravator"
                  onChange={handleChange}
                  className="input-field"
                  rows={6}
                />
              </div>
              <div className="field-column">
                <label>How wousevere is your pain?</label>
                <textarea
                  name="painBehavior.painAggravator"
                  onChange={handleChange}
                  className="input-field"
                  rows={6}
                />
              </div>
              <div className="field-column">
                <label>What relieves or worsens the pain??</label>
                <textarea
                  name="painBehavior.painAggravator"
                  onChange={handleChange}
                  className="input-field"
                  rows={6}
                />
              </div>
              <div className="radio-row">
                <span>Is the child waking up at night due to pain or discomfort??</span>
                <label>
                  <input
                    type="radio"
                    name="painBehavior.dailyActivityTrouble.anyDailyTrouble"
                    value="true"
                    onChange={handleChange}
                  />{" "}
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="painBehavior.dailyActivityTrouble.anyDailyTrouble"
                    value="false"
                    onChange={handleChange}
                  />{" "}
                  No
                </label>
              </div>
            
              <div className="field-column">
                <label>Specify location and severity</label>
                <textarea
                  name="painBehavior.associatedSymptom.details"
                  onChange={handleChange}
                  className="input-field"
                  rows={6}
                />
              </div>
           
             
            </div>

            {/* 3. Range of Motion */}
            <div className="section-box m-t-10">
              <p>General Symptoms & Warning Signs</p>
              <div className="radio-row">
                <span>Does the child have a fever?</span>
                <label>
                  <input
                    type="radio"
                    name="rangeOfMotion.affectedJoint.fullyMoveJoint"
                    value="true"
                    onChange={handleChange}
                  />{" "}
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="rangeOfMotion.affectedJoint.fullyMoveJoint"
                    value="false"
                    onChange={handleChange}
                  />{" "}
                  No
                </label>
              </div>
              <div className="radio-row">
                <span>DoeIs the child having difficulty breathing?</span>
                <label>
                  <input
                    type="radio"
                    name="rangeOfMotion.affectedJoint.fullyMoveJoint"
                    value="true"
                    onChange={handleChange}
                  />{" "}
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="rangeOfMotion.affectedJoint.fullyMoveJoint"
                    value="false"
                    onChange={handleChange}
                  />{" "}
                  No
                </label>
              </div>
              <div className="field-column">
                <label>Specify location and severity</label>
                <textarea
                  name="rangeOfMotion.affectedJoint.describeLimitation"
                  onChange={handleChange}
                  className="input-field"
                  rows={6}
                />
              </div>
              <div className="radio-row">
                <span>Has there been a loss of appetite or weight loss??</span>
                <label>
                  <input
                    type="radio"
                    name="rangeOfMotion.anySound"
                    value="true"
                    onChange={handleChange}
                  />{" "}
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="rangeOfMotion.anySound"
                    value="false"
                    onChange={handleChange}
                  />{" "}
                  No
                </label>
              </div>
              <div className="radio-row">
                <span>Is the child excessively sleepy, weak, or unresponsive?</span>
                <label>
                  <input
                    type="radio"
                    name="rangeOfMotion.affectedLimb.ableToPutWeight"
                    value="true"
                    onChange={handleChange}
                  />{" "}
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="rangeOfMotion.affectedLimb.ableToPutWeight"
                    value="false"
                    onChange={handleChange}
                  />{" "}
                  No
                </label>
              </div>
              <div className="radio-row">
                <span>Is there a rash or skin changes?</span>
                <label>
                  <input
                    type="radio"
                    name="rangeOfMotion.affectedLimb.ableToPutWeight"
                    value="true"
                    onChange={handleChange}
                  />{" "}
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="rangeOfMotion.affectedLimb.ableToPutWeight"
                    value="false"
                    onChange={handleChange}
                  />{" "}
                  No
                </label>
              </div>
              <div className="radio-row">
                <span>Any vomiting or diarrhea?</span>
                <label>
                  <input
                    type="radio"
                    name="rangeOfMotion.affectedLimb.ableToPutWeight"
                    value="true"
                    onChange={handleChange}
                  />{" "}
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="rangeOfMotion.affectedLimb.ableToPutWeight"
                    value="false"
                    onChange={handleChange}
                  />{" "}
                  No
                </label>
              </div>
              <div className="radio-row">
                <span>Does the child complain of a headache, dizziness, or vision problems??</span>
                <label>
                  <input
                    type="radio"
                    name="rangeOfMotion.affectedLimb.ableToPutWeight"
                    value="true"
                    onChange={handleChange}
                  />{" "}
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="rangeOfMotion.affectedLimb.ableToPutWeight"
                    value="false"
                    onChange={handleChange}
                  />{" "}
                  No
                </label>
              </div>

              <div className="radio-row">
                <span>Any recent falls, head injuries, or trauma?</span>
                <label>
                  <input
                    type="radio"
                    name="rangeOfMotion.affectedLimb.ableToPutWeight"
                    value="true"
                    onChange={handleChange}
                  />{" "}
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="rangeOfMotion.affectedLimb.ableToPutWeight"
                    value="false"
                    onChange={handleChange}
                  />{" "}
                  No
                </label>
              </div>
              <div className="field-column">
                <label>Describe what happened</label>
                <textarea
                  name="rangeOfMotion.affectedLimb.describeDifficult"
                  onChange={handleChange}
                  className="input-field"
                  rows={6}
                />
              </div>
             
              <div className="field-column">
                <label>Treatment Schedule</label>
                <textarea
                  name="rangeOfMotion.maintainingBalance.specifyWhen"
                  onChange={handleChange}
                  className="input-field"
                  rows={6}
                />
              </div>
            </div>

           
            <button onClick={handleSubmit} className="submit-btn">
              Submit
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Pediatrics;
