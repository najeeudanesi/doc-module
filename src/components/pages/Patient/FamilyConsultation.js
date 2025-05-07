import React, { useEffect, useState } from "react";
import "./FamilyConsultation.css";
import { useNavigate, useParams } from "react-router-dom";
import { get, post } from "../../../utility/fetch";
import { FiArrowLeft } from "react-icons/fi";
import VitalsRecords from "../../modals/VitalsRecord";

const FamilyConsultation = () => {
  const [formData, setFormData] = useState({});
  const [vitals, setvitals] = useState([]);
  const [investigationArray, setInvestigationArray] = useState([]);

  const docInfo = JSON.parse(localStorage.getItem("USER_INFO"));

  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

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
    e.preventDefault();
    const payload = {
      patientId: parseInt(patientId),
      lastConfinement: formData.lastConfinement || null,
      deliveryType: +formData.deliveryType || null,
      deliveryComplications: formData.deliveryComplications === "Yes",
      details: formData.details || "",
      breastFeeding: formData.breastFeeding === "Yes",
      menstrualResumed: formData.menstrualResumption === "Yes",
      familyMedicineInvestigations: investigationArray.map((item) => ({
        investigation: item.id,
      })),
      familyPlanMethod: +formData.familyPlanMethod || null,
      dateCommence: formData.dateCommence || null,
      appointmentId: +localStorage.getItem("appointmentId"),
      instructions: formData.instructions || "",
      remarks: formData.remark || "",
      doctorId: docInfo?.employeeId || 0,
      consent: formData.consent === "Yes",
      familyMedicineDocuments: [
        {
          docName: "string",
          docPath: "string",
        },
      ],
    };

    console.log("Mapped Payload:", payload);

    try {
      const response = await post("/FamilyMedicine", payload);
      if (response?.isSuccess) {
        navigate(`/doctor/patients/patient-details/${patientId}`);
      } else {
        console.error("Submission failed: Response not successful");
      }
    } catch (error) {
      console.error("Submission failed:", error);
    }
  };

  return (
    <div style={{ padding: "60px 0px" }} className="consultation-container">
      <div class="flex" style={{ padding: "20px" }}>
        <FiArrowLeft />
        <p onClick={() => navigate(-1)}> Back</p>
      </div>
      <main className="consultation-main">
        <form className="consultation-form" onSubmit={handleSubmit}>
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
                    />{" "}
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
            <textarea
              id="details"
              name="details"
              onChange={handleChange}
              className="textarea-field"
            ></textarea>
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
            <textarea
              id="instructions"
              name="instructions"
              onChange={handleChange}
              className="textarea-field"
            ></textarea>
          </div>

          <div className="field-column">
            <label htmlFor="remark">Remark</label>
            <textarea
              id="remark"
              name="remark"
              onChange={handleChange}
              className="textarea-field"
            ></textarea>
          </div>

          {/* <div className="upload-box">Attach documents</div> */}

          <div className="action-row">
            {/* <button type="button" className="btn grey">
              Preview Record
            </button> */}
            <button type="submit" className="btn green">
              Submit Record
            </button>
          </div>
        </form>

        <VitalsRecords vitals={vitals} />
      </main>
    </div>
  );
};

export default FamilyConsultation;
