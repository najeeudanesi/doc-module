import React from 'react';
import { RiCloseFill } from 'react-icons/ri';
import TextArea from '../UI/TextArea';
import { formatDate } from "../../utility/general";

function ViewVisit({ closeModal, visit, next }) {
    return (
        <div className='overlay'>
            <RiCloseFill className='close-btn pointer' onClick={closeModal} />
            <div className="modal-box max-w-600">
                <div className="p-40">
                    <h3 className="bold-text">Vitals</h3>

                    <table className="bordered-table">
                        <thead className="border-top-none">
                            <tr className="border-top-none">
                                <th className="w-20">Date</th>
                                <th>Weight</th>
                                <th>Temp</th>
                                <th>Height</th>
                                <th>BMI</th>
                                <th>Heart</th>
                                <th>Respiratory</th>
                                <th>Blood Pressure</th>
                            </tr>
                        </thead>

                        <tbody className="white-bg view-det-pane">

                            <tr >
                                <td>{formatDate(visit.dateOfVisit)}</td>

                                <td>{visit.weight}</td>

                                <td>{visit.temperature}</td>
                                <td>{visit.height}</td>
                                <td>{visit.bmi}</td>
                                <td>{visit.heartPulse}</td>
                                <td>{visit.respiratory}</td>
                                <td>{visit.bloodPressure}</td>



                            </tr>


                        </tbody>
                    </table>

                    <TextArea label="Assigned Nurse" name="assignedNurse" value={visit.nurseName} disabled={true} />
                    <TextArea label="Assigned Doctor" name="assignedDoctor" value={visit.doctorName} disabled={true} />
                    <button className="btn m-t-20 w-100" onClick={() => next()}>Proceed to Treatment and Diagnosis</button>
                </div>
            </div>
        </div>
    );
}

export default ViewVisit;
