import React, { useState, useEffect } from "react";
// Fetch specialists from API

import { RiCloseFill } from "react-icons/ri";
import InputField from "../UI/InputField";
import TextArea from "../UI/TextArea";
import { post } from "../../utility/fetch";
import { get as gets } from "../../utility/fetchClinic";
import toast from "react-hot-toast";
import PatientsTable from "../tables/PatientsTable";

function ReferPatientToSpecialist({
  closeModal,
  id,
  referredPatientId,
  userId,
  clinicId,
  patient,
}) {
  const [firstName, setFirstName] = useState(patient.firstName);
  const [lastName, setLastName] = useState(patient.lastName);
  const [hospital, setHospital] = useState(patient.hospital);
  const [diagnosis, setDiagnosis] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const [isAdmitted, setIsAdmitted] = useState(false);
  const [visitStatus, setVisitStatus] = useState(patient.visitStatus);
  const [loading, setLoading] = useState(false);
  const [clinic, setClinic] = useState(
    sessionStorage.getItem("clinicId") || ""
  );
  const [specialists, setSpecialists] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedSpecialist, setSelectedSpecialist] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  const docInfo = JSON.parse(localStorage.getItem("USER_INFO"));

  const handleSubmit = async () => {
    setLoading(true);
    const payload = {
      id: 0,
      referredPatientId: patient.id || 0,
      firstName,
      lastName,
      hospital,
      diagnosis,
      recommendation,
      isAdmitted,
      userId: +selectedSpecialist || 0,
      visitStatus,
      clinicId: +clinic || 0,
      appointmentId: +localStorage.getItem("appointmentId") || 0,
      // specialistId: selectedSpecialist || null,
    };
    console.log(payload);
    if (!selectedSpecialist) {
      toast.error("Please select a specialist");
      setLoading(false);
      return;
    }
    try {
      const response = await post(`/Appointment/ReferToSpecialist`, payload);
      if (response.status === "success") {
        closeModal();
        toast.success("Patient referred to specialist successfully");
      } else {
        toast.error("Failed to refer patient to specialist");
      }
    } catch (error) {
      toast.error("Error referring patient");
      console.error(error);
    }
    setLoading(false);
  };

  const getSpecialists = async (e) => {
    try {
      const response = await gets(`/profile/list/role/${e}`, {});
      setSpecialists(response?.resultList || []);
      console.log("Specialists:", response?.resultList);
    } catch (error) {
      console.error("Error fetching specialists:", error);
    }
  };

  const getRoles = async () => {
    try {
      const response = await gets("/role/list/1/300", {});
      setRoles(response?.resultList || []);
      console.log("Roles:", response?.resultList);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  useEffect(() => {
    getRoles();
    // getSpecialists();
  }, []);

  return (
    <div className="overlay">
      <RiCloseFill className="close-btn pointer" onClick={closeModal} />
      <div className="modal-box max-w-800">
        <div className="p-40">
          <h3 className="bold-text">Refer Patient to Specialist</h3>
          <div className="m-t-20 flex gap-8 flex-col">
            <InputField
              label="First Name"
              name="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <InputField
              label="Last Name"
              name="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />

            <div className="w-100 m-t-20 flex">
              <label htmlFor="admission" className="label">
                Select Role
              </label>
              <select
                id="Roles-select"
                className="input-field"
                value={selectedRole}
                onChange={(e) => {
                  getSpecialists(e.target.value);
                  setSelectedRole(e.target.value);
                }}
              >
                <option value="">-- Select Role --</option>
                {roles.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                    {/* {s.firstName} {s.lastName} ({s.email}) */}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-100 m-t-20 flex">
              <label htmlFor="admission" className="label">
                Select Specialist
              </label>
              <select
                id="specialist-select"
                className="input-field"
                value={selectedSpecialist}
                onChange={(e) => setSelectedSpecialist(e.target.value)}
              >
                <option value="">-- Select Specialist --</option>
                {specialists.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title ? s.title + " " : ""}
                    {s.firstName} {s.lastName} ({s.email})
                  </option>
                ))}
              </select>
            </div>

            {/* <div>
              <label htmlFor="specialist-select">Select Specialist</label>
              <select
                id="specialist-select"
                className="input-field"
                value={selectedSpecialist}
                onChange={(e) => setSelectedSpecialist(e.target.value)}
              >
               
              </select>
            </div> */}
            {/* <InputField
              label="Hospital"
              name="hospital"
              value={hospital}
              onChange={(e) => setHospital(e.target.value)}
            /> */}
            <TextArea
              label="Diagnosis"
              name="diagnosis"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
            />
            <TextArea
              label="Recommendation"
              name="recommendation"
              value={recommendation}
              onChange={(e) => setRecommendation(e.target.value)}
            />
            <div className="flex items-center gap-8">
              <label>
                <input
                  type="checkbox"
                  checked={isAdmitted}
                  onChange={(e) => setIsAdmitted(e.target.checked)}
                />
                &nbsp;Is Admitted
              </label>
            </div>
            {/* <InputField
              label="Visit Status"
              name="visitStatus"
              value={visitStatus}
              onChange={(e) => setVisitStatus(e.target.value)}
            /> */}
            {/* <InputField
              label="Clinic ID"
              name="clinicId"
              value={clinic}
              onChange={(e) => setClinic(e.target.value)}
              type="number"
            /> */}
          </div>
          <button
            className="btn m-t-20 w-100"
            onClick={handleSubmit}
            disabled={loading}
          >
            Refer Patient to Specialist
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReferPatientToSpecialist;
