import React, { useEffect, useState } from 'react';
import { RiCloseFill, RiFileDownloadFill } from 'react-icons/ri';
import InputField from '../UI/InputField';
import toast from 'react-hot-toast';

function LabsAttachment({ closeModal, data, subject, patient, fullData }) {
    const [images, setImages] = useState({});
    const [documents, setDocuments] = useState({});

    useEffect(() => {
        const fetchAndRenderFiles = async () => {
            const newImages = {};
            const newDocuments = {};

            for (const item of data) {
                try {
                    // Get the token from session storage
                    const token = sessionStorage.getItem('token')?.split('Bearer ')[1];

                    // If token is not available, handle accordingly
                    if (!token) {
                        console.error('Token not found in session storage');
                        toast.error('Authorization token not found');
                        continue;
                    }

                    // Construct the URL with the document name
                    const url = `https://edogoverp.com/labapi/api/document/view-document/${item.docName}`;

                    // Fetch options including the Authorization header with the JWT token
                    const options = {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    };

                    // Fetch the file
                    const response = await fetch(url, options);

                    // Check if the request was successful
                    if (response.ok) {
                        // Get the content type of the response
                        const contentType = response.headers.get('Content-Type');

                        // Convert response body to a blob
                        const blob = await response.blob();

                        // Create a URL for the blob
                        const blobUrl = URL.createObjectURL(blob);

                        // Check if the file is an image
                        if (contentType.startsWith('image/')) {
                            newImages[item.docName] = blobUrl;
                        } else {
                            newDocuments[item.docName] = blobUrl;
                        }
                    } else {
                        console.error('Failed to fetch document:', response.statusText);
                    }
                } catch (e) {
                    console.error('Error fetching document:', e);
                }
            }

            setImages(newImages);
            setDocuments(newDocuments);
        };

        // Fetch and render the documents
        fetchAndRenderFiles();
    }, [data]);

    return (
        <div className='overlay'>
            <RiCloseFill className='close-btn pointer' onClick={closeModal} />
            <div className="modal-box max-w-800">
                <div className="p-40">
                    <div className='flex space-between bold-text'>{patient + " "}lab report</div>
                    <InputField value={subject} label="Subject" />
                    <div className='flex flex-v-center m-t-10 '>
                        <div className='comment-btn w-100 p-10 bold-text'>Lab Findings</div>
                    </div>
                    <div className='outline-box p-10'>{fullData?.labFindings}</div>
                    {
                        data.map((item, i) => (
                            <div key={i} className='m-t-30'>
                                <div className='bold-text'>{new Date(item?.createdOn).toLocaleDateString()}</div>
                                {images[item.docName] ? (
                                    <div className='m-t-30 flex flex-h-center'>
                                        <img src={images[item.docName]} alt="Lab Attachment" style={{ maxWidth: '100%' }} />
                                    </div>
                                ) : documents[item.docName] ? (
                                    <div className='m-t-30'>
                                        <a href={documents[item.docName]} download={item.docName} className='text-green pointer'>
                                            <RiFileDownloadFill size={24} /> Download Document
                                        </a>
                                    </div>
                                ) : (
                                    <></>
                                )}
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    );
}

export default LabsAttachment;
