import React from "react";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../utility/general";

function PatientsTable({ data }) {
  const navigate = useNavigate();

  // Filter accepted appointments
  const acceptedAppointments = data?.filter(row => 
    row.status?.toLowerCase() === 'accepted'
  ) || [];

  if (!acceptedAppointments || acceptedAppointments.length === 0) {
    return (
      <div className="w-100">
        <div className="w-100 none-flex-item m-t-40">
          <h4 className="text-center">No accepted appointments found</h4>
        </div>
      </div>
    );
  }

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
            {acceptedAppointments.map((row, index) => {
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
    </div>
  );
}

export default PatientsTable;