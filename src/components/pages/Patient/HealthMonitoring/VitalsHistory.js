import React, { useEffect, useState } from "react";
import { get } from "../../../../utility/fetchWeb";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import VitalsChart from "../../../UI/VitalChart";

const vitalKeys = [
  "temperature",
  "heartPulse",
  "respiratory",
  "height",
  "weight",
];
const colors = {
  temperature: "#e57373",
  heartPulse: "#64b5f6",
  respiratory: "#81c784",
  height: "#ba68c8",
  weight: "#ffd54f",
};

const VitalsHistory = ({patientId}) => {
  const [vitals, setVitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchVitals() {
      setLoading(true);
      setError(null);
      try {
        const response = await get(
          `/PatientHealthMonitoring/${patientId}/vitals-history?lastSixMonths=false`
        );
        console.log(response);
        if (response) {
          setVitals(
            response.map((v) => ({
              ...v,
              date: new Date(v.dateOfVisit).toLocaleDateString(),
            }))
          );
        } else {
          setError("No data returned");
        }
      } catch (err) {
        setError("Failed to fetch vitals history");
      } finally {
        setLoading(false);
      }
    }
    fetchVitals();
  }, []);

  return (
    <div>
      <h3>Vitals History Grouped Bar Chart</h3>
      {loading && <p>Loading...</p>}
      {/* {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={vitals}
            margin={{ top: 20, right: 40, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            {vitalKeys.map((key) => (
              <Bar key={key} dataKey={key} fill={colors[key]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      )} */}

      <VitalsChart visitsData={vitals} bp />
      
    </div>
  );
};

export default VitalsHistory;
