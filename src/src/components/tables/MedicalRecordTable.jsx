import React from "react";
import { formatDate } from "../../utility/general";

function MedicalRecordTable({ data }) {
    console.log(data)

    return (
        <div className="w-100 ">
            <div className="w-100 none-flex-item m-t-40">
                <table className="bordered-table-2">
                    <thead className="border-top-none">
                        <tr className="border-top-none">
                            <th className="w-20">Date</th>
                            <th>Medical Record/History</th>
                            <th>Doctor's sName</th>
                        </tr>
                    </thead>

                    <tbody className="white-bg view-det-pane">
                        {data.map((row, index) => (
                            <tr key={index}
                            >
                                <td> {row?.createdAt && formatDate(row.createdAt)}</td>
                                <td>{row.comment}</td>
                                <td>{row.doctor}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default MedicalRecordTable;
