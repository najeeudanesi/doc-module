import { useEffect, useState } from "react";
import { get } from "../../../utility/fetch";
import { RiEdit2Fill } from "react-icons/ri";
import notification from "../../../utility/notification";
import axios from "axios";
import DetailedNurseNotes from "../../modals/DetailedNurseNotes";
import WardRoundNotes from "../../modals/WardRoundNotes";

function AdmitCheck({
  data,
  setCurrentPage,
  totalPages,
  currentPage,
  getAllAdmittedPatients,
}) {
  const [viewing, setViewing] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [wardRoundModal, setWardRoundModal] = useState(false);
  const [add, setAdd] = useState(false);
  const [combinedData, setCombinedData] = useState([]);
  const [patient, setPatient] = useState([]);
  const [loading, setLoading] = useState(false);
  const [beds, setBeds] = useState([]);
  const [bedList, setBedsList] = useState([]);
  const [patientName, setPatientName] = useState("");

  // Pagination controls
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
      getAllAdmittedPatients(newPage); // Fetch new page data from parent
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
      let res = await get(
        `/patients/AllPatient/${sessionStorage?.getItem(
          "clinicId"
        )}?pageIndex=${1}&pageSize=${1000}`
      );
      setPatient(res?.data);
    } catch (error) {
      console.error("Error fetching all patients:", error);
    } finally {
      setLoading(false);
    }
  };

  const getAssignedBeds = async () => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      console.error("Token not found in session storage");
      return;
    }

    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      let res = await axios.get(
        `${
          process.env.REACT_APP_BASE_URL
        }/clinicapi/api/bed/assign-bed/list/${1}/1000`,
        options
      );
      setBeds(res?.data?.resultList || []);
    } catch (error) {
      console.error("Error fetching equipment:", error);
    }
  };

  const findPatientName = (id) => {
    if (!Array.isArray(patient)) {
      console.error("Error: 'patient' is not an array", patient);
      return "";
    }
    const patientRecord = patient?.find((p) => p?.patientId === id);

    return patientRecord
      ? `${patientRecord?.firstName} ${patientRecord?.lastName}`
      : "";
  };

  const isPatientOccupyingBed = (patientId) => {
    const bed = beds?.find((b) => b?.patient?.id === patientId);
    return bed ? bed?.bed?.name : "Assign patient a bed";
  };

  useEffect(() => {
    getAllPatients();
    getAssignedBeds();
  }, []);

  useEffect(() => {
    setCombinedData(data);
  }, [data]);

  const closeModal = () => {
    setIsModalOpen(false);
    setAdd(false);
  };

  const selectRecord = (record) => () => {
    const patientRecord = patient?.find(
      (p) => p?.patientId === record?.patientId
    );

    if (patientRecord) {
      setPatientName(`${patientRecord?.firstName} ${patientRecord?.lastName}`);
    }
    setIsModalOpen(true);
    setViewing(record);
  };

  const handleEdit = (recordId) => {
    setViewing(recordId);
    setAdd(true);
  };

  const getBedList = async () => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      console.error("Token not found in session storage");
      return;
    }

    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      setLoading(true);
      let res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/clinicapi/api/bed/list/${1}/10`,
        options
      );
      if (res.status === 200) {
        setBedsList(res?.data?.resultList || []);
      } else if (res.status === 500) {
        notification({ message: "Server Error", type: "error" });
        setBedsList([]);
      } else {
        setBedsList([]);
      }
    } catch (error) {
      setBedsList([]);
      console.error("Error fetching bed list:", error);
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
              <th className="center-text">Date</th>
              <th className="center-text">Time Of Admission</th>
              <th className="center-text">Age</th>
              <th className="center-text">Diagnosis</th>
              <th className="center-text">Patient</th>
              <th className="center-text">Bed Occupying</th>
              <th className="center-text">Actions</th>
            </tr>
          </thead>
          <tbody className="white-bg view-det-pane">
            {combinedData?.map((row) => {
              const patientName = findPatientName(row.patientId);
              const bed = isPatientOccupyingBed(row.patientId);
              return (
                <tr
                  className="hovers pointer"
                  key={row?.id}
                >
                  <td onClick={selectRecord(row)}>{new Date(row?.dateOfVisit).toLocaleDateString()}</td>
                  <td onClick={selectRecord(row)}>
                    {new Date(row?.createdAt?.split(".")[0]).toLocaleTimeString(
                      "en-US",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true,
                      }
                    )}
                  </td>
                  <td onClick={selectRecord(row)}>{row?.age} years</td>
                  <td onClick={selectRecord(row)}>{row?.diagnosis}</td>
                  <td onClick={selectRecord(row)}>
                    {patientName
                      ? patientName
                      : row.patient.firstName + " " + row.patient.lastName}
                  </td>
                  <td onClick={selectRecord(row)}>{bed ? bed : ""}</td>
                  <td className="center-text">
                    <button
                      className="submit-btn"
                      style={{
                        padding: "5px 10px",
                        fontSize: "12px",
                        backgroundColor: "#28a745",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        const patientRecord = patient?.find(
                          (p) => p?.patientId === (row?.patient?.id || row?.patientId)
                        );
                        if (patientRecord) {
                          setPatientName(`${patientRecord?.firstName} ${patientRecord?.lastName}`);
                        } else if (row?.patient) {
                          setPatientName(`${row.patient.firstName} ${row.patient.lastName}`);
                        }
                        setViewing(row);
                        setWardRoundModal(true);
                      }}
                    >
                      Ward Round
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* Pagination Controls */}
      <div className="pagination flex space-between col-4 m-t-20">
        <div className="flex gap-8">
          <div className="bold-text">Page</div>
          <div className=" m-r-20">
            {currentPage}/{totalPages}
          </div>
        </div>
        <div className="flex gap-8">
          <button
            className={`pagination-btn ${currentPage === 1 ? "disabled" : ""}`}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            {"Previous"}
          </button>

          {generatePageNumbers().map((page, index) => (
            <button
              key={`page-${index}`}
              className={`pagination-btn ${
                currentPage === page ? "bg-green text-white" : ""
              }`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}

          <button
            className={`pagination-btn ${
              currentPage === totalPages ? "disabled" : ""
            }`}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            {"Next"}
          </button>
        </div>
      </div>

      {isModalOpen && (
        <DetailedNurseNotes
          getAllAdmittedPatients={getAllAdmittedPatients}
          closeModal={closeModal}
          treatment={viewing}
          patientName={patientName}
          patientId={viewing?.patientId}
        />
      )}

      {wardRoundModal && (
        <WardRoundNotes
          getAllAdmittedPatients={getAllAdmittedPatients}
          closeModal={() => setWardRoundModal(false)}
          treatment={viewing}
          patientName={patientName}
        />
      )}
    </div>
  );
}
export default AdmitCheck;
