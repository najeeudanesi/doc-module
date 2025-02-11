import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { get } from "../../../utility/fetch";
import AddTreatment from "../../modals/AddTreatment";
import ReferPatient from "../../modals/ReferPatient";
import TreatmentTable from "../../tables/TreatmentTable";

function Treatments({ visit, id }) {
  const [showModal, setShowModal] = useState(false);
  const [treatmentModal, setTreatmentModal] = useState(false);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastVisit, setLastVisit] = useState(null);
  const [vital, setVital] = useState(null);
  const [repeatedDiagnosis, setRepeatedDiagnosis] = useState("");

  const toggleModal = () => {
    if (lastVisit === null) {
      toast("A visit has to exist before you can refer patient");
      return;
    }
    setShowModal(!showModal);
  };

  useEffect(() => {
    console.log(repeatedDiagnosis);
  }, [repeatedDiagnosis]);

  const toggleTreatmentModal = () => {
    if (lastVisit === null) {
      toast("A visit has to exist before you can add treatment");
      return;
    }
    setTreatmentModal(!treatmentModal);
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await get(`/patients/${id}/treatmentrecord`);
      setData(response.data);
      console.log(response.data[0])
      response.data && setRepeatedDiagnosis(response.data[0]?.diagnosis)
    } catch (e) {
      console.log(e);
    }
    setIsLoading(false);
  };

  const fetchVital = async () => {
    setIsLoading(true);
    try {
      const response = await get(
        `/patients/vital-by-patientId?patientId=${id}&pageIndex=${1}&pageSize=${1000}`
      );
      setVital(response?.data[0]);
    } catch (e) {
      console.log(e);
    }
    setIsLoading(false);
  };

  const fetchVisit = async () => {
    setIsLoading(true);
    try {
      const response = await get(
        `/appointment/get-appointment-bypatientId/${id}/`
      );
      setLastVisit(response.data[response.data.length - 1]);
    } catch (e) {
      console.log(e);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
    fetchVisit();
    fetchVital();
  }, []);

  return (
    <div className="w-full">
      <div className="flex flex-h-end w-full gap-10">
        <button className="rounded-btn" onClick={toggleModal}>
          + Refer Patient To Lab
        </button>
        <button className="rounded-btn" onClick={toggleTreatmentModal}>
          + Add Treatment
        </button>
      </div>
      <TreatmentTable
        patientId={id}
        data={data}
        isloading={isLoading}
        visit={visit}
      />
      {showModal && (
        <ReferPatient
          repeatedDiagnosis={repeatedDiagnosis}
          setRepeatedDiagnosis={setRepeatedDiagnosis}
          closeModal={toggleModal}
          visit={lastVisit}
          vital={vital}
          id={id}
          treatment={data[0] || null}
        />
      )}
      {treatmentModal && (
        <AddTreatment
          repeatedDiagnosis={repeatedDiagnosis}
          setRepeatedDiagnosis={setRepeatedDiagnosis}
          closeModal={toggleTreatmentModal}
          visit={lastVisit}
          data={data}
          id={id}
          fetchData={fetchData}
        />
      )}
    </div>
  );
}

export default Treatments;
