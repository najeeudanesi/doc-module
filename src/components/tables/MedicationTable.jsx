import React from "react";

const MedicationTable = ({
  treatment,
  medications,
  drugStrengthUnits,
  routesOfAdministration,
  administrationFrequencies,
}) => {
  return (
    <div>
      <table className="bordered-table-2 m-t-20">
        <thead className="border-top-none">
          <tr className="border-top-none">
            <th rowSpan="2">Prescription</th>
            <th colSpan="5" className="center-text">
              Dosage
            </th>
          </tr>
          <tr>
            <th>Quantity</th>
            <th>Duration</th>
            <th>Route</th>
            <th>Frequency of Administration</th>
          </tr>
        </thead>
        <tbody className="white-bg view-det-pane">
          <tr>
            <td>
              {medications?.map((item) => (
                <div
                  key={item?.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    marginBottom: "16px",
                  }}
                >
                  <span>
                    {item?.pharmacyInventory?.productName || "N/A"}
                    {item?.doctorPrescription?.strength
                      ? ` (${item.doctorPrescription.strength})`
                      : ""}
                  </span>
                </div>
              ))}
            </td>
            <td>
              {medications.map((item) => (
                <div
                  key={item?.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    marginBottom: "16px",
                  }}
                >
                  <span>{item?.doctorPrescription?.quantity || "-"}</span>
                </div>
              ))}
            </td>
            <td>
              {medications.map((item) => (
                <div
                  key={item?.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    marginBottom: "16px",
                  }}
                >
                  <span>
                    {item?.doctorPrescription?.duration
                      ? `${item.doctorPrescription.duration} days`
                      : "-"}
                  </span>
                </div>
              ))}
            </td>
            <td>
              {medications.map((item) => (
                <div
                  key={item?.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    marginBottom: "16px",
                  }}
                >
                  <span>
                    {item?.doctorPrescription?.routeOfAdministration || "-"}
                  </span>
                </div>
              ))}
            </td>
            <td>
              {medications.map((item) => (
                <div
                  key={item?.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    marginBottom: "16px",
                  }}
                >
                  <span>
                    {item?.doctorPrescription?.administrationFrequency || "-"}
                  </span>
                </div>
              ))}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default MedicationTable;
