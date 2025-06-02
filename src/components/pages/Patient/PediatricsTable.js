import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiEdit3 } from "react-icons/fi";
import { get } from "../../../utility/fetch";
import "./FamilyMedicineTable.css";

const PediatricsTable = () => {
  const navigate = useNavigate();
  const { patientId } = useParams();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (patientId) fetchRecords(page, patientId);
  }, [page, patientId]);

  const fetchRecords = async (currentPage, id) => {
    setLoading(true);
    try {
      const response = await get(`/Pediatric/list/patient/${id}/${currentPage}/10`);
      if (response?.isSuccess) {
        setRecords(response.data.recordList);
        setTotalPages(response.data.metadata.totalPages || 1);
      }
    } catch (error) {
      console.error("Failed to fetch pediatric records:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <div className="family-table-container">
      <div className="header-section">
        <h3>Pediatrics</h3>

        <div className="button-bar">
          <button
            className="btn-case"
            onClick={() => navigate(`/doctor/patients/pediatrics/${encodeURI(patientId)}`)}
          >
            + Create a Case Note
          </button>
        </div>
      </div>

      <div className="table-section">
        <h4>Consultation Log</h4>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <table className="family-table">
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Date</th>
                  <th>Medical History</th>
                  <th>Symptoms Started</th>
                  <th>Pain Level</th>
                  <th>Treatment Schedule</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {records.length > 0 ? (
                  records.map((record) => (
                    <tr key={record.id}>
                      <td>
                        {record.patient?.firstName} {record.patient?.lastName}
                      </td>
                      <td>{new Date(record.createdAt).toLocaleDateString()}</td>
                      <td>{record.generalInformation?.medicalHistory?.details || 'N/A'}</td>
                      <td>{record.symptomAnalysis?.symptomsStartedWhen || 'N/A'}</td>
                      <td>{record.painAssessment?.severityLevel || 'N/A'}</td>
                      <td>{record.treatmentSchedule || 'N/A'}</td>
                      <td>
                        <button
                          onClick={() => {
                            navigate(
                              `/doctor/patients/pediatrics/${patientId}/?treatmentId=${record.id}`
                            );
                          }}
                          className="icon-btn"
                        >
                          <FiEdit3 size={16} color="#109615" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7">No records found.</td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="pagination-controls">
              <button onClick={handlePrev} disabled={page === 1}>
                Previous
              </button>
              <span>
                Page {page} of {totalPages}
              </span>
              <button onClick={handleNext} disabled={page === totalPages}>
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PediatricsTable;