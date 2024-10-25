import React, { useEffect, useState, useCallback } from 'react';
import Select from 'react-select';
import toast from 'react-hot-toast';
import { BsTrash } from 'react-icons/bs';
import { RiCloseFill } from 'react-icons/ri';
import { get, post } from '../../utility/fetch';
import TextArea from '../UI/TextArea';
import debounce from 'lodash.debounce'; // Import debounce from lodash

function AddTreatment({ closeModal, visit, id, fetchData }) {
    const [carePlan, setCarePlan] = useState('');
    const [diagnosis, setDiagnosis] = useState('');
    const [medications, setMedications] = useState([]);
    const [otherMedications, setOtherMedications] = useState([]);
    const [newOtherMedication, setNewOtherMedication] = useState('');
    const [loading, setLoading] = useState(false);
    const [treatmentCategories, setTreatmentCategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState(1);
    const [admissionStatus, setAdmissionStatus] = useState('Not To Be Admitted');
    const [selectedMedication, setSelectedMedication] = useState(null); // State for React Select
    const [medicationOptions, setMedicationOptions] = useState([]); // State for fetched medication options
    const [hmo, setHmo] = useState(null);

    const fetchTreatmentCategory = async () => {
        try {
            const response = await get('/patients/get-all-categories');
            setTreatmentCategories(response);
        } catch (error) {
            console.log(error);
        }
    };

    // Fetch Medications from API with Filter Query (Debounced)
    const fetchMedications = async (filterOn = 'name', filterQuery = ' ', pageNumber = 1, itemsPerPage = 10) => {
        try {
            const response = await get(`/pharmacyinventory/filter-list/${filterOn}/${filterQuery}/${pageNumber}/${itemsPerPage}`);
            const data = response?.resultList
            console.log(response);
            // Map the response to a format usable by React Select
            const options = data?.map((med) => ({
                value: med?.id, // or med.code if you have it
                label: med?.productName, // Adjust this based on your response structure
            }));

            setMedicationOptions(options); // Set options for the dropdown
            setSelectedMedication(null); // Clear selection after fetching data
        } catch (error) {
            console.log(error);

        }
    };

    const fetchPatientHMO = async () => {
        try {
            const response = await get(`/hmo/get-patient-hmo/${id}`);
            console.log(response.data);
            setHmo(response?.data[0]);
        } catch (error) {
            console.log(error);
        }
    };
    const addMedicationFromDropdown = () => {
        if (selectedMedication) {
            setMedications([...medications, {
                name: selectedMedication.label,
                pharmacyInventoryId: selectedMedication.value, // Save the medication ID (value) here
                quantity: '',
                frequency: '',
                duration: ''
            }]);
            setSelectedMedication(null); // Clear selection after adding
        } else {
            toast.error('Please select a valid medication');
        }
    };

    const addOtherMedication = () => {
        if (newOtherMedication) {
            setOtherMedications([...otherMedications, { name: newOtherMedication, quantity: '', frequency: '', duration: '' }]);
            setNewOtherMedication('');
        } else {
            toast.error('Please enter the other medication name');
        }
    };

    const removeMedication = (index, type) => {
        if (type === 'medications') {
            const updatedMedications = [...medications];
            updatedMedications.splice(index, 1);
            setMedications(updatedMedications);
        } else if (type === 'otherMedications') {
            const updatedOtherMedications = [...otherMedications];
            updatedOtherMedications.splice(index, 1);
            setOtherMedications(updatedOtherMedications);
        }
    };

    const handleMedicationChange = (index, field, value, type = 'medications') => {
        const updatedMedications = [...(type === 'medications' ? medications : otherMedications)];

        let updatedValue = value;
        if (['duration', 'frequency', 'quantity'].includes(field)) {
            updatedValue = parseInt(value, 10) || 0;
        }

        updatedMedications[index] = {
            ...updatedMedications[index],
            [field]: updatedValue,
        };

        if (type === 'medications') {
            setMedications(updatedMedications);
        } else {
            setOtherMedications(updatedMedications);
        }
    };
    const addTreatment = async () => {
        if (diagnosis === '' || carePlan === '') {
            toast.error('Please fill in all fields');
            return;
        }

        const dateOfVisit = new Date(visit?.appointDate).toISOString();
        setLoading(true);

        // Prepare the medications payload with pharmacyInventoryId
        const formattedMedications = medications.map((med) => ({
            pharmacyInventoryId: med.pharmacyInventoryId, // Using the selected medication's ID
            quantity: med.quantity,
            frequency: med.frequency,
            duration: med.duration,
        }));

        // Prepare the otherMedications payload
        const formattedOtherMedications = otherMedications.map((med) => ({
            name: med.name,
            quantity: med.quantity,
            frequency: med.frequency,
            duration: med.duration,
        }));

        // Construct the payload in the required format
        const payload = {
            dateOfVisit: dateOfVisit,
            treatmentCategoryId: selectedCategoryId,
            diagnosis,
            medications: formattedMedications,
            otherMedications: formattedOtherMedications,
            carePlan,
            isAdmitted: admissionStatus === 'Admitted',
            hmoId: hmo?.hmoProviderId,
            hmoPackageId: hmo?.hmoPackageId,
        };

        console.log(payload);

        try {
            await post(`/patients/${id}/appoint/${visit?.id}/addtreatmentprescription`, payload);
            await fetchData();
            toast.success('Treatment added successfully');
            closeModal();
        } catch (error) {
            toast.error('Error adding treatment');
            console.log(error);
        }
        setLoading(false);
    };


    // Debounced Search Function for Medications
    const debouncedFetchMedications = useCallback(
        debounce((query) => {
            fetchMedications('name', query); // Fetch medications based on typed query
        }, 300), // 300ms debounce
        []
    );

    // Handle input change in React Select's input field for searching medications
    const handleInputChange = (inputValue) => {
        debouncedFetchMedications(inputValue); // Trigger debounced API call
    };

    useEffect(() => {
        fetchTreatmentCategory();
        fetchPatientHMO();
        fetchMedications();
    }, []);

    return (
        <div className='overlay'>
            <RiCloseFill className='close-btn pointer' onClick={closeModal} />
            <div className="modal-box max-w-600">
                <div className="p-40">
                    <h3 className="bold-text">Add Treatment</h3>

                    {/* Treatment Category */}
                    <div className="w-100 m-t-20 flex">
                        <label htmlFor="category" className='label'>Treatment Category</label>
                        <select id="category" className="input-field" value={selectedCategoryId} onChange={(e) => setSelectedCategoryId(e.target.value)}>
                            {treatmentCategories.map(category => (
                                <option key={category.id} value={category.id}>{category.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Admission Status */}
                    <div className="w-100 m-t-20 flex">
                        <label htmlFor="admission" className='label'>Admission Status</label>
                        <select id="admission" className="input-field" value={admissionStatus} onChange={(e) => setAdmissionStatus(e.target.value)}>
                            <option value="To Be Admitted">To Be Admitted</option>
                            <option value="Not To Be Admitted">Not To Be Admitted</option>
                        </select>
                    </div>

                    {/* Medications from API */}
                    <div className='m-t-20'>
                        <Select
                            options={medicationOptions} // Use fetched medication options
                            value={selectedMedication}
                            onChange={setSelectedMedication}
                            placeholder="Select a medication"
                            onInputChange={handleInputChange} // Trigger fetch on input change
                            isClearable
                        />
                        <button className="btn m-t-10" onClick={addMedicationFromDropdown}>Add Medication</button>
                    </div>

                    {/* Table for Medications */}
                    {medications.length > 0 && (
                        <div className='m-t-20'>
                            <h4>Medications</h4>
                            <table className="bordered-table-2 m-t-10">
                                <thead>
                                    <tr>
                                        <th>s/n</th>
                                        <th>Medication</th>
                                        <th>Quantity</th>
                                        <th>Frequency</th>
                                        <th>Duration</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {medications.map((med, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{med.name}</td>
                                            <td>
                                                <input
                                                    type="number"
                                                    className="input-field-table"
                                                    value={med.quantity}
                                                    onChange={(e) => handleMedicationChange(index, 'quantity', e.target.value, 'medications')}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    className="input-field-table"
                                                    value={med.frequency}
                                                    onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value, 'medications')}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    className="input-field-table"
                                                    value={med.duration}
                                                    onChange={(e) => handleMedicationChange(index, 'duration', e.target.value, 'medications')}
                                                />
                                            </td>
                                            <td>
                                                <BsTrash
                                                    className="text-red pointer"
                                                    onClick={() => removeMedication(index, 'medications')}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Input for adding Other Medications */}
                    <div className='m-t-20'>
                        <input
                            type="text"
                            className="input-field"
                            placeholder="Enter other medication"
                            value={newOtherMedication}
                            onChange={(e) => setNewOtherMedication(e.target.value)}
                        />
                        <button className="btn m-t-10" onClick={addOtherMedication}>Add Other Medication</button>
                    </div>

                    {otherMedications.length > 0 && (
                        <div className='m-t-10'>
                            <h4>Other Medications</h4>
                            <table className="bordered-table-2 m-t-10">
                                <thead>
                                    <tr>
                                        <th>s/n</th>
                                        <th>Medication</th>
                                        <th>Quantity</th>
                                        <th>Frequency</th>
                                        <th>Duration</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {otherMedications.map((med, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{med.name}</td>
                                            <td>
                                                <input
                                                    type="text"
                                                    className="input-field-table"
                                                    value={med.quantity}
                                                    onChange={(e) => handleMedicationChange(index, 'quantity', e.target.value, 'otherMedications')}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    className="input-field-table"
                                                    value={med.frequency}
                                                    onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value, 'otherMedications')}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    className="input-field-table"
                                                    value={med.duration}
                                                    onChange={(e) => handleMedicationChange(index, 'duration', e.target.value, 'otherMedications')}
                                                />
                                            </td>
                                            <td>
                                                <BsTrash
                                                    className="text-red pointer"
                                                    onClick={() => removeMedication(index, 'otherMedications')}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <TextArea label="Patient Diagnosis" name="diagnosis" onChange={(e) => setDiagnosis(e.target.value)} />
                    <TextArea label="Add Care Plan" name="carePlan" onChange={(e) => setCarePlan(e.target.value)} />

                    <button className="btn m-t-20 w-100" onClick={addTreatment} disabled={loading}>Add Treatment</button>
                </div>
            </div>
        </div>
    );
}

export default AddTreatment;