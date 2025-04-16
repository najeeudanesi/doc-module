import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { RiCloseFill } from 'react-icons/ri';
import { post } from '../../utility/fetch';
import TextArea from '../UI/TextArea';
import SpeechToTextButton from '../UI/SpeechToTextButton';
import GhostTextCompletion from '../UI/TextPrediction';

function AddMedicalRecord({ closeModal, patientId, fetchData, medicalRecordType }) {

    const [name, setName] = useState('');
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [payload, setPayload] = useState({})


    const addMedicalRecord = async () => {
        if (!comment) {
            toast("Please fill in fields")
            return;
        }
        setLoading(true);
        setPayload({

            comment: comment,
            patientId: parseInt(patientId, 10)
        });
        console.log(payload);
        try {
            await post(`/patients/addmedicalrecord`, payload);
            await fetchData();
            toast.success('Medical record added successfully');
            closeModal();
        } catch (error) {
            toast.error('Error adding medical record');
            console.log(error);
        }
        setLoading(false);
    };

    const handleTranscript = (transcript) => {
        setComment(comment + transcript)
    };

    return (
        <div className='overlay'>
            <RiCloseFill className='close-btn pointer' onClick={closeModal} />
            <div className="modal-box max-w-600">
                <div className="p-40">
                    <h3 className="bold-text">Add Medical Record</h3>

                    <div>

                        <GhostTextCompletion
                            label="Comment"
                            name="comment"
                            value={comment}
                            handleChange={(e) => setComment(e.target.value)}
                        />
                       
                    </div>
                    <button className="btn m-t-20 w-100" onClick={addMedicalRecord} disabled={loading}>Add Medical Record</button>
                </div>
            </div>
        </div>
    );
}

export default AddMedicalRecord;
