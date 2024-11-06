import React, { useEffect, useState } from 'react';
import { RiCloseFill } from 'react-icons/ri'
import { get } from "../../utility/fetch";
import { formatDate } from '../../utility/general';
import TextArea from '../UI/TextArea';
import { useNavigate } from 'react-router-dom';
import InputField from '../UI/InputField';

function NurseNotesTreatment({ data, patientId, closeModal }) {
    const [visits, setVisits] = useState([]);
    const [lastVisit, setLastVisit] = useState(null);
    const [loading, setLoading] = useState(null);
    const [nurseNotes, setnurseNotes] = useState([]);


    const fetchData = async () => {
        try {
            const response = await get(`/patients/${patientId}/visitrecord`);

            setVisits(response);
            setLastVisit(response[response.length - 1] || null);


            const res = await get(`/patients/${patientId}/nursenotes/${data?.visitId}`);
            setnurseNotes(res.notes);

        }
        catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        fetchData();
    }, [])
    return (
        <div className='overlay'>
            <RiCloseFill className='close-btn pointer' onClick={closeModal} />
            <div className="modal-box max-w-800">
                <div className="p-40">
                    <h3 className="bold-text">NurseNotes</h3>
                    <table className="bordered-table text-sm">
                        <thead className="border-top-none">
                            <tr className="border-top-none">
                                <th className="w-20">Date</th>
                                <th>Age</th>
                                <th>Weight</th>
                                <th>Temp</th>
                                <th>Diagnosis</th>
                                <th>Medication/Prescription</th>


                            </tr>
                        </thead>
                        <tbody>

                            <td>{formatDate(data?.dateOfVisit)}</td>
                            <td>{data?.age}</td>
                            <td>{data?.weight}</td>
                            <td>{data?.temperature}</td>
                            <td className>{data?.diagnosis}</td>
                            <td><div>{data?.medications.map((medication, index) => (
                                <div className="text-start m-t-10" key={index}>{index + 1 + ". "}{medication.name}</div>
                            ))}</div>
                                <div className="text-start flex gap-4 m-t-10">

                                    <u className="bold-text">Care Plan: </u>
                                    <p className="text-gray"> {data?.carePlan}</p></div>
                            </td>

                        </tbody>
                    </table>

                    {
                        lastVisit ? (<> <div className='m-t-20'>
                            <InputField label="Assigned Doctor" name="notes" value={lastVisit?.doctorName} disabled={true} />
                        </div>
                            <div className='m-t-20'>
                                <InputField label="Assigned Nurse" name="notes" value={lastVisit?.nurseName} disabled={true} />
                            </div></>) : (<><div>Loading...</div></>)
                    }



                    {
                        nurseNotes &&

                        nurseNotes.map((data, index) => (
                            <div key={index}>
                                <TextArea label="Notes" name="notes" value={data.note} disabled={true} />
                            </div>
                        )

                        )
                    }
                </div>


            </div>
        </div>

    )
}

export default NurseNotesTreatment