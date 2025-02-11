import { useState } from "react";
import { RiFilePaper2Line } from "react-icons/ri";
import NurseNotes from "../modals/NurseNotes";
import { formatDate } from "../../utility/general";
import NurseNotesTreatment from "../modals/NurseNotesTreatment";
import MedicationDetails from "../modals/MedicationDetails";
import moment from 'moment'

function TreatmentTable({ data, isloading, patientId }) {
  const [noteModalData, setNoteModalData] = useState(null);
  const [medicationData, setMedicationData] = useState(null);
  const [otherMedicationData, setOtherMedicationData] = useState(null);

  const stageData = (selectedData) => {
    if (selectedData === null) {
      setMedicationData(null);
      setOtherMedicationData(null);
      return;
    }
    setMedicationData(selectedData.medications);
    setOtherMedicationData(selectedData.otherMedications);
  };

  return (
    <div className="w-100">
      {!isloading ? (
        <div className="w-100 ">
          {data ? (
            <div className="w-100 none-flex-item m-t-40">
              <table className="bordered-table-2">
                <thead className="border-top-none">
                  <tr className="border-top-none">
                    <th className="w-20">Date</th>
                    <th>Age</th>
                    <th>Weight</th>
                    <th>Temp</th>

                    <th>Nurse Note</th>
                    <th>Diagnosis</th>
                    <th>Medication/Prescription</th>
                  </tr>
                </thead>

                <tbody className="white-bg view-det-pane">
                  {data.map((row, index) => (
                    <tr key={index}>
                      <td>{moment(row?.createdAt).format('DD/MM/YYYY')}</td>

                      <td>{row?.age}</td>
                      <td>{row?.weight}kg</td>
                      <td>{row?.temperature}C</td>

                      <td>
                        <div
                          className="outline pointer"
                          onClick={() => setNoteModalData(row)}
                        >
                          <RiFilePaper2Line />
                        </div>
                      </td>
                      <td className="w-25">{row?.diagnosis}</td>
                      <td className="w-25 p-20">
                        <div
                          className="rounded-btn-yellow w-75 flex flex-v-center gap-2 flex-h-center"
                          onClick={() => stageData(row)}
                        >
                          <RiFilePaper2Line /> Prescription Details
                        </div>

                        <div className="text-start flex gap-4 m-t-10">
                          <u className="bold-text">Care Plan: </u>
                          <p className="text-gray"> {row?.carePlan}</p>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {noteModalData && (
                <NurseNotesTreatment
                  closeModal={() => setNoteModalData(null)}
                  data={noteModalData}
                  patientId={patientId}
                />
              )}

              {medicationData && (
                <MedicationDetails
                  closeModal={() => stageData(null)}
                  data={medicationData}
                  otherData={otherMedicationData}
                />
              )}
            </div>
          ) : (
            <p>No data available</p>
          )}
        </div>
      ) : (
        <div>{/* Loading.... */}</div>
      )}
    </div>
  );
}

export default TreatmentTable;
