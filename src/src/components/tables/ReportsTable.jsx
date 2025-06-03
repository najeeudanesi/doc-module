import React from "react";
import { formatDate } from "../../utility/general";

function ReportsTable({ data, id }) {
    console.log(data?.resultList);
    return (
        <div className="w-100 ">
            <div className="w-100 none-flex-item m-t-40">
                <table className="bordered-table-2">
                    <thead className="border-top-none">
                        <tr className="border-top-none">

                            <th>Age</th>
                            <th>Diagnosis</th>
                            <th className="w-25">Name</th>
                            <th>Test Requests</th>
                            <th>Other Requests</th>
                            <th>Status</th>
                            <th>Date Requested</th>

                            {/* <th className="w-25">Patient Id</th> */}

                        </tr>
                    </thead>

                    <tbody className="white-bg view-det-pane">
                        {data?.resultList?.map(row => (
                            <tr key={row?.id}>

                                <td>{row?.age}</td>

                                <td>{row?.diagnosis}</td>
                                <td>{row?.patientFullName}</td>


                                <td>{row?.testRequests?.map((test, index) => <div key={index}><div><b>Lab Request</b> {test?.labTest} </div><div> <b>lab Center</b> {test?.labCentre}</div></div>)}</td>

                                <td>{row?.otherTestRequests?.map((test, index) => <div key={index}><div><b>Lab Request</b> {test?.labTest} </div><div> <b>lab Center</b> {test?.labCentre}</div></div>)}</td>

                                <td>{row?.status}</td>
                                <td>{row?.createdAt && formatDate(row?.createdAt)}</td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ReportsTable;
