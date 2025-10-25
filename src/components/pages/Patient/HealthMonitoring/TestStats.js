import React, { useEffect, useState } from "react";
import { get } from "../../../../utility/fetchWeb";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
} from "recharts";

const TestStats = ({patientId}) => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      setError(null);
      try {
        const response = await get(
          `/PatientHealthMonitoring/${patientId}/test-statistics`
        );
        console.log(response);
        if (response) {
          setStats(response);
        } else {
          setError("No data returned");
        }
      } catch (err) {
        setError("Failed to fetch statistics");
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div>
      <h3>Test Statistics Bar Chart</h3>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={stats}
            layout="vertical"
            margin={{ top: 20, right: 40, left: 40, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              allowDecimals={false}
              label={{
                value: "Count",
                position: "insideBottomRight",
                offset: 0,
              }}
            />
            <YAxis type="category" dataKey="testName" width={150} />
            <Tooltip />
            <Bar dataKey="count" fill="#4caf50">
              <LabelList dataKey="count" position="right" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default TestStats;
