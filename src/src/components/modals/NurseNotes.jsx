import React, { useEffect, useState } from 'react';
import { RiCloseFill } from 'react-icons/ri'
import { get } from "../../utility/fetch";
import { formatDate } from '../../utility/general';
import TextArea from '../UI/TextArea';
import { useNavigate } from 'react-router-dom';
import InputField from '../UI/InputField';

function NurseNotes({ data, patientId, closeModal, isFacilityView }) {

    const [loading, setLoading] = useState(null);
    const [nurseNotes, setnurseNotes] = useState([]);
    const navigate = useNavigate();

    const fetchData = async () => {
        try {

            const res = await get(`/patients/${patientId}/nursenotes/${data?.id}`);
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
                    {
                        data ? (
                            <div>
                                <table className="bordered-table text-sm">
                                    <thead className="border-top-none">
                                        <tr className="border-top-none">
                                            <th className="">Date</th>

                                            <th>Weight</th>
                                            <th>Temp</th>
                                            <th>Height</th>
                                            <th>BMI</th>
                                            <th>Heart</th>
                                            <th>Respiratory</th>
                                            <th>Blood Pressure</th>


                                        </tr>
                                    </thead>
                                    <tbody>
                                        <td>{formatDate(data?.dateOfVisit)}</td>

                                        <td>{data?.weight}</td>
                                        <td>{data?.temperature}</td>
                                        <td>{data?.height}</td>
                                        <td>{data?.bmi}</td>
                                        <td>{data?.heartPulse}</td>
                                        <td>{data?.respiratory}</td>
                                        <td>{data?.bloodPressure}</td>

                                    </tbody>
                                </table>

                                {/* <div className='m-t-20'>
                                    <InputField label="Assigned Doctor" name="notes" value={data?.doctorName} disabled={true} />
                                </div> */}
                                <div className='m-t-20'>
                                    <InputField label="Assigned Nurse" name="notes" value={data?.vitalNurseName} disabled={true} />
                                </div>

                                {
                                    nurseNotes &&

                                    data.notes.map((data, index) => (
                                        <div key={index}>
                                            <TextArea label="Notes" name="notes" value={data} disabled={true} />
                                        </div>
                                    )

                                    )
                                }
                            </div>
                        ) : (<>Loading ...</>)
                    }
                </div>
                {isFacilityView && <div className="bold-text p-20 pointer" onClick={() => navigate(`/doctor/patients/patient-details/${patientId}`)}><u>View patient's file </u></div>}

            </div>
        </div>

    )
}

export default NurseNotes