import { useEffect, useState } from "react";
import {  get } from "../../../utility/fetch";
import {  RiEdit2Fill } from "react-icons/ri";
import notification from "../../../utility/notification";
import axios from "axios";
import DetailedNurseNotes from "../../modals/DetailedNurseNotes";
import { useNavigate } from "react-router-dom";

function AdmitCheck({ data, setCurrent, totalPages, currentPage }) {

  const [viewing, setViewing] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [add, setAdd] = useState(false);
  const [combinedData, setCombinedData] = useState([]);
  const [patient, setPatient] = useState([]);
  const [loading, setLoading] = useState(false);
  const [beds, setBeds] = useState([]);
  const [bedList, setBedsList] = useState([]);
  const [patientName, setPatientName] = useState("");

  const navigate = useNavigate();


  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrent(newPage);
      setCurrent(newPage);
    }
  };

  const generatePageNumbers = () => {
    let pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages = [1, 2, 3, 4, totalPages];
      } else if (currentPage >= totalPages - 2) {
        pages = [1, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
      } else {
        pages = [1, currentPage - 1, currentPage, currentPage + 1, totalPages];
      }
    }
    return pages;

  };

  const getAllPatients = async () => {
    setLoading(true);
    try {
      let res = await get(`/patients/AllPatient/${sessionStorage?.getItem("clinicId")}?pageIndex=${1}&pageSize=${1000}`);
      setPatient(res?.data);
    } catch (error) {
      console.error('Error fetching all patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAssignedBeds = async () => {
    const token = sessionStorage.getItem('token');

    if (!token) {
      console.error('Token not found in session storage');
      return;
    }

    const options = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };

    try {
      let res = await axios.get(`${process.env.REACT_APP_BASE_URL}/clinicapi/api/bed/assign-bed/list/${1}/1000`, options);
      setBeds(res?.data?.resultList || []);
    } catch (error) {
      console.error('Error fetching equipment:', error);
    }
  };

  const findPatientName = (id) => {
    if (!Array.isArray(patient)) {
      console.error("Error: 'patient' is not an array", patient);
      return "";
    }
    const patientRecord = patient?.find((p) => p?.patientId === id);

    return patientRecord ? `${patientRecord?.firstName} ${patientRecord?.lastName}` : "";
  };

  const isPatientOccupyingBed = (patientId) => {
    const bed = beds?.find((b) => b?.patient?.id === patientId);
    return bed ? bed?.bed?.name : 'Assign patient a bed';
  };



  useEffect(() => {
    getAllPatients();
    getAssignedBeds()
  }, []);

  useEffect(() => {
    setCombinedData(data);
  }, [data]);


  const closeModal = () => {
    setIsModalOpen(false);
    setAdd(false)
  };

  const selectRecord = (record) => () => {
    console.log('Selected record:', record.appointmentId);
    const patientRecord = patient?.find((p) => p?.patientId === record?.patientId);

    if (patientRecord) {
      setPatientName(`${patientRecord?.firstName} ${patientRecord?.lastName}`);
    }
    setIsModalOpen(true);
    setViewing(record);
    // navigate('/facility');
  };


  const handleEdit = (recordId) => {
    setViewing(recordId);
    setAdd(true);
  }

  const getBedList = async () => {
    const token = sessionStorage.getItem('token');

    if (!token) {
      console.error('Token not found in session storage');
      return;
    }

    const options = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
    try {
      setLoading(true);
      let res = await axios.get(`${process.env.REACT_APP_BASE_URL}/clinicapi/api/bed/list/${1}/10`, options);
      if (res.status === 200) {
        setBedsList(res?.data?.resultList || []);
      } else if (res.status === 500) {
        notification({ message: 'Server Error', type: "error" });
        setBedsList([]);
      } else {
        setBedsList([]);
      }
    } catch (error) {
      setBedsList([]);
      console.error('Error fetching bed list:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-100">
      <div className="w-100 none-flex-item m-t-40">
        <table className="bordered-table">
          <thead className="border-top-none">
            <tr className="border-top-none">
              <th>#</th>
              <th>Patient Name</th>
              <th>Appointment Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Description</th>
              <th>Tracking</th>
            </tr>
          </thead>

          <tbody className="white-bg view-det-pane">
            {data.map((row, index) => {
              const status = row.isCanceled ? 'Cancelled' :
                row.isDischarged ? 'Discharged' :
                  row.isAdmitted ? 'Admitted' : 'Scheduled';

              const statusClass = row.isCanceled ? 'text-danger' :
                row.isDischarged ? 'text-success' :
                  row.isAdmitted ? 'text-warning' : 'text-primary';

              return (
                <tr
                  key={index}
                  className="pointer"
                  onClick={() => {
                    localStorage.setItem("appointmentId", row.id);
                    navigate(`/doctor/patients/patient-details/${row.patientId}`);
                  }}
                >
                  <td>{index + 1}</td>
                  <td>{row.patientName}</td>
                  <td>{row.appointDate}</td>
                  <td>{row.appointTime}</td>
                  <td className={statusClass}>{row?.status}</td>
                  <td>{row.description || 'No description'}</td>
                  <td>{row.tracking}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {
        isModalOpen &&
        <DetailedNurseNotes closeModal={closeModal} treatment={viewing} patientName={patientName} patientId={viewing?.patientId}/>
      }

     
    </div>
  );
}
export default AdmitCheck;
