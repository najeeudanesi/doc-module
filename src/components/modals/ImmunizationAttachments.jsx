import React, { useState } from 'react';
import { RiCloseFill } from 'react-icons/ri'

function ImmunizationAttachment({ closeModal, data }) {
    return (
        <div className='overlay'>
            <RiCloseFill className='close-btn pointer' onClick={closeModal} />
            <div className="modal-box max-w-600">
                <div className="p-40">
                    <h3 className="bold-text">Attachments</h3>
                </div>
            </div>
        </div>

    )
}

export default ImmunizationAttachment