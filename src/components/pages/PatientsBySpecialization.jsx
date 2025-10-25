import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { get } from "../../utility/fetch";

const SPECIALIZATIONS = [
  { key: "FamilyMedicine", label: "Family Medicine" },
  { key: "Cardiology", label: "Cardiology" },
  { key: "Ophthalmology", label: "Ophthalmology" },
  { key: "Orthopedic", label: "Orthopedic" },
  { key: "GeneralSurgery", label: "General Surgery" },
  { key: "Antenatal", label: "Antenatal" },
  // Add more as needed
];

const API_BASE = "https://api.greenzonetechnologies.com.ng/medicals/api";

function PatientsBySpecialization() {
  const [selectedTab, setSelectedTab] = useState(SPECIALIZATIONS[0].key);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);

  // Example: /FamilyMedicine/filter-list/firstname/ni/1/10
  const fetchPatients = async (specialization) => {
    setLoading(true);
    let endpoint = `/${specialization}/list/1/10`;
    try {
      const data = await get(endpoint);
      setPatients(data?.data?.recordList || []);
    } catch (e) {
      setPatients([]);
    }
    setLoading(false);
  };

  const fetchPatientsWithFilters = async (specialization, query) => {
    setLoading(true);
    let endpoint = `/${specialization}/filter-list/PatientName/${query}/1/10`;
    try {
      const data = await get(endpoint);
      setPatients(data?.data?.recordList || []);
    } catch (e) {
      setPatients([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPatients(selectedTab);
  }, [selectedTab]);

  return (
    <div className="w-100 m-t-80 p-20">
      <div style={{ marginBottom: 24 }}>
        {SPECIALIZATIONS.map((spec) => (
          <button
            key={spec.key}
            onClick={() => setSelectedTab(spec.key)}
            style={{
              marginRight: 8,
              padding: "8px 16px",
              background: selectedTab === spec.key ? "#1e7e34" : "#e9ecef",
              color: selectedTab === spec.key ? "#fff" : "#333",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              fontWeight: selectedTab === spec.key ? "bold" : "normal",
            }}
          >
            {spec.label}
          </button>
        ))}
      </div>
      <div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#e9fbe9" }}>
                <th style={{ border: "1px solid #1e7e34", padding: 8 }}>#</th>
                <th style={{ border: "1px solid #1e7e34", padding: 8 }}>
                  First Name
                </th>
                <th style={{ border: "1px solid #1e7e34", padding: 8 }}>
                  Last Name
                </th>
                <th style={{ border: "1px solid #1e7e34", padding: 8 }}>
                  Gender
                </th>
                <th style={{ border: "1px solid #1e7e34", padding: 8 }}>
                  Phone
                </th>
                <th style={{ border: "1px solid #1e7e34", padding: 8 }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {patients.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: 16 }}>
                    No patients found.
                  </td>
                </tr>
              ) : (
                patients.map((p, idx) => (
                  <tr key={p.id || idx}>
                    <td style={{ border: "1px solid #1e7e34", padding: 8 }}>
                      {idx + 1}
                    </td>
                    <td style={{ border: "1px solid #1e7e34", padding: 8 }}>
                      {p.firstName}
                    </td>
                    <td style={{ border: "1px solid #1e7e34", padding: 8 }}>
                      {p.lastName}
                    </td>
                    <td style={{ border: "1px solid #1e7e34", padding: 8 }}>
                      {p.gender}
                    </td>
                    <td style={{ border: "1px solid #1e7e34", padding: 8 }}>
                      {p.phoneNumber}
                    </td>
                    <td style={{ border: "1px solid #1e7e34", padding: 8 }}>
                      <button
                        style={{
                          background: "#1e7e34",
                          color: "#fff",
                          border: "none",
                          borderRadius: 4,
                          padding: "4px 12px",
                          cursor: "pointer",
                        }}
                        onClick={() =>
                          alert(`Action for ${p.firstName} ${p.lastName}`)
                        }
                      >
                        Action
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default PatientsBySpecialization;
