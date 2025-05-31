import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { get } from "../../utility/fetch";
import { calculateAge } from "../../utility/general";
import moment from "moment";

const VitalsRecords = ({ vitals = [], viewMode = true }) => {
  const { patientId } = useParams();
  const [patient, setPatient] = React.useState(null);
  // const [viewMode, setViewMode] = useState(true);

  const getPatientDetails = async () => {
    // setLoading(true);
    try {
      const data = await get(`/patients/${patientId}/data`);
      setPatient(data);
      console.log(data);
      console.log(data?.id);

      // setVisit(data?.visits?.pop());
    } catch (e) {
      console.log(e);
    }
    // setLoading(false);
  };

  useEffect(() => {
    getPatientDetails();
  }, []);

  console.log("Vitals Records:", vitals);
  return (
    <aside className="sidebar">
      <div>
        <div
          style={{ display: "flex", flexDirection: "column", gap: "5px" }}
          className=""
        >
          <div className="">
            <strong>Patient:</strong> {patient?.firstName} {patient?.lastName}
          </div>
          <div className="">
            <strong>Age:</strong> {calculateAge(patient?.dateOfBirth)} years
          </div>
          <div className="">
            <strong>Sex:</strong> {patient?.gender}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg w-full max-w-6xl p-6 m-t-10 relative overflow-auto max-h-[90vh]">
          <h2 className="text-xl font-bold mb-4">Vitals Records</h2>

          {vitals.length === 0 ? (
            <p className="text-gray-500">No vitals recorded.</p>
          ) : viewMode ? (
            vitals.map((v, i) => (
              <div
                key={i}
                className="vitals-card border-b border-gray-200 py-3 mb-3"
              >
                <div
                  key={i}
                  className="vitals-card border-b border-gray-200 py-3 mb-3"
                >
                  <div className="vitals-row">
                    <strong>Date of Visit:</strong> {moment(v.dateOfVisit).format('DD-MM-YYYY')}
                  </div>
                  <div className="vitals-row">
                    <strong>Nurse:</strong> {v.vitalNurseName}
                  </div>
                  <div className="vitals-row">
                    <strong>Temperature:</strong> {v.temperature} °C
                  </div>
                  <div className="vitals-row">
                    <strong>Blood Pressure:</strong> {v.bloodPressure}
                  </div>
                  <div className="vitals-row">
                    <strong>Heart Pulse:</strong> {v.heartPulse}
                  </div>
                  <div className="vitals-row">
                    <strong>Respiratory:</strong> {v.respiratory}
                  </div>
                  <div className="vitals-row">
                    <strong>Blood Sugar:</strong> {v.bloodSugar}
                  </div>
                  <div className="vitals-row">
                    <strong>Oxygen Saturation:</strong> {v.oxygenSaturation}
                  </div>
                  <div className="vitals-row">
                    <strong>Height:</strong> {v.height} cm
                  </div>
                  <div className="vitals-row">
                    <strong>Weight:</strong> {v.weight} kg
                  </div>
                  <div className="vitals-row">
                    <strong>BMI:</strong> {v.bmi}
                  </div>
                  <div className="vitals-row">
                    <strong>Notes:</strong> {v.notes?.join(", ") || "-"}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <table className="readonly-table w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2">Date of Visit</th>
                  <th className="px-4 py-2">Nurse</th>
                  <th className="px-4 py-2">Temp (°C)</th>
                  <th className="px-4 py-2">BP</th>
                  <th className="px-4 py-2">Pulse</th>
                  <th className="px-4 py-2">Respiratory</th>
                  <th className="px-4 py-2">Sugar</th>
                  <th className="px-4 py-2">O₂ Saturation</th>
                  <th className="px-4 py-2">Height (cm)</th>
                  <th className="px-4 py-2">Weight (kg)</th>
                  <th className="px-4 py-2">BMI</th>
                  <th className="px-4 py-2">Notes</th>
                </tr>
              </thead>
              <tbody>
                {vitals.map((v, i) => (
                  <tr key={i} className="border-t">
                    <td className="px-4 py-2">{moment(v.dateOfVisit).format('DD-MM-YYYY')}</td>
                    <td className="px-4 py-2">{v.vitalNurseName}</td>
                    <td className="px-4 py-2">{v.temperature}</td>
                    <td className="px-4 py-2">{v.bloodPressure}</td>
                    <td className="px-4 py-2">{v.heartPulse}</td>
                    <td className="px-4 py-2">{v.respiratory}</td>
                    <td className="px-4 py-2">{v.bloodSugar}</td>
                    <td className="px-4 py-2">{v.oxygenSaturation}</td>
                    <td className="px-4 py-2">{v.height}</td>
                    <td className="px-4 py-2">{v.weight}</td>
                    <td className="px-4 py-2">{v.bmi}</td>
                    <td className="px-4 py-2">{v.notes?.join(", ") || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </aside>
  );
};

export default VitalsRecords;
