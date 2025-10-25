import React, { useState } from "react";
import TestStats from "./HealthMonitoring/TestStats";
import VitalsHistory from "./HealthMonitoring/VitalsHistory";
import CurrentMed from "./HealthMonitoring/CurrentMed";

const HealthMonitoring = ({patientId}) => {
  const [activeTab, setActiveTab] = useState(0);

  const tabList = [
    "Test Statistics",
    "Vitals History",
    "Current Meds",
    // "Tab 4",
  ];

  return (
    <div>
      <h2>Health Monitoring</h2>
      <div style={{ display: "flex", borderBottom: "1px solid #ccc" }}>
        {tabList?.map((tab, idx) => (
          <button
            key={tab}
            onClick={() => setActiveTab(idx)}
            style={{
              padding: "10px 20px",
              border: "none",
              borderBottom: activeTab === idx ? "2px solid green" : "none",
              background: "none",
              fontWeight: activeTab === idx ? "bold" : "normal",
              cursor: "pointer",
              color: activeTab === idx ? "green" : "black",
            }}
          >
            {tab}
          </button>
        ))}
      </div>
      <div style={{ padding: "20px" }}>
        {activeTab === 0 && (
          <div>
            <TestStats patientId={patientId} />
          </div>
        )}
        {activeTab === 1 && (
          <div>
            <VitalsHistory patientId={patientId} />
          </div>
        )}
        {activeTab === 2 && (
          <div>
            <CurrentMed patientId={patientId} />
          </div>
        )}
        {activeTab === 3 && (
          <div>
            <h3>Tab 4</h3>
            <p>Tab 4 content goes here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthMonitoring;
