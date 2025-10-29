import React, { useState } from "react";
import { get } from "../../../utility/fetchLab";
import "./labrequestTable.css";
import moment from "moment";
import LabReportTable from "./LabReports";

const LabRequestTable = ({ data, isFamily, treatmentId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentDetail, setcurrentDetail] = useState([]);
  const [patientsLabReport, setpatientsLabReport] = useState([]);

  const [opens2, setopens2] = useState(false);
  const [openRow, setOpenRow] = useState(null); // Tracks which row is expanded
  const [reportMap, setReportMap] = useState({}); // Store fetched reports by labRequestId

  const fetchLabData = async (
    patientId,
    labRequestId,
    isFamilyMedicine = true
  ) => {
    if (openRow === labRequestId) {
      setOpenRow(null); // Collapse if already open
      return;
    }

    setIsLoading(true);
    try {
      // const url = `/patients/list/${isFamily}/${treatmentId}/1/100/report`;
      // const url = `/patientinternallabreport/internal-lab-report/lab-request/${labRequestId}`;

      // const response = await get(`/patientinternallabreport/internal-lab-report/lab-request/${labRequestId}`);
      let res = await get({
        // endpoint: `patientlabreport/patient-report/${patientId?.id}/labtechnician/${userAuth?.resultList?.userId}`,
        endpoint: `/patientinternallabreport/internal-lab-report/lab-request/${labRequestId}`,
        // body: formData,
        // auth: false,
      });
      console.log(res);
      // setcurrentDetail(res?.data?.data)
      setpatientsLabReport(res?.data);
      setopens2(true);

      return;
      // setReportMap((prev) => ({ ...prev, [labRequestId]: response?.data?.resultList[0] }));
      // console.log({ [labRequestId]: response.data.resultList[0] });
      // setOpenRow(labRequestId);
    } catch (e) {
      console.error("Error fetching lab report:", e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="overflow-x-auto">
      {isLoading && (
        <p className="mb-2 text-sm text-blue-600">Loading report...</p>
      )}

      <table className="min-w-full readonly-table border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Date</th>
            <th className="border p-2">Patient Name</th>
            <th className="border p-2">Diagnosis</th>
            <th className="border p-2">Lab Centre</th>
            <th className="border p-2">Lab Test</th>
            <th className="border p-2">Note</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((request) => {
            // request?.map((test) => {
            const isOpen = openRow === request?.id;
            const report = reportMap[request?.id];

            return (
              <React.Fragment key={request?.id}>
                <tr>
                  <td className="border p-2">
                    <p>{moment(request?.createdAt).format("ll")}</p>
                    <p>{moment(request?.createdAt).format("hh:mm:ss")}</p>
                  </td>
                  <td className="border p-2">{request?.patientFullName}</td>
                  <td className="border p-2">{request?.diagnosis}</td>
                  <td className="border p-2">
                    {request?.testRequests?.map((e) => (
                      <li>{e.labCentre}</li>
                    ))}
                  </td>
                  <td className="border p-2">
                    {request?.testRequests?.map((e) => (
                      <li>{e?.internalLabService?.name || e?.labTest?.name}</li>
                    ))}
                  </td>
                  {/* <td className="border p-2">{request?.labTest}</td> */}
                  <td className="border p-2">{request?.additionalNote}</td>
                  <td className="border p-2">{request?.status}</td>
                  <td className="border p-2">
                    {request?.status == "Attended" && (
                      <button
                        className="btn"
                        onClick={() => {
                          fetchLabData(request?.patientId, request?.id);
                          setcurrentDetail(request);
                        }}
                      >
                        {isOpen ? "Hide results" : "View results"}
                      </button>
                    )}
                  </td>
                </tr>
              </React.Fragment>
            );
          })}
        </tbody>
      </table>

      {opens2 && (
        <LabReportTable
          open={opens2}
          onClose={() => {
            setopens2(false);
          }}
       patientInfo={patientsLabReport}
          labreports={patientsLabReport}
        />

        // <tr>
        //   <td
        //     colSpan={6}
        //     style={{ backgroundColor: "#f9fafb", padding: "px" }}
        //   >
        //     <div className="report-card">
        //       <div className="field-column">
        //         <label className="report-label">Subject</label>
        //         <p className="report-text">{report.subject}</p>
        //       </div>

        //       <div className="field-column">
        //         <label className="report-label">Lab Findings</label>
        //         <p className="report-text">{report.labFindings}</p>
        //       </div>

        //       <div className="field-column">
        //         <label className="report-label">Lab Documents</label>
        //         {report.patientLabDocuments?.length > 0 ? (
        //           <div className="report-docs">
        //             {report.patientLabDocuments.map((doc) => (
        //               <a
        //                 key={doc.id}
        //                 href={`https://edogoverp.com/labapi/api/document/view-document/${doc.docName}`}
        //                 target="_blank"
        //                 rel="noopener noreferrer"
        //               >
        //                 {doc.docName}
        //               </a>
        //             ))}
        //           </div>
        //         ) : (
        //           <p className="report-text">
        //             No documents available.
        //           </p>
        //         )}
        //       </div>
        //     </div>
        //   </td>
        // </tr>
      )}
    </div>
  );
};

export default LabRequestTable;
