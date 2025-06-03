import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { get, post } from "../../../utility/fetch";
import { FiArrowLeft } from "react-icons/fi";
import VitalsRecords from "../../modals/VitalsRecord";
import GhostTextCompletion from "../../UI/TextPrediction";
import "./Pediatrics.css";

const Pediatrics = () => {
  const [formData, setFormData] = useState({
    patientId: 0,
    generalInformation: {
      medicalHistory: {
        anyMedicalConditions: false,
        details: ""
      },
      currentMedication: {
        anyCurrentMedications: false,
        details: ""
      }
    },
    symptomAnalysis: {
      symptomStatus: 1,
      symptomsStartedWhen: "",
      triggeringEvent: {
        anyTriggeringEvent: false,
        details: ""
      }
    },
    painAssessment: {
      childPain: {
        anyPain: false,
        specifyLocationAndSeverity: "",
        describeThePain: ""
      },
      severityLevel: 0,
      painRelieverAggravator: "",
      childAtNight: {
        anyWakingUpDueToDiscomfort: false,
        specifyLocationAndSeverity: ""
      }
    },
    warningSign: {
      childFever: {
        runningFever: false,
        temperature: 0
      },
      childBreathing: {
        anyDifficulty: false,
        describe: ""
      },
      anyAppetiteWeightLoss: false,
      excessiveSleepWeakUnresponsive: false,
      anyRashSkinChange: false,
      anyVomitingDiarrhea: false,
      anyHeadacheDizzinessVisionProblem: false,
      recentEvent: {
        antFallsHeadInjuryTrauma: false,
        describe: ""
      }
    },
    treatmentSchedule: "",
    appointmentId: 0,
    doctorId: 0
  });

  const [vitals, setVitals] = useState([]);
  const { patientId } = useParams();
  const navigate = useNavigate();
  const docId = sessionStorage.getItem("userId");

  useEffect(() => {
    fetchVitals();
  }, []);

  const fetchVitals = async () => {
    try {
      const response = await get(
        `/patients/vital-by-appointmentId?appointmentId=${localStorage.getItem("appointmentId")}&pageIndex=1&pageSize=10`
      );
      if (response?.data) {
        setVitals(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch vitals:", error);
    }
  };

  const handleChange = (section, subsection, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section]?.[subsection],
          [field]: value
        }
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const payload = {
      ...formData,
      patientId: parseInt(patientId),
      appointmentId: parseInt(localStorage.getItem("appointmentId")),
      doctorId: parseInt(docId)
    };

    try {
      const response = await post("/Pediatric", payload);
      if (response?.isSuccess) {
        navigate(`/doctor/patients/patient-details/${patientId}`);
      }
    } catch (error) {
      console.error("Submission failed:", error);
    }
  };

  return (
    <div className="consultation-container">
      <div className="flex" style={{ padding: "20px" }}>
        <FiArrowLeft />
        <p onClick={() => navigate(-1)}> Back</p>
      </div>

      <main className="consultation-main">
        <form className="consultation-form" onSubmit={handleSubmit}>
          {/* General Information Section */}
          <section className="form-section">
            <h3>General Information</h3>
            
            <div className="field-group">
              <label>
                <input
                  type="checkbox"
                  checked={formData.generalInformation.medicalHistory.anyMedicalConditions}
                  onChange={(e) => handleChange('generalInformation', 'medicalHistory', 'anyMedicalConditions', e.target.checked)}
                />
                Any Medical Conditions
              </label>
              {formData.generalInformation.medicalHistory.anyMedicalConditions && (
                <GhostTextCompletion
                  name="medicalHistoryDetails"
                  value={formData.generalInformation.medicalHistory.details}
                  handleChange={(e) => handleChange('generalInformation', 'medicalHistory', 'details', e.target.value)}
                  none={true}
                />
              )}
            </div>

            <div className="field-group">
              <label>
                <input
                  type="checkbox"
                  checked={formData.generalInformation.currentMedication.anyCurrentMedications}
                  onChange={(e) => handleChange('generalInformation', 'currentMedication', 'anyCurrentMedications', e.target.checked)}
                />
                Currently on any Medications
              </label>
              {formData.generalInformation.currentMedication.anyCurrentMedications && (
                <GhostTextCompletion
                  name="currentMedicationDetails"
                  value={formData.generalInformation.currentMedication.details}
                  handleChange={(e) => handleChange('generalInformation', 'currentMedication', 'details', e.target.value)}
                  none={true}
                />
              )}
            </div>
          </section>

          {/* Symptom Analysis Section */}
          <section className="form-section">
            <h3>Symptom Analysis</h3>
            
            <div className="field-group">
              <label>When did the symptoms start?</label>
              <input
                type="text"
                value={formData.symptomAnalysis.symptomsStartedWhen}
                onChange={(e) => handleChange('symptomAnalysis', '', 'symptomsStartedWhen', e.target.value)}
                className="input-field"
              />
            </div>

            <div className="field-group">
              <label>Symptom status?</label>
              <select
                value={formData.symptomAnalysis.symptomStatus}
                onChange={(e) => handleChange('symptomAnalysis', '', 'symptomStatus', e.target.value)}
                className="input-field"
              >
                <option value={1}>Mild</option>
                <option value={2}>Moderate</option>
                <option value={3}>Severe</option>
              </select>
            </div>

            <div className="field-group">
              <label>
                <input
                  type="checkbox"
                  checked={formData.symptomAnalysis.triggeringEvent.anyTriggeringEvent}
                  onChange={(e) => handleChange('symptomAnalysis', 'triggeringEvent', 'anyTriggeringEvent', e.target.checked)}
                />
                Was there any triggering event (injury, exposure, food, activity)?
              </label>
              {formData.symptomAnalysis.triggeringEvent.anyTriggeringEvent && (
                <GhostTextCompletion
                  name="triggeringEventDetails"
                  value={formData.symptomAnalysis.triggeringEvent.details}
                  handleChange={(e) => handleChange('symptomAnalysis', 'triggeringEvent', 'details', e.target.value)}
                  none={true}
                />
              )}
            </div>
          </section>

          {/* Pain Assessment Section */}
          <section className="form-section">
            <h3>Pain & Discomfort Assessment</h3>
            
            <div className="field-group">
              <label>Is the child in pain?</label>
              <label>
                <input
                  type="radio"
                  name="anyPain"
                  checked={formData.painAssessment.childPain.anyPain === true}
                  onChange={() => handleChange('painAssessment', 'childPain', 'anyPain', true)}
                />
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  name="anyPain"
                  checked={formData.painAssessment.childPain.anyPain === false}
                  onChange={() => handleChange('painAssessment', 'childPain', 'anyPain', false)}
                />
                No
              </label>
            </div>
            {formData.painAssessment.childPain.anyPain && (
              <>
                <div className="field-group">
                  <label>Specify location and severity</label>
                  <textarea
                    name="specifyLocationAndSeverity"
                    value={formData.painAssessment.childPain.specifyLocationAndSeverity}
                    onChange={(e) => handleChange('painAssessment', 'childPain', 'specifyLocationAndSeverity', e.target.value)}
                    className="input-field"
                    rows={4}
                  />
                </div>
                <div className="field-group">
                  <label>How would you describe the pain?</label>
                  <textarea
                    name="describeThePain"
                    value={formData.painAssessment.childPain.describeThePain}
                    onChange={(e) => handleChange('painAssessment', 'childPain', 'describeThePain', e.target.value)}
                    className="input-field"
                    rows={4}
                  />
                </div>
                <div className="field-group">
                  <label>What relieves or worsens the pain?</label>
                  <textarea
                    name="painRelieverAggravator"
                    value={formData.painAssessment.painRelieverAggravator}
                    onChange={(e) => handleChange('painAssessment', '', 'painRelieverAggravator', e.target.value)}
                    className="input-field"
                    rows={4}
                  />
                </div>
                <div className="field-group">
                  <label>Is the child waking up at night due to pain or discomfort?</label>
                  <label>
                    <input
                      type="radio"
                      name="anyWakingUpDueToDiscomfort"
                      checked={formData.painAssessment.childAtNight.anyWakingUpDueToDiscomfort === true}
                      onChange={() => handleChange('painAssessment', 'childAtNight', 'anyWakingUpDueToDiscomfort', true)}
                    />
                    Yes
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="anyWakingUpDueToDiscomfort"
                      checked={formData.painAssessment.childAtNight.anyWakingUpDueToDiscomfort === false}
                      onChange={() => handleChange('painAssessment', 'childAtNight', 'anyWakingUpDueToDiscomfort', false)}
                    />
                    No
                  </label>
                </div>
                {formData.painAssessment.childAtNight.anyWakingUpDueToDiscomfort && (
                  <div className="field-group">
                    <label>Specify location and severity</label>
                    <textarea
                      name="nightPainLocationSeverity"
                      value={formData.painAssessment.childAtNight.specifyLocationAndSeverity}
                      onChange={(e) => handleChange('painAssessment', 'childAtNight', 'specifyLocationAndSeverity', e.target.value)}
                      className="input-field"
                      rows={4}
                    />
                  </div>
                )}
              </>
            )}
          </section>

          {/* Warning Signs Section */}
          <section className="form-section">
            <h3>General Symptoms & Warning Signs</h3>
            
            <div className="field-group">
              <label>Does the child have a fever?</label>
              <label>
                <input
                  type="radio"
                  name="runningFever"
                  checked={formData.warningSign.childFever.runningFever === true}
                  onChange={() => handleChange('warningSign', 'childFever', 'runningFever', true)}
                />
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  name="runningFever"
                  checked={formData.warningSign.childFever.runningFever === false}
                  onChange={() => handleChange('warningSign', 'childFever', 'runningFever', false)}
                />
                No
              </label>
            </div>
            {formData.warningSign.childFever.runningFever && (
              <div className="field-group">
                <label>Temperature</label>
                <input
                  type="number"
                  value={formData.warningSign.childFever.temperature}
                  onChange={(e) => handleChange('warningSign', 'childFever', 'temperature', e.target.value)}
                  className="input-field"
                />
              </div>
            )}

            <div className="field-group">
              <label>Is the child having difficulty breathing?</label>
              <label>
                <input
                  type="radio"
                  name="anyDifficulty"
                  checked={formData.warningSign.childBreathing.anyDifficulty === true}
                  onChange={() => handleChange('warningSign', 'childBreathing', 'anyDifficulty', true)}
                />
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  name="anyDifficulty"
                  checked={formData.warningSign.childBreathing.anyDifficulty === false}
                  onChange={() => handleChange('warningSign', 'childBreathing', 'anyDifficulty', false)}
                />
                No
              </label>
            </div>
            {formData.warningSign.childBreathing.anyDifficulty && (
              <div className="field-group">
                <label>Describe the breathing difficulty</label>
                <textarea
                  name="breathingDifficultyDescription"
                  value={formData.warningSign.childBreathing.describe}
                  onChange={(e) => handleChange('warningSign', 'childBreathing', 'describe', e.target.value)}
                  className="input-field"
                  rows={4}
                />
              </div>
            )}

            <div className="field-group">
              <label>Has there been a loss of appetite or weight loss?</label>
              <label>
                <input
                  type="radio"
                  name="anyAppetiteWeightLoss"
                  checked={formData.warningSign.anyAppetiteWeightLoss === true}
                  onChange={() => handleChange('warningSign', '', 'anyAppetiteWeightLoss', true)}
                />
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  name="anyAppetiteWeightLoss"
                  checked={formData.warningSign.anyAppetiteWeightLoss === false}
                  onChange={() => handleChange('warningSign', '', 'anyAppetiteWeightLoss', false)}
                />
                No
              </label>
            </div>

            <div className="field-group">
              <label>Is the child excessively sleepy, weak, or unresponsive?</label>
              <label>
                <input
                  type="radio"
                  name="excessiveSleepWeakUnresponsive"
                  checked={formData.warningSign.excessiveSleepWeakUnresponsive === true}
                  onChange={() => handleChange('warningSign', '', 'excessiveSleepWeakUnresponsive', true)}
                />
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  name="excessiveSleepWeakUnresponsive"
                  checked={formData.warningSign.excessiveSleepWeakUnresponsive === false}
                  onChange={() => handleChange('warningSign', '', 'excessiveSleepWeakUnresponsive', false)}
                />
                No
              </label>
            </div>

            <div className="field-group">
              <label>Is there a rash or skin changes?</label>
              <label>
                <input
                  type="radio"
                  name="anyRashSkinChange"
                  checked={formData.warningSign.anyRashSkinChange === true}
                  onChange={() => handleChange('warningSign', '', 'anyRashSkinChange', true)}
                />
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  name="anyRashSkinChange"
                  checked={formData.warningSign.anyRashSkinChange === false}
                  onChange={() => handleChange('warningSign', '', 'anyRashSkinChange', false)}
                />
                No
              </label>
            </div>

            <div className="field-group">
              <label>Any vomiting or diarrhea?</label>
              <label>
                <input
                  type="radio"
                  name="anyVomitingDiarrhea"
                  checked={formData.warningSign.anyVomitingDiarrhea === true}
                  onChange={() => handleChange('warningSign', '', 'anyVomitingDiarrhea', true)}
                />
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  name="anyVomitingDiarrhea"
                  checked={formData.warningSign.anyVomitingDiarrhea === false}
                  onChange={() => handleChange('warningSign', '', 'anyVomitingDiarrhea', false)}
                />
                No
              </label>
            </div>

            <div className="field-group">
              <label>Does the child complain of a headache, dizziness, or vision problems?</label>
              <label>
                <input
                  type="radio"
                  name="anyHeadacheDizzinessVisionProblem"
                  checked={formData.warningSign.anyHeadacheDizzinessVisionProblem === true}
                  onChange={() => handleChange('warningSign', '', 'anyHeadacheDizzinessVisionProblem', true)}
                />
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  name="anyHeadacheDizzinessVisionProblem"
                  checked={formData.warningSign.anyHeadacheDizzinessVisionProblem === false}
                  onChange={() => handleChange('warningSign', '', 'anyHeadacheDizzinessVisionProblem', false)}
                />
                No
              </label>
            </div>

            <div className="field-group">
              <label>Any recent falls, head injuries, or trauma?</label>
              <label>
                <input
                  type="radio"
                  name="antFallsHeadInjuryTrauma"
                  checked={formData.warningSign.recentEvent.antFallsHeadInjuryTrauma === true}
                  onChange={() => handleChange('warningSign', 'recentEvent', 'antFallsHeadInjuryTrauma', true)}
                />
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  name="antFallsHeadInjuryTrauma"
                  checked={formData.warningSign.recentEvent.antFallsHeadInjuryTrauma === false}
                  onChange={() => handleChange('warningSign', 'recentEvent', 'antFallsHeadInjuryTrauma', false)}
                />
                No
              </label>
            </div>
            {formData.warningSign.recentEvent.antFallsHeadInjuryTrauma && (
              <div className="field-group">
                <label>Describe the event</label>
                <textarea
                  name="recentEventDescription"
                  value={formData.warningSign.recentEvent.describe}
                  onChange={(e) => handleChange('warningSign', 'recentEvent', 'describe', e.target.value)}
                  className="input-field"
                  rows={4}
                />
              </div>
            )}
          </section>

          {/* Treatment Schedule Section */}
          <section className="form-section">
            <h3>Treatment Schedule</h3>
            
            <div className="field-group">
              <label>Treatment Schedule</label>
              <GhostTextCompletion
                name="treatmentSchedule"
                value={formData.treatmentSchedule}
                handleChange={(e) => setFormData(prev => ({...prev, treatmentSchedule: e.target.value}))}
                none={true}
              />
            </div>
          </section>

          <div className="action-row">
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

export default Pediatrics;
