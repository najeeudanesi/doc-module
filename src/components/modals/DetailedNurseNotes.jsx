import React, { useEffect, useState } from "react";
import { get, post } from "../../utility/fetch";
import notification from "../../utility/notification";
import TagInputs from "../layouts/TagInputs";
import { RiCloseFill, RiDeleteBinLine } from "react-icons/ri";
import NurseNoteTreatment from "./NurseNoteTreatment";

function DetailedNurseNotes({ closeModal, treatment, doctors, nurses, patientId, patientName }) {
    const [nurseNotesModal, setNurseNotesModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [notes, setNotes] = useState([]);
    const [viewing, setViewing] = useState({});
    const [add, setAdd] = useState(false);

    const [documentArray, setDocumentArray] = useState([]);
    const [NotesModal, setNotesModal] = useState(false)


    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const deleteDoc = (doc) => {
        let newArr = documentArray.filter((id) => id.name !== doc);
        setDocumentArray(newArr);
    };

    const getPrescriptionLog = async () => {
        try {
            const res = await get(`/patients/prescription-log?treatmentId=${treatment?.id}`);
            setNotes(res);
            setTotalPages(res.length);
        } catch (error) {
            console.error("Error fetching prescription log:", error);
        }
    };

    const addConsent = async () => {
        const payload = {
            id: 0,
            patientId: Number(patientId),
            clinicId: Number(sessionStorage.getItem("clinicId")),
            appointmentId: treatment?.appointmentId,
            docName: documentArray[0]?.name,
            docPath: documentArray[0]?.path
        };
        try {
            let res = await post(`/patients/AddConsent`, payload);
            if (res?.appointmentId) {
                notification({ message: 'Consent added successfully', type: 'success' });
                setDocumentArray([]);
            } else {
                notification({ message: 'Failed to add consent', type: 'error' });
            }
        } catch (error) {
            console.error("Error adding consent:", error);
        }
    };

    useEffect(() => {
        getPrescriptionLog();
    }, []);

    const selectRecord = (record) => () => {
        setViewing(record);
        setNotesModal(true);
    };

    const currentNote = notes[currentPage - 1];

    return (
        <div className='overlay'>
            <RiCloseFill className='close-btn pointer' onClick={closeModal} />
            <div className="modal-content">
                <div className="flex space-between">
                    <div className="flex flex-v-center m-t-20 m-l-10 col-6">
                        <p className="bold-text m-r-10">Nurse Notes</p> | <p className="m-l-10">{patientName}</p>
                    </div>
                    
                </div>
                <div>
                    <table className="bordered-table-2">
                        <thead className="border-top-none">
                            <tr className="border-top-none">
                                <th className="center-text">Date</th>
                                <th className="center-text">Age</th>
                                <th className="center-text">Weight (Kg)</th>
                                <th className="center-text">Temperature (°C)</th>
                                <th className="center-text">Admin Nurse</th>
                                {/* <th className="center-text">Nurse Note</th> */}
                                <th className="center-text">Diagnosis</th>
                                <th className="center-text">Care Plan</th>
                            </tr>
                        </thead>
                        <tbody className="white-bg view-det-pane">
                            <tr key={treatment?.id}>
                                <td>{new Date(treatment?.dateOfVisit).toLocaleDateString()}</td>
                                <td>{treatment?.age}</td>
                                <td>{treatment?.weight}</td>
                                <td>{treatment?.temperature}</td>
                                <td>{treatment?.nurseName}</td>
                                {/* <td onClick={selectRecord(treatment)}>
                                    <img className="hovers pointer" src="/details.png" alt="Details" />
                                </td> */}
                                <td style={{ maxWidth: '650px', whiteSpace: 'wrap', textAlign: 'left', paddingLeft: '12px' }}>
                                    {treatment?.diagnosis}
                                </td>
                                <td style={{ maxWidth: '650px', whiteSpace: 'wrap', textAlign: 'left', paddingLeft: '12px' }}>
                                    {treatment?.carePlan}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {currentNote && (
                    <>
                        <div className="m-t-20">
                            <h4>Admistration Information</h4>
                            <table className="bordered-table-2">
                                <thead>
                                    <tr>
                                        <th>Medication Name</th>
                                        <th>Volume Given</th>
                                        <th>Units</th>
                                        <th>Administered By</th>
                                        <th>Notes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{currentNote.medicationName}</td>
                                        <td>{currentNote.volumeGiven}</td>
                                        <td>{currentNote.units}</td>
                                        <td>{currentNote.administeredBy}</td>
                                        <td>{currentNote.otherNotes}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="flex">
                            <div>
                                <div className="w-100 flex m-t-20">
                                    <TagInputs
                                        style={{ borderRight: "none" }}
                                        label={currentNote?.createdAt ? new Date(currentNote?.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Date'}
                                        name="additionalNoteOnTreatment"
                                        value={currentNote?.createdAt ? new Date(currentNote?.createdAt).toLocaleDateString() : ''}
                                        readOnly={true}
                                    />
                                    <TagInputs label="Nurse" value={currentNote?.administeredBy} readOnly={true} />
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* <div className="w-100 flex flex-h-end flex-direction-v">
                    <div className="m-t-20 m-b-20">
                        {documentArray?.map((item, index) => (
                            <div key={index} className="flex">
                                <a href={item.path} target="_blank" className="m-r-10">
                                    {item.name}
                                </a>
                                <RiDeleteBinLine color="red" className="pointer" onClick={() => deleteDoc(item.name)} />
                            </div>
                        ))}

                        {documentArray.length === 0 ? (
                            <div className="col-5">
                                <button onClick={addConsent} className="rounded-btn m-t-20 col-3">Attach file</button>
                            </div>
                        ) : null}
                    </div>
                </div> */}

                <div className="pagination flex space-between float-right col-6 m-t-20 m-b-80">
                    <div className="flex gap-8">
                        <div className="bold-text">Page</div>
                        <div>{currentPage}/{totalPages}</div>
                    </div>
                    <div className="flex gap-8">
                        <button
                            className={`pagination-btn ${currentPage === 1 ? 'disabled' : ''}`}
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={`page-${i + 1}`}
                                className={`pagination-btn ${currentPage === i + 1 ? 'bg-green text-white' : ''}`}
                                onClick={() => handlePageChange(i + 1)}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            className={`pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`}
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            

            {NotesModal && (
                <NurseNoteTreatment
                    visit={viewing}
                    notes={viewing?.nurseNotes}
                    add={add}
                    closeModal={closeModal}
                    doctors={doctors}
                    nurses={nurses}
                />
            )}
        </div>
    );
}

export default DetailedNurseNotes;
