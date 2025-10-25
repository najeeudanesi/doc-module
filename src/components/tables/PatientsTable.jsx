import React from "react";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../utility/general";

function PatientsTable({
  data,
  extraColumns = [],
  loading = false,
  currentPage = 1,
  totalPages = 1,
  setCurrentPage = () => {},
}) {
  const navigate = useNavigate();

  // Pagination controls
  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const formatTime = (date) => {
    if (!date) return "";
    try {
      return new Date(date).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  return (
    <div className="w-100 ">
      <div className="w-100 none-flex-item m-t-40">
        <table className="bordered-table">
          <thead className="border-top-none">
            <tr className="border-top-none">
              <th>#</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Age</th>
              <th>Assigned Nurse</th>
              {/* <th>Date Created</th> */}
              <th> Date</th>
              <th> Time</th>
              {extraColumns.map((col) => (
                <th key={col.key}>{col.label}</th>
              ))}
            </tr>
          </thead>

          {loading && data.length === 0 ? (
            <tbody>
              <tr>
                <td
                  colSpan={8 + extraColumns.length}
                  style={{
                    textAlign: "center",
                    height: "200px",
                  }}
                >
                  Loading...
                </td>
              </tr>
            </tbody>
          ) : data.length > 0 ? (
            <tbody className="white-bg view-det-pane">
              {data.map((row, index) => {
                const updatedDateObj = row?.updatedAt
                  ? new Date(row.updatedAt)
                  : null;
                return (
                  <tr
                    key={index}
                    className="pointer"
                    onClick={() => {
                      localStorage.setItem("appointmentId", row.appointmentId);
                      navigate(
                        `/doctor/patients/patient-details/${row.patientId}`
                      );
                    }}
                  >
                    <td>{index + 1 + (currentPage - 1) * data.length}</td>
                    <td>{row.firstName}</td>
                    <td>{row.lastName}</td>
                    <td>{row.age}</td>
                    <td>{row.assignedNurse}</td>
                    {/* <td>{row.dateCreated}</td> */}
                    <td>{updatedDateObj ? formatDate(updatedDateObj) : ""}</td>
                    <td>{formatTime(row?.updatedAt)}</td>
                    {extraColumns.map((col) => (
                      <td key={col.key}>{row[col.key]}</td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td
                  colSpan={8 + extraColumns.length}
                  style={{ textAlign: "center" }}
                >
                  No Patients Found
                </td>
              </tr>
            </tbody>
          )}
        </table>
        {/* Pagination Controls */}
        <div
          className="pagination-controls"
          style={{
            marginTop: "24px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <button
            className="btn"
            onClick={handlePrev}
            disabled={currentPage === 1}
            style={{ padding: "6px 16px" }}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="btn"
            onClick={handleNext}
            disabled={currentPage === totalPages}
            style={{ padding: "6px 16px" }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default PatientsTable;
