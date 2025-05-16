import React from 'react';

const HMOPatientListTable = ({ patients }) => {

  console.log(patients)
  return (
    <div className="p-4 m-t-20">
      {/* <h2 className="text-2xl font-bold mb-4">HMO Patient List</h2> */}
      <div className="overflow-x-auto">
        <table style={{backgroundColor:'white'}} className="table-auto w-full border border-gray-300 bg-white bordered-table">
          <thead className="">
            <tr>
              <th className="px-4 py-2 border">Patient Name</th>
              <th className="px-4 py-2 border">Provider</th>
              <th className="px-4 py-2 border">Package</th>
              <th className="px-4 py-2 border">Validity</th>
              <th className="px-4 py-2 border">Notes</th>
              <th className="px-4 py-2 border">Referred?</th>
            </tr>
          </thead>
          <tbody>
            {patients?.map((record) => (
              <tr key={record?.patientHMOId} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{record?.patientFullName}</td>
                <td className="px-4 py-2 border">{record?.hmoProviderName}</td>
                <td className="px-4 py-2 border">{record?.hmoPackageName}</td>
                <td className="px-4 py-2 border">
                  {new Date(record?.membershipValidity).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 border">{record?.notes || 'N/A'}</td>
                <td className="px-4 py-2 border">
                  {record?.isReferred ? 'Yes' : 'No'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HMOPatientListTable;
