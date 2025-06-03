import { BellRingIcon } from "lucide-react";
import React, { useState } from "react";
import { RiCloseFill } from "react-icons/ri";
import { post } from "../../utility/fetch";
import InputField from "../UI/InputField";
import TextArea from "../UI/TextArea";
import toast from "react-hot-toast";
import SpeechToTextButton from "../UI/SpeechToTextButton";
import GhostTextCompletion from "../UI/TextPrediction";

const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}/${month}/${day}`;
};

function ImmunizationAttachment({ closeModal, data }) {
  const [isEditable, setIsEditable] = useState(false);
  const [appointDate, setAppointDate] = useState(formatDate(data.appointDate));
  const [appointTime, setAppointTime] = useState(data.appointTime);
  const [description, setDescription] = useState(data.description);
  const [notes, setNotes] = useState("");
  const [visitTracking, setVisitTracking] = useState(data.tracking);
  const [isloading, setIsLoading] = useState(false);

  const handleEditClick = () => {
    setIsEditable(true);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const requestBody = {
      id: data.id,
      appointDate: appointDate.split("-").join("/"),
      appointTime,
      description,
      doctorEmployeeId: data.doctorId,
      nurseEmployeeId: data.nurseId,
      isAdmitted: true,
      patientId: data.patientId,
    };
    console.log(requestBody);
    try {
      const response = await post(
        "/Appointment/update-appointment",
        requestBody
      );

      toast.success("Appointment updated successfully");
      closeModal();
    } catch (error) {
      toast.error("Error updating appointment");
      console.error("Error updating appointment:", error);
    }

    setIsLoading(false);
  };


  const handleTranscript = (transcript) => {
    setNotes(notes + transcript)
  };

  return (
    <div className="overlay">
      <RiCloseFill className="close-btn pointer" onClick={closeModal} />
      <div className="appointmentModal">
        <div className="apointmentHeader">
          <div className="bellContainer">
            <BellRingIcon />
          </div>
          <h2>{`Hello Dr ${data.doctor ? data.doctor : ""}`}</h2>
          <h3>{`Appointment Reminder for ${data.patientName}`}</h3>
          <div>
            <InputField
              label="Description"
              type="input"
              value={description}
              disabled={true}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <InputField
              label="Schedule Date"
              type="date"
              value={appointDate}
              disabled={!isEditable}
              onChange={(e) => {
                const newDate = new Date(e.target.value);
                const year = newDate.getFullYear();
                const month = String(newDate.getMonth() + 1).padStart(2, "0");
                const day = String(newDate.getDate()).padStart(2, "0");
                setAppointDate(`${year}-${month}-${day}`);
              }}
            />
            <InputField
              label="Schedule Time"
              type="time"
              value={appointTime}
              disabled={!isEditable}
              onChange={(e) => setAppointTime(e.target.value)}
            />
          </div>
          <div>
            {!isEditable &&<TextArea
              label="Additional Notes Diagnosis"
              type="text"
              value={notes}
              // disabled={true}
              disabled={!isEditable}
              onChange={(e) => setNotes(e.target.value)}
            />}


            {
              isEditable &&
              <GhostTextCompletion
                label="Additional Note Diagnosis"
                value={notes}
                handleChange={(e) => setNotes(e.target.value)}
              />
            }

          </div>

          {!isEditable ? (
            <button
              className="appointmentButton pointer"
              onClick={handleEditClick}
            >
              Re-schedule Appointment
            </button>
          ) : (
            <button
              className="appointmentButton pointer"
              disabled={isloading}
              onClick={handleSubmit}
            >
              Update Appointment
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ImmunizationAttachment;
