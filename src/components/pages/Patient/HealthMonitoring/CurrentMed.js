import React, { useEffect, useState } from "react";
import { get } from "../../../../utility/fetchWeb";

// Helper to generate random date within current month
function randomDateInMonth() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const start = new Date(year, month, 1).getTime();
  const end = new Date(year, month + 1, 0).getTime();
  return new Date(start + Math.random() * (end - start));
}

const timelineColor = "#4caf50";
const cardBg = "#f9f9fb";
const shadow = "0 2px 8px rgba(0,0,0,0.07)";
const dispensedIcon = (
  <span
    style={{
      color: "#4caf50",
      fontWeight: "bold",
      marginLeft: 6,
      fontSize: 14,
      verticalAlign: "middle",
    }}
    title="Dispensed"
  >
    &#10003;
  </span>
);
const notDispensedIcon = (
  <span
    style={{
      color: "#f44336",
      fontWeight: "bold",
      marginLeft: 6,
      fontSize: 14,
      verticalAlign: "middle",
    }}
    title="Not Dispensed"
  >
    &#10007;
  </span>
);

const CurrentMed = ({ patientId = 5542 }) => {
  const [medsWithDates, setMedsWithDates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMeds() {
      setLoading(true);
      try {
        const data = await get(
          `/PatientHealthMonitoring/${patientId}/current-medications`
        );
        const meds = (data || []).map((med) => {
          let start = randomDateInMonth();
          let end = randomDateInMonth();
          if (end < start) {
            let temp = end;
            end = start;
            start = temp;
          }
          return {
            ...med,
            startDate: start,
            expectedEndDate: end,
          };
        });
        setMedsWithDates(meds);
      } catch (e) {
        setMedsWithDates([]);
      }
      setLoading(false);
    }
    fetchMeds();
  }, [patientId]);

  return (
    <div>
      <h3 style={{ marginBottom: 18, fontSize: 20 }}>
        Current Medications Timeline
      </h3>
      {loading ? (
        <div style={{ fontSize: 14 }}>Loading...</div>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
          {medsWithDates.length === 0 ? (
            <div style={{ fontSize: 14 }}>No current medications found.</div>
          ) : (
            medsWithDates.map((med, idx) => {
              const durationDays = Math.max(
                1,
                Math.round(
                  (med.expectedEndDate - med.startDate) / (1000 * 60 * 60 * 24)
                )
              );
              return (
                <div
                  key={idx}
                  style={{
                    background: cardBg,
                    boxShadow: shadow,
                    borderRadius: 10,
                    padding: 14,
                    minWidth: 260,
                    maxWidth: 350,
                    marginBottom: 10,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    fontSize: 13,
                  }}
                >
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: 15,
                      color: timelineColor,
                      marginBottom: 4,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {med.name}
                    {med.isDispensed ? dispensedIcon : notDispensedIcon}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "#555",
                      marginBottom: 8,
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "8px 16px",
                    }}
                  >
                    <span>
                      <b>Qty:</b> {med.quantity}
                    </span>
                    <span>
                      <b>Strength:</b> {med.strengthUnit}
                    </span>
                    <span>
                      <b>Freq:</b> {med.frequency}
                    </span>
                    <span>
                      <b>Route:</b> {med.route}
                    </span>
                  </div>
                  <div style={{ width: "100%", margin: "8px 0" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <span
                        style={{
                          fontSize: 11,
                          color: "#888",
                          minWidth: 70,
                        }}
                      >
                        {med.startDate?.toLocaleDateString()}
                      </span>
                      <div
                        style={{
                          height: 12,
                          width: 120,
                          background: "#e0e0e0",
                          margin: "0 6px",
                          position: "relative",
                          borderRadius: 6,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            left: 0,
                            top: 0,
                            height: "100%",
                            width: `${Math.max(16, durationDays * 5)}px`,
                            background: timelineColor,
                            borderRadius: 6,
                            boxShadow: "0 1px 4px rgba(76,175,80,0.12)",
                          }}
                        ></div>
                      </div>
                      <span
                        style={{
                          fontSize: 11,
                          color: "#888",
                          minWidth: 70,
                        }}
                      >
                        {med.expectedEndDate.toLocaleDateString()}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "#888",
                        marginTop: 2,
                      }}
                    >
                      Duration:{" "}
                      <b>
                        {durationDays} day{durationDays > 1 ? "s" : ""}
                      </b>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default CurrentMed;
