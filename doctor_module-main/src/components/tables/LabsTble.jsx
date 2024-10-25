import React, { useState } from "react";
import LabsAttachment from "../modals/LabsAttachment";
import { RiFilePaper2Line } from "react-icons/ri";
import { formatDate } from "../../utility/general";

function LabsTable({ data, id }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [attachments, setAttachments] = useState([]);
    const [patient, setPatient] = useState("");
    const [subject, setSubject] = useState("");
    const [fullData, setFullData] = useState(null);


    const toggleModal = () => {
        setModalOpen(!modalOpen);
    }

    const stageAttachments = (data) => {
        setAttachments(data?.patientLabDocuments)
        setPatient(data?.patientFullName)
        setSubject(data?.subject)
        setFullData(data)
        toggleModal();
    }

    return (
        <div className="w-100 ">
            <div className="w-100 none-flex-item m-t-40">
                <table className="bordered-table-2">
                    <thead className="border-top-none">
                        <tr className="border-top-none">

                            <th>Age</th>
                            <th>Diagnosis</th>
                            <th className="w-25">Lab Requests</th>
                            <th>Date Created</th>
                            <th className="w-25">Attatchment</th>

                        </tr>
                    </thead>

                    <tbody className="white-bg view-det-pane">
                        {data.map((row) => (
                            <tr key={row.id}>
                                <td>{row?.age}</td>
                                <td>{row?.diagnosis}</td>
                                <td ><ol>{row?.patientTestRequests.map((request, index) => (
                                    <li className="text-start m-t-10" key={index}>{request.labTest}</li>
                                ))}</ol></td>
                                <td >{formatDate(row?.createdOn)}</td>
                                <td ><div className="rounded-btn-yellow w-75 flex flex-v-center gap-2 flex-h-center" onClick={(() => stageAttachments(row))}><RiFilePaper2Line /> Lab Results</div></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {
                modalOpen && (
                    <LabsAttachment closeModal={toggleModal} data={attachments} patient={patient
                    } subject={subject} fullData={fullData} />
                )
            }
        </div>
    );
}

export default LabsTable;
