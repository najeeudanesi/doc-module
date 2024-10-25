import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Legend } from "recharts";

const COLORS = ["#109615", "#FFC700"];

function GenderDistribution({ propData }) {
  const [data, setData] = useState([]);

  const convert = (thisData) => {
    const newData = [
      { name: "Male", value: thisData.malePatientPercentage },
      { name: "Female", value: thisData.femalePatientPercentage }
    ];
    return newData;
  };

  useEffect(() => {
    if (propData) {
      setData(convert(propData));
    }
  }, [propData]);

  if (!propData) {
    return <div>No data</div>;
  }

  return (
    <div className="w-90 container">
      <div className="bold-text w-100 border-bottom p-b-20">
        Gender Distribution
      </div>
      <PieChart width={250} height={200}>
        <Legend iconType="circle" layout="horizontal" verticalAlign="bottom" />
        <Pie
          data={data}
          cx={100}
          cy={100}
          innerRadius={53}
          outerRadius={60}
          fill="#8884d8"
          paddingAngle={0}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </div>
  );
}

export default GenderDistribution;
