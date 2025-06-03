import React from "react";
import { formatDate } from "../../utility/general";

function ProceduresTable({ data, id, name }) {
    console.log(data?.resultList);
    return (
        <div className="w-100 ">
            <div className="w-100 none-flex-item m-t-40">
                <table className="bordered-table-2">
                    <thead className="border-top-none">
                        <tr className="border-top-none">

                            {/* <th>Age</th> */}
                            <th>Diagnosis</th>
                            <th className="w-25">Name</th>
                            <th>Procedure</th>
                            <th>Override Amount</th>
                            <th>Note</th>
                            <th>Date Requested</th>

                            {/* <th className="w-25">Patient Id</th> */}

                        </tr>
                    </thead>

                    <tbody className="white-bg view-det-pane">
                        {data?.resultList?.map(row => (
                            <tr key={row?.id}>

                                {/* <td>{row?.age}</td> */}

                                <td>{row?.diagnosis}</td>
                                <td>{name}</td>
                                <td>{row?.procedures}</td>
                                <td>{row?.overideAmount} NGN</td>
                                <td>{row?.additionalNote}</td>
                                <td>{row?.dateOfVisit && formatDate(row?.dateOfVisit)}</td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ProceduresTable;
