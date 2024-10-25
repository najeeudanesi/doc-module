import React from 'react';
import { RiCloseFill } from 'react-icons/ri';

function MedicationDetails({ data, otherData, closeModal }) {
    return (
        <div className='overlay'>
            <RiCloseFill className='close-btn pointer' onClick={closeModal} />

            <div className="modal-box max-w-800">
                <div className="p-40">
                    {/* Table for Medications */}
                    <h3>Medications</h3>
                    <table className="bordered-table-2 m-t-20">
                        <thead className='border-top-none'>
                            <tr>
                                <th className='w-20'>s/n</th>
                                <th className='w-40'>Medication</th>
                                <th className='w-20'>Dosage Quantity</th>
                                <th className='w-20'>Dosage Frequency</th>
                                <th className='w-20'>Dosage Duration</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.map((med, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{med?.name}</td>
                                    <td>{med?.quantity}mg</td>
                                    <td>{med?.frequency} times per day</td>
                                    <td>{med?.duration} days</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Table for Other Medications */}
                    <h3 className='m-t-40'>Other Medications</h3>
                    <table className="bordered-table-2 m-t-20">
                        <thead className='border-top-none'>
                            <tr>
                                <th className='w-20'>s/n</th>
                                <th className='w-40'>Medication</th>
                                <th className='w-20'>Dosage Quantity</th>
                                <th className='w-20'>Dosage Frequency</th>
                                <th className='w-20'>Dosage Duration</th>
                            </tr>
                        </thead>
                        <tbody>
                            {otherData?.map((med, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{med?.name}</td>
                                    <td>{med?.quantity}mg</td>
                                    <td>{med?.frequency} times per day</td>
                                    <td>{med?.duration} days</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default MedicationDetails;
