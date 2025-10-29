import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiEdit3 } from "react-icons/fi";

import { get } from "../../../utility/fetch";
import tvIcon from "../../../assets/images/tv-Ico.png";
// import "./GeneralPractice.css";

const CardiologyTable = () => {
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
      const response = await get(
        `/cardiology/list/patient/${id}/${currentPage}/10`
      );
      if (response?.isSuccess) {
        setRecords(response.data.recordList || []);
        setTotalPages(response.data.metadata?.totalPages || 1);

        // ensure current page is within bounds if metadata changed
        const metaPage = response.data.metadata?.page || currentPage;
        if (metaPage !== currentPage) {
          setPage(metaPage);
        }
      } else {
        setRecords([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Failed to fetch records:", error);
      setRecords([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handlePrev = () => {
    setPage((p) => Math.max(1, p - 1));
  };

  const handleNext = () => {
    setPage((p) => Math.min(totalPages, p + 1));
  };

  const handleFirst = () => setPage(1);
  const handleLast = () => setPage(totalPages);

  return (
    <div className="family-table-container">
      <div className="header-section">
        <h3>Cardiology</h3>

        <div className="button-bar">
          <button
            className="btn-case"
            onClick={() => navigate(`/doctor/patients/cardiology/${patientId}`)}
          >
            + Create a Case Note
          </button>
          {/* <button className="btn-note">+ Add Note</button> */}
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
                  <th>Cardiology</th>
                  <th>Patient's Complaint</th>
                  <th>Doctor's Name</th>
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
                      <td>{record.deliveryType || "Case Note"}</td>
                      <td>{record.history || ""}</td>
                      <td>
                        Dr. {record.doctor?.firstName} {record.doctor?.lastName}
                      </td>
                      <td>
                        <button
                          onClick={() => {
                            navigate(
                              `/doctor/patients/cardiology/${patientId}/?treatmentId=${record.id}`
                            );
                          }}
                          className="icon-btn flex"
                        >
                          <FiEdit3 size={16} color="#109615" />
                        </button>
                        {/* <button
                          onClick={() => {
                            navigate(
                              `/doctor/patients/family-medcine-treatment/${patientId}/?view=true&treatmentId=${record.id}`
                            );
                          }}
                          className="icon-btn flex"
                        >
                          <img src={tvIcon} />
                        </button> */}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No records found.</td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div
              className="pagination-controls"
              style={{
                marginTop: "16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "8px",
                flexWrap: "wrap",
              }}
            >
              <div></div>
              <div
                style={{ display: "flex", gap: "8px", alignItems: "center" }}
              >
                <button
                  className="btn"
                  onClick={handleFirst}
                  disabled={page === 1}
                  style={{ padding: "6px 12px" }}
                >
                  First
                </button>
                <button
                  className="btn"
                  onClick={handlePrev}
                  disabled={page === 1}
                  style={{ padding: "6px 12px" }}
                >
                  Previous
                </button>

                <span>
                  Page {page} of {totalPages}
                </span>

                <button
                  className="btn"
                  onClick={handleNext}
                  disabled={page === totalPages}
                  style={{ padding: "6px 12px" }}
                >
                  Next
                </button>
                <button
                  className="btn"
                  onClick={handleLast}
                  disabled={page === totalPages}
                  style={{ padding: "6px 12px" }}
                >
                  Last
                </button>
              </div>

              {/* <div
                style={{ display: "flex", gap: "8px", alignItems: "center" }}
              >
                <label style={{ fontSize: "14px" }}>Go to</label>
                <input
                  type="number"
                  min={1}
                  max={totalPages}
                  value={page}
                  onChange={(e) => {
                    const v = Number(e.target.value) || 1;
                    const next = Math.min(Math.max(1, v), totalPages);
                    setPage(next);
                  }}
                  style={{ width: "72px", padding: "6px" }}
                />
              </div> */}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CardiologyTable;
