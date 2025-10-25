import React, { useEffect, useState } from "react";
import "./FamilyConsultation.css";
import { useNavigate, useParams } from "react-router-dom";
import { get, post } from "../../../utility/fetch";
import { FiArrowLeft } from "react-icons/fi";
import VitalsRecords from "../../modals/VitalsRecord";
import GhostTextCompletion from "../../UI/TextPrediction";

const FamilyConsultation = () => {
  const [formData, setFormData] = useState({});
  const [vitals, setvitals] = useState([]);
  const [investigationArray, setInvestigationArray] = useState([]);

  const docInfo = JSON.parse(localStorage.getItem("USER_INFO"));

  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    console.log(name);
    console.log(value);

    if (type === "checkbox") {
      console.log(checked);
    }
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  useEffect(() => {
    fetchTreatmentVitalsRecord();
  }, []);

  const deliveryTypes = {
    1: "Normal",
    2: "C-Section",
    3: "Assisted",
  };

  const investigations = [
    { name: "FBC", id: 1 },
    { name: "PT", id: 2 },
    { name: "LFT", id: 3 },
    { name: "EUC", id: 4 },
    { name: "RBS", id: 5 },
  ];

  const plans = {
    1: "IUCD",
    2: "Pills",
    3: "Injectable-two months",
    4: "Injectable-three months",
    5: "Implant",
  };

  const { patientId } = useParams();

  const fetchTreatmentVitalsRecord = async () => {
    try {
      const response = await get(
        `/patients/vital-by-appointmentId?appointmentId=${+localStorage.getItem(
          "appointmentId"
        )}&pageIndex=1&pageSize=10`
      );
      if (response?.data) {
        setvitals(response.data);
      } else {
        console.error("Failed to fetch vitals: No data in response");
      }
    } catch (error) {
      console.error("Failed to fetch record:", error);
    }
  };

  const handleSubmit = async (e) => {
    const str = (v) => v ?? "";
    const num = (v) => (v !== undefined && v !== "" ? Number(v) : 0);
    const bool = (v) =>
      v === true || v === "true" || v === "Yes" ? true : false;

    e.preventDefault();
    // Ensure lastConfinement is not beyond today and format as ISO datetime

    const toISODateTime = (dateStr) => {
      const today = new Date();
      // If missing, use today
      if (!dateStr) return today.toISOString();
      // If already has time, just return ISO
      if (dateStr.length > 10) return new Date(dateStr).toISOString();
      // If only date, append T00:00:00
      return new Date(dateStr + "T00:00:00").toISOString();
    };
    const today = new Date();
    // lastConfinement
    let lastConfinementValue = str(formData.lastConfinement);
    if (lastConfinementValue) {
      const inputDate = new Date(lastConfinementValue);
      if (inputDate > today) {
        lastConfinementValue = today.toISOString().slice(0, 10);
      }
    }
    lastConfinementValue = toISODateTime(lastConfinementValue);
    // dateCommence
    let dateCommenceValue = str(formData.dateCommence);
    dateCommenceValue = toISODateTime(dateCommenceValue);
    // dateExpired
    let dateExpiredValue = str(formData.dateExpired);
    dateExpiredValue = toISODateTime(dateExpiredValue);

    const payload = {
      patientId: num(patientId),
      lastConfinement: lastConfinementValue,
      deliveryType: num(formData.deliveryType),
      deliveryComplications: bool(formData.deliveryComplications),
      details: str(formData.details),
      breastFeeding: bool(formData.breastFeeding),
      menstrualResumed: bool(formData.menstrualResumption),
      familyMedicineInvestigations: investigationArray.map((item) => ({
        investigation: num(item.id),
      })),
      familyPlanMethod: num(formData.familyPlanMethod),
      dateCommence: dateCommenceValue,
      dateExpired: dateExpiredValue,
      appointmentId: num(localStorage.getItem("appointmentId")),
      instructions: str(formData.instructions),
      remarks: str(formData.remark),
      doctorId: num(docInfo?.employeeId),
      consent: bool(formData.consent),
      familyMedicineDocuments: [
        {
          docName: "string",
          docPath: "string",
        },
      ],
      // Add any additional required fields with strict defaults here
      patientComplaint: str(formData.patientComplaint),
      history: str(formData.history),
      physicalExamination: str(formData.physicalExamination),
      diagnosis: str(formData.diagnosis),
      investigation: str(formData.investigation),
    };

    console.log("Mapped Payload:", payload);

    try {
      const response = await post("/FamilyMedicine", payload);
      console.log(response);

      if (response?.isSuccess) {
        // navigate(`/doctor/patients/family-medcine/${patientId}`)

        // navigate(`/doctor/patients/patient-details/${patientId}`);

        navigate(
          `/doctor/patients/family-medcine-treatment/${patientId}/?treatmentId=${response?.data?.familyMedicineId}`
        );
      } else {
        console.error("Submission failed: Response not successful");
      }
    } catch (error) {
      console.error("Submission failed:", error);
    }
  };

  return (
    <div style={{ padding: "60px 0px" }} className="consultation-container">
      <div class="flex" style={{ padding: "20px", cursor: "pointer" }}>
        <FiArrowLeft />
        <p onClick={() => navigate(-1)}> Back</p>
      </div>
      <div class="w-100">
        <h2 style={{ textAlign: "center" }} className="w-70">
          Family Planning
        </h2>
        <Accordion title="Examination">
          <div className="field-column new">
            <label>Patient Complaint</label>
            <textarea
              name="patientComplaint"
              placeholder="Patient"
              value={formData.patientComplaint}
              onChange={handleChange}
              rows={3}
            />
          </div>
          <div className="field-column new">
            <label>History</label>
            <textarea
              name="history"
              placeholder="Patient"
              value={formData.history}
              onChange={handleChange}
              rows={3}
            />
          </div>
          <div className="field-column new">
            <label>Physical Examination</label>
            <textarea
              name="physicalExamination"
              placeholder="Patient"
              value={formData.physicalExamination}
              onChange={handleChange}
              rows={3}
            />
          </div>
          <div className="field-column new">
            <label>Diagnosis</label>
            <textarea
              name="diagnosis"
              placeholder="Patient"
              value={formData.diagnosis}
              onChange={handleChange}
              rows={3}
            />
          </div>
        </Accordion>
        <Accordion title="Questionaire">
          <main className="consultation-main">
            <form className="consultation-form">
              <div className="input-row">
                <div class="flex-row-gap">
                  <div className="field-row">
                    <label htmlFor="lastConfinement">Last confinement</label>
                    <input
                      id="lastConfinement"
                      name="lastConfinement"
                      onChange={handleChange}
                      type="date"
                      className="input-field"
                    />
                  </div>
                </div>
                <div className="group-box">
                  <label>Type Of Delivery</label>
                  <div className="group-options">
                    {["Normal", "C-section", "Assisted"].map((opt, index) => (
                      <label key={opt}>
                        <input
                          type="radio"
                          name="deliveryType"
                          value={index + 1}
                          onChange={handleChange}
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>
                {/* <div className="field-row">
                <label htmlFor="deliveryType">Type of delivery</label>
                <input
                  id="deliveryType"
                  name="deliveryType"
                  onChange={handleChange}
                  type="text"
                  className="input-field"
                />
              </div> */}
              </div>
              <div className="radio-row">
                <span>Delivery Complications?</span>
                <label>
                  <input
                    type="radio"
                    name="deliveryComplications"
                    value="Yes"
                    onChange={handleChange}
                  />{" "}
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="deliveryComplications"
                    value="No"
                    onChange={handleChange}
                  />{" "}
                  No
                </label>
              </div>
              <div className="field-column">
                <label htmlFor="details">Provide Details</label>
                <GhostTextCompletion
                  // label="Patient Diagnosis"
                  name="details"
                  value={formData.details}
                  handleChange={
                    handleChange
                    // setFormData({ details: e.target.value });
                    // setRepeatedDiagnosis(e.target.value);
                  }
                  none={true}
                />
                {/* <textarea
                id="details"
                name="details"
                onChange={handleChange}
                className="textarea-field"
              ></textarea> */}
              </div>
              <div className="radio-row">
                <span>Breast feeding?</span>
                <label>
                  <input
                    type="radio"
                    name="breastFeeding"
                    value="Yes"
                    onChange={handleChange}
                  />{" "}
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="breastFeeding"
                    value="No"
                    onChange={handleChange}
                  />{" "}
                  No
                </label>
                <span>Menstrual resumption?</span>
                <label>
                  <input
                    type="radio"
                    name="menstrualResumption"
                    value="Yes"
                    onChange={handleChange}
                  />{" "}
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="menstrualResumption"
                    value="No"
                    onChange={handleChange}
                  />{" "}
                  No
                </label>
              </div>
              <div className="input-row">
                <div className="group-box">
                  <label>Investigation</label>
                  <div className="group-box">
                    <div className="group-options">
                      {investigations.map((opt) => (
                        <label key={opt.name}>
                          <input
                            type="checkbox"
                            name="investigation"
                            value={opt.name}
                            checked={investigationArray.some(
                              (item) => item.name === opt.name
                            )}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setInvestigationArray((prev) => [...prev, opt]);
                              } else {
                                setInvestigationArray((prev) =>
                                  prev.filter((item) => item.name !== opt.name)
                                );
                              }
                            }}
                          />{" "}
                          {opt.name}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="group-box">
                  <label>Family Plan Methods</label>
                  <div className="group-options">
                    {[
                      { name: "IUCD", id: 1 },
                      { name: "Pills", id: 2 },
                      { name: "Injectable-two months", id: 3 },
                      { name: "Injectable-three months", id: 4 },
                      { name: "Implant", id: 5 },
                    ].map((opt) => (
                      <label key={opt.id}>
                        <input
                          type="radio"
                          name="familyPlanMethod"
                          value={opt.id}
                          onChange={handleChange}
                        />{" "}
                        {opt.name}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="radio-row">
                <span>Consent</span>
                <label>
                  <input
                    type="radio"
                    name="consent"
                    value="Yes"
                    onChange={handleChange}
                  />{" "}
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="consent"
                    value="No"
                    onChange={handleChange}
                  />{" "}
                  No
                </label>
              </div>
              <div className="input-row">
                <div className="field-row">
                  <label htmlFor="dateCommence">Date commence</label>
                  <input
                    id="dateCommence"
                    name="dateCommence"
                    onChange={handleChange}
                    type="date"
                    className="input-field"
                  />
                </div>
                <div className="field-row">
                  <label htmlFor="lastConfinement">Date Expired</label>
                  <input
                    id="dateExpired"
                    name="dateExpired"
                    onChange={handleChange}
                    type="date"
                    className="input-field"
                  />
                </div>
                {/* <div className="field-row">
                <label htmlFor="nextVisit">Next visit</label>
                <input
                  id="nextVisit"
                  name="nextVisit"
                  onChange={handleChange}
                  type="text"
                  className="input-field"
                />
              </div> */}
              </div>
              <div className="field-column">
                <label htmlFor="instructions">Instructions</label>
                <GhostTextCompletion
                  // label="Patient Diagnosis"
                  name="instructions"
                  value={formData.instructions}
                  handleChange={handleChange}
                  none={true}
                />
                {/* <textarea
                id="instructions"
                name="instructions"
                onChange={handleChange}
                className="textarea-field"
              ></textarea> */}
              </div>
              <div className="field-column">
                <label htmlFor="remark">Remark</label>
                <GhostTextCompletion
                  // label="Patient Diagnosis"
                  name="remark"
                  value={formData.remark}
                  handleChange={handleChange}
                  none={true}
                />
                {/* <textarea
                id="remark"
                name="remark"
                onChange={handleChange}
                className="textarea-field"
              ></textarea> */}
              </div>
              {/* <div className="upload-box">Attach documents</div> */}
            </form>
            <VitalsRecords vitals={vitals} />
          </main>
        </Accordion>
        <div className="action-row">
          {/* <button type="button" className="btn grey">
                Preview Record
              </button> */}
          <button onClick={handleSubmit} className="btn green">
            Submit Record
          </button>
        </div>
      </div>
    </div>
  );
};

export default FamilyConsultation;
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
