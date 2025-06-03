import { useEffect, useState } from "react";
import { RiFilePaper2Line } from "react-icons/ri";
import NurseNotesTreatment from "../modals/NurseNotesTreatment";
import MedicationDetails from "../modals/MedicationDetails";
import moment from "moment";
import DetailedNurseNotes from "../modals/DetailedNurseNotes";
import { get } from "../../utility/fetch";

function TreatmentTable({ data, isloading, patientId }) {
  const [noteModalData, setNoteModalData] = useState(null);
  const [medicationData, setMedicationData] = useState(null);
  const [otherMedicationData, setOtherMedicationData] = useState(null);
  const [nurseNotes, setNurseNotes] = useState(false);
  const [viewing, setViewing] = useState({});
  const [add, setAdd] = useState(false); // Add loading state'
  const [nurses, setNurses] = useState([]);
  const [doctors, setDoctors] = useState([]);


  const stageData = (selectedData) => {
    if (!selectedData) {
      setMedicationData(null);
      setOtherMedicationData(null);
      return;
    }
    setMedicationData(selectedData.medications);
    setOtherMedicationData(selectedData.otherMedications);
  };

  const getNurses = async () => {
    try {
      let res = await get(`/patients/Allnurse/${sessionStorage.getItem("clinicId")}?pageIndex=1&pageSize=300`);
      let tempNurses = res?.data
        ?.filter((nurse) => nurse?.username)
        .map((nurse) => {
          return { name: nurse?.username, value: parseFloat(nurse?.employeeId) };
        });

      tempNurses?.unshift({ name: "Select Nurse", value: "" });
      setNurses(tempNurses);
    } catch (error) {
      console.error("Error fetching nurses:", error);
    }
  };

  const closeModal = () => {
    setNurseNotes(false)
  };


  const getDoctors = async () => {
    try {
      let res = await get(`/patients/AllDoctor/${sessionStorage.getItem("clinicId")}?pageIndex=1&pageSize=300`);
      let tempDoc = res?.data?.map((doc) => {
        return { name: doc?.username, value: parseFloat(doc?.employeeId) };
      });

      tempDoc?.unshift({ name: "Select Doctor", value: "" });
      setDoctors(tempDoc);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  useEffect(() => {
    getNurses();
    getDoctors();
  }, [])

  const selectRecord = (record) => {
    setViewing(record);
    setNurseNotes(true);
  };


  return (
    <div className="w-100">
      {!isloading ? (
        <div className="w-100">
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
                    <th>Admission Status</th>
                    <th>Medication/Prescription</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, index) => (
                    <tr key={index}>
                      <td>{moment(row?.createdAt).format("DD-MM-YYYY")}</td>
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
                      <td className="w-25">
                        {row?.admissionStatus ? (
                          <div className="mx-8 rounded-btn flex flex-v-center flex-h-center">
                            Admitted
                          </div>
                        ) : (
                          <div className="mx-8 rounded-btn-yellow flex flex-v-center flex-h-center">
                            Not Admitted
                          </div>
                        )}
                      </td>
                      <td className="w-25 p-20">
                        <div
                          className="rounded-btn-yellow w-75 flex flex-v-center gap-2 flex-h-center pointer"
                          onClick={() => stageData(row)}
                        >
                          <RiFilePaper2Line /> Prescription Details
                        </div>
                        <div className="text-start flex gap-4 m-t-10">
                          <u className="bold-text">Care Plan:</u>
                          <p className="text-gray">{row?.carePlan}</p>
                         
                        </div>
                        <div
                            className="rounded-btn-yellow w-75 flex flex-v-center gap-2 flex-h-center pointer"
                            onClick={() => selectRecord(row)}
                          >
                            <RiFilePaper2Line /> Administration Details
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
        <div>Loading....</div>
      )}

      {nurseNotes && (
        <DetailedNurseNotes
          treatment={viewing}
          patientId={patientId}
          add={add}
          closeModal={closeModal}
          doctors={doctors}
          nurses={nurses}

        />
      )}
    </div>
  );
}

export default TreatmentTable;
