import React from "react";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = ["#3BFF43", "#109615"];
const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"
];

function OutAndInpatientGraph({ propdata }) {
  const { data } = convertData(propdata);

  function convertData(inputData) {
    if (!Array.isArray(inputData)) {
      return { data: [] };
    }

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // getMonth() is zero-based

    const data = [];

    for (let month = 1; month <= currentMonth; month++) {
      const existingData = inputData.find(
        entry => entry.year === currentYear && entry.month === month
      );

      data.push({
        name: `${MONTH_NAMES[month - 1]}`,
        OutPatients: existingData ? existingData.outPatient : 0,
        InPatients: existingData ? existingData.inPatient : 0,
      });
    }

    return { data };
  }

  return (
    <div className="w-100 container graph">
      <div className="w-100 flex flex-v-center space-between border-bottom p-b-20">
        <div className="bold-text">Outpatient vs Inpatient</div>
      </div>
      <div className="w-100 flex">
        <BarChart
          width={800}
          height={250}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid vertical={false} strokeDasharray="3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar
            barSize={10}
            dataKey="OutPatients"
            fill="#3BFF43"
            activeShape={<Rectangle fill="pink" stroke="blue" />}
          />
          <Bar
            barSize={10}
            dataKey="InPatients"
            fill="#109615"
            activeShape={<Rectangle fill="gold" stroke="purple" />}
          />
        </BarChart>
      </div>
    </div>
  );
}

export default OutAndInpatientGraph;
