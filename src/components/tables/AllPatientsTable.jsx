import React from "react";

const AllPatientsTable = ({ patients }) => {
  return (
    <div className="p-6 m-t-20">
      {/* <h2 className="text-2xl font-bold mb-4">Patient Records</h2> */}
      <div className="overflow-x-auto">
        <table style={{backgroundColor:'white'}} className="min-w-full border table-auto w-full bg-white border border-gray-300 border-gray-200 rounded-md shadow-sm bordered-table">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border">Ref</th>
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Gender</th>
              <th className="p-3 border">DOB</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Phone</th>
              <th className="p-3 border">State</th>
              <th className="p-3 border">LGA</th>
              <th className="p-3 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.patientId} className="hover:bg-gray-50">
                <td className="p-3 border">{patient.patientRef}</td>
                <td className="p-3 border">
                  {patient.firstName} {patient.lastName}
                </td>
                <td className="p-3 border">{patient.gender}</td>
                <td className="p-3 border">
                  {new Date(patient.dateOfBirth).toLocaleDateString()}
                </td>
                <td className="p-3 border">{patient.email}</td>
                <td className="p-3 border">{patient.phoneNumber}</td>
                <td className="p-3 border">{patient.stateOfOrigin}</td>
                <td className="p-3 border">{patient.lga}</td>
                <td className="p-3 border">{patient.maritalStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllPatientsTable;
