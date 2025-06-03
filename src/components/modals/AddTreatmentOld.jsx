import React, { useEffect, useState, useCallback } from "react";
import Select from "react-select";
import toast from "react-hot-toast";
import { BsTrash } from "react-icons/bs";
import { RiCloseFill } from "react-icons/ri";
import { get, post } from "../../utility/fetch";
import { get as gets, post as posts } from "../../utility/fetch2";
import TextArea from "../UI/TextArea";
import debounce from "lodash.debounce"; // Import debounce from lodash
import SpeechToTextButton from "../UI/SpeechToTextButton";
import GhostTextCompletion from "../UI/TextPrediction";
import Suggestions from "../UI/Suggestions";
import PatientDetails from "../pages/PatientDetails";

function AddTreatment({
  closeModal,
  visit,
  id,
  fetchData,
  createTreatment,
  data,
  repeatedDiagnosis,
  setRepeatedDiagnosis,
}) {
  const [carePlan, setCarePlan] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [medications, setMedications] = useState([]);
  const [otherMedications, setOtherMedications] = useState([]);
  const [newOtherMedication, setNewOtherMedication] = useState("");
  const [loading, setLoading] = useState(false);
  const [treatmentCategories, setTreatmentCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(1);
  const [admissionStatus, setAdmissionStatus] = useState("Not To Be Admitted");
  const [selectedMedication, setSelectedMedication] = useState(null); // State for React Select
  const [medicationOptions, setMedicationOptions] = useState([]); // State for fetched medication options
  const [hmo, setHmo] = useState(null);
  const [sugesstPayload, setSuggPayload] = useState({ medications: [] });
  const [labs, setLabs] = useState([]);
  const [selectedLab, setSelectedLab] = useState(null);


  const routesOfAdministration = [
    { id: 1, name: "Orally" },
    { id: 2, name: "Sublingual" },
    { id: 3, name: "Topical" },
    { id: 4, name: "Inhalation" },
    { id: 5, name: "Suppository" },
    { id: 6, name: "IV" },
    { id: 7, name: "IM" },
    { id: 8, name: "Subcut" },
    { id: 9, name: "Intradermal" },
    { id: 10, name: "PerRectum" },
    { id: 11, name: "PerVagina" },
    { id: 12, name: "Implant" },
  ];

  const administrationFrequencies = [
    { id: 1, name: "Immediately" },
    { id: 2, name: "As needed" },
    { id: 3, name: "Once daily" },
    { id: 4, name: "Twice a day" },
    { id: 5, name: "Three times a day" },
    { id: 6, name: "Four times a day" },
    { id: 7, name: "At night" },
    { id: 8, name: "Morning" },
    { id: 9, name: "Evening" },
    { id: 10, name: "Every 24 hours" },
    { id: 11, name: "Every 12 hours" },
    { id: 12, name: "Every 8 hours" },
    { id: 13, name: "Every 6 hours" },
    { id: 14, name: "Every 4 hours" },
    { id: 15, name: "Every 3 hours" },
    { id: 16, name: "Every 2 hours" },
    { id: 17, name: "Every hour" },
    { id: 18, name: "Every 2 months" },
    { id: 19, name: "Every 3 months" },
    // Every 3 months
  ];


  console.log(visit)

  const fetchTreatmentCategory = async () => {
    try {
      const response = await get("/patients/get-all-categories");
      setTreatmentCategories(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setDiagnosis(repeatedDiagnosis);
    console.log(repeatedDiagnosis);
  }, [repeatedDiagnosis]);

  const drugMeasurementUnits = [
    { id: 1, name: "Milligrams", symbol: "mg" },
    { id: 2, name: "Grams", symbol: "g" },
    { id: 3, name: "Micrograms", symbol: "µg" },
    { id: 4, name: "Milliliters", symbol: "mL" },
    { id: 5, name: "Liters", symbol: "L" },
    { id: 6, name: "Units", symbol: "U" },
    { id: 7, name: "Puffs" },
    { id: 8, name: "Sprays" },
    { id: 9, name: "Drops" },
    { id: 10, name: "Patch" },
    { id: 11, name: "Bottle" },
    { id: 12, name: "Transdermal System" },
    { id: 13, name: "Tablet" },
    { id: 14, name: "Capsule" },
    { id: 15, name: "Suppository" },
    { id: 16, name: "Scoop" },
    { id: 17, name: "Sachet" },
    { id: 18, name: "Ampoule" },
    { id: 19, name: "Vial" },
    { id: 20, name: "Injection Pen" },
    { id: 21, name: "Enema" },
    { id: 22, name: "Ounces", symbol: "oz" },
    { id: 23, name: "Teaspoon", symbol: "tsp" },
    { id: 24, name: "Tablespoon", symbol: "tbsp" },
    { id: 25, name: "Milliequivalents", symbol: "mEq" },
    { id: 26, name: "International Units", symbol: "IU" }
  ];


  // Fetch Medications from API with Filter Query (Debounced)
  const fetchMedications = async () => {
    if (!selectedLab?.value) return;
    
    try {
      const response = await gets(
        `/pharmacyestore/list/healthcareprovider/${selectedLab.value}/1/10000`
      );
      const data = response?.data?.recordList;
      
      const options = data?.map((med) => ({
        value: med?.id,
        label: med?.productName,
        cost: med?.sellingPrice,
        manufacturer: med?.manufacturer,
        isComposite: med?.isComposite || false
      }));

      setMedicationOptions(options);
      setSelectedMedication(null);
    } catch (error) {
      console.log(error);
      setMedicationOptions([]);
    }
  };

  const fetchPharmacies = async () => {
    try {
      const response = await gets(`/healthcareprovider/list/1/10000`);
      // Filter for laboratory providers and format for react-select
      const laboratoryProviders = response.resultList
        .filter(lab => lab.healthCareProviderCategory?.name === "Pharmacy")
        .map(lab => ({
          value: lab.id,
          label: lab.name,
          location: lab.location,
          phone: lab.phone,
          email: lab.email
        }));
      setLabs(laboratoryProviders);
    } catch (error) {
      console.error("Error fetching laboratories:", error);
      setLabs([]);
    }
  };

  const handleTranscript = (transcript) => {
    setCarePlan(carePlan + transcript);
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

  // Function to update the suggestPayload
  const updateSuggestPayload = () => {
    const allMedications = [
      ...medications.map((med) => med.name),
      ...otherMedications.map((med) => med.name),
    ];
    if (allMedications.length === 0) {
      setSuggPayload({ medications: [] });
      return;
    } else {
      setSuggPayload({ medications: allMedications });
    }
  };

  // Update suggestPayload whenever medications or otherMedications change
  useEffect(() => {
    updateSuggestPayload();
  }, [medications, otherMedications]);

  const addMedicationFromDropdown = () => {
    if (selectedMedication && selectedLab) {
      setMedications((prev) => [
        ...prev,
        {
          name: selectedMedication.label,
          pharmacyHealthCareProviderId: selectedLab.value,
          generalMedicineId: selectedMedication.value,
          quantity: 0,
          drugStrengthUnit: 1,
          administrationFrequency: 1,
          routeOfAdministration: 1,
          duration: 0,
          composite: selectedMedication.isComposite
        },
      ]);
      setSelectedMedication(null);
    } else {
      toast.error("Please select both a pharmacy and medication");
    }
  };

  const addOtherMedication = () => {
    if (newOtherMedication) {
      setOtherMedications((prev) => [
        ...prev,
        {
          name: newOtherMedication,
          quantity: 0,
          frequency: 0,
          duration: 0,
        },
      ]);
      setNewOtherMedication("");
    } else {
      toast.error("Please enter the other medication name");
    }
  };

  const removeMedication = (index, type) => {
    if (type === "medications") {
      const updatedMedications = [...medications];
      updatedMedications.splice(index, 1);
      setMedications(updatedMedications);
    } else if (type === "otherMedications") {
      const updatedOtherMedications = [...otherMedications];
      updatedOtherMedications.splice(index, 1);
      setOtherMedications(updatedOtherMedications);
    }
  };

  const handleMedicationChange = (
    index,
    field,
    value,
    type = "medications"
  ) => {
    const updatedMedications = [
      ...(type === "medications" ? medications : otherMedications),
    ];

    let updatedValue = value;
    if (["duration", "quantity"].includes(field)) {
      updatedValue = parseInt(value, 10) || 0;
    }

    updatedMedications[index] = {
      ...updatedMedications[index],
      [field]: updatedValue,
    };

    if (type === "medications") {
      setMedications(updatedMedications);
    } else {
      setOtherMedications(updatedMedications);
    }
  };
  const addTreatment = async () => {
    if (!diagnosis || !carePlan) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

    const payload = {
      patientId: parseInt(id),
      dateOfVisit: new Date(visit?.appointDate).toISOString(),
      age: visit?.age || "0",
      diagnosis,
      treatmentStatus: 0,
      additionalNote: "",
      isAdmitted: admissionStatus === "Admitted",
      doctorId: parseInt(sessionStorage.getItem("userId")),
      appointmentId: parseInt(visit?.id),
      carePlan,
      medications: medications.map(med => ({
        pharmacyHealthCareProviderId: med.pharmacyHealthCareProviderId,
        generalMedicineId: med.generalMedicineId,
        drugStrengthUnit: parseInt(med.drugStrengthUnit),
        quantity: parseInt(med.quantity),
        administrationFrequency: parseInt(med.administrationFrequency),
        routeOfAdministration: parseInt(med.routeOfAdministration),
        duration: parseInt(med.duration),
        composite: med.composite
      }))
    };

    try {
      if (createTreatment) {
        await createTreatment(payload);
      } else {
        await posts("/treatment", payload);
        await fetchData();
        toast.success("Treatment added successfully");
      }
      closeModal();
    } catch (error) {
      toast.error("Error adding treatment");
      console.error(error);
    }
    setLoading(false);
  };

  // Debounced Search Function for Medications
  const debouncedFetchMedications = useCallback(
    debounce((query) => {
      fetchMedications("name", query); // Fetch medications based on typed query
    }, 300), // 300ms debounce
    []
  );

  // Handle input change in React Select's input field for searching medications
  const handleInputChange = (inputValue) => {
    debouncedFetchMedications(inputValue); // Trigger debounced API call
  };

  useEffect(() => {
    fetchPharmacies();
    fetchPatientHMO();
    fetchMedications();
  }, []);

  return (
    <div className="overlay">
      <RiCloseFill className="close-btn pointer" onClick={closeModal} />
      <div className="modal-box max-w-700">
        <div className="p-40">
          <h3 className="bold-text m-b-20">Add Treatment</h3>
          <GhostTextCompletion
            label="Patient Diagnosis"
            name="diagnosis"
            value={diagnosis}
            handleChange={(e) => {
              setDiagnosis(e.target.value);
              setRepeatedDiagnosis(e.target.value);
            }}
          />
          <div>
            <GhostTextCompletion
              label="Add Care Plan"
              name="carePlan"
              value={carePlan}
              handleChange={(e) => setCarePlan(e.target.value)}
            />
          </div>

          {/* Admission Status */}
          <div className="w-100 m-t-20 m-b-20 flex">
            <label htmlFor="admission" className="label">
              Admission Status
            </label>
            <select
              id="admission"
              className="input-field"
              value={admissionStatus}
              onChange={(e) => setAdmissionStatus(e.target.value)}
            >
              <option value="Admitted">To Be Admitted</option>
              <option value="Not To Be Admitted">Not To Be Admitted</option>
            </select>
          </div>

          {/* Medications from API */}
          <div className="flex gap-8 flex-col">
            <div>
              <label>Select Pharmacy</label>
              <Select
                options={labs}
                value={selectedLab}
                onChange={setSelectedLab}
                placeholder="Select a Pharmacy"
                isClearable
                formatOptionLabel={lab => (
                  <div>
                    <div>{lab.label}</div>
                    <div style={{ fontSize: '0.8em', color: '#666' }}>
                      {lab.location}
                    </div>
                  </div>
                )}
              />
            </div>
          </div>
          <div className="m-t-20">
            <Select
              options={medicationOptions} // Use fetched medication options
              formatOptionLabel={lab => (
                <div>
                  <div>{lab.label}</div>
                  <div style={{ fontSize: '0.8em', color: '#666' }}>
                    {lab.cost
                      ? `Cost: ${new Intl.NumberFormat('en-NG', {
                        style: 'currency',
                        currency: 'NGN',
                        currencyDisplay: 'symbol',
                      }).format(lab.cost)}`
                      : 'No cost available'}
                  </div>
                </div>
              )}
              value={selectedMedication}
              onChange={setSelectedMedication}
              placeholder="Select a medication"
              onInputChange={handleInputChange} // Trigger fetch on input change
              isClearable
            />
            <button className="btn m-t-10" onClick={addMedicationFromDropdown}>
              Add Medication
            </button>
          </div>

          {/* Table for Medications */}
          {medications.length > 0 && (
            <div className="m-t-20">
              <h4>Medications</h4>
              <table className="bordered-table-2 m-t-10">
                <thead>
                  <tr>
                    <th>s/n</th>
                    <th>Medication</th>
                    <th>Quantity</th>
<th>Strength</th>
                    <th>Units Of Measurement</th>
                    <th>Administration Frequency</th>
                                        <th>Duration (days)</th>
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
                          onChange={(e) => handleMedicationChange(index, "quantity", e.target.value)}
                        />
                      </td>
                      <td>
                        <select
                          className="input-field-table"
                          value={med.drugStrengthUnit}
                          onChange={(e) => handleMedicationChange(index, "drugStrengthUnit", e.target.value)}
                        >
                          {drugMeasurementUnits.map((unit) => (
                            <option key={unit.id} value={unit.id}>
                              {unit.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <select
                          className="input-field-table"
                          value={med.administrationFrequency}
                          onChange={(e) => handleMedicationChange(index, "administrationFrequency", e.target.value)}
                        >
                          {administrationFrequencies.map((freq) => (
                            <option key={freq.id} value={freq.id}>
                              {freq.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <select
                          className="input-field-table"
                          value={med.routeOfAdministration}
                          onChange={(e) => handleMedicationChange(index, "routeOfAdministration", e.target.value)}
                        >
                          {routesOfAdministration.map((route) => (
                            <option key={route.id} value={route.id}>
                              {route.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input
                          type="number"
                          className="input-field-table"
                          value={med.duration}
                          onChange={(e) => handleMedicationChange(index, "duration", e.target.value)}
                        />
                      </td>
                      <td>
                        <BsTrash
                          className="text-red pointer"
                          onClick={() => removeMedication(index)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Input for adding Other Medications */}
          <div className="m-t-20">
            <input
              type="text"
              // className="input-field"
              placeholder="Enter other medication"
              value={newOtherMedication}
              onChange={(e) => setNewOtherMedication(e.target.value)}
            />
            <button className="btn m-t-10" onClick={addOtherMedication}>
              Add Other Medication
            </button>
          </div>

          {otherMedications.length > 0 && (
            <div className="m-t-10">
              <h4>Other Medications</h4>
              <table className="bordered-table-2 m-t-10">
                <thead>
                  <tr>
                    <th>s/n</th>
                    <th>Medication</th>
                    <th>Quantity</th>
                    <th>Strength</th>
                    <th>Units Of Measurement</th>
                    <th>Administration Frequency</th>
                    <th>Duration (days)</th>
                    <th>Route</th>
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
                          type="number"
                          className="input-field-table"
                          value={med.quantity}
                          onChange={(e) =>
                            handleMedicationChange(
                              index,
                              "quantity",
                              e.target.value,
                              "otherMedications"
                            )
                          }
                        />
                      </td>
                      <td>
                        <input
                          // type="text"
                          className="input-field-table"
                          // value={med.frequency}
                          onChange={(e) =>
                            handleMedicationChange(
                              index,
                              "frequency",
                              e.target.value,
                              "otherMedications"
                            )
                          }
                        />
                      </td>
                      <td>
                        <select
                          className="input-field-table"
                          value={med.drugStrengthUnit || ""}
                          onChange={(e) =>
                            handleMedicationChange(
                              index,
                              "drugStrengthUnit",
                              e.target.value,
                              "otherMedications"
                            )
                          }
                        >
                          {drugMeasurementUnits.map((freq) => (
                            <option key={freq.id} value={freq.id}>
                              {freq.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <select
                          className="input-field-table"
                          value={med.administrationFrequency || ""}
                          onChange={(e) =>
                            handleMedicationChange(
                              index,
                              "administrationFrequency",
                              e.target.value,
                              "otherMedications"
                            )
                          }
                        >
                          {administrationFrequencies.map((freq) => (
                            <option key={freq.id} value={freq.id}>
                              {freq.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input
                          type="number"
                          className="input-field-table"
                          value={med.duration}
                          onChange={(e) =>
                            handleMedicationChange(
                              index,
                              "duration",
                              e.target.value,
                              "otherMedications"
                            )
                          }
                        />
                      </td>
                      <td>
                        <select
                          className="input-field-table"
                          value={med.routeOfAdministration || ""}
                          onChange={(e) =>
                            handleMedicationChange(
                              index,
                              "routeOfAdministration",
                              e.target.value,
                              "otherMedications"
                            )
                          }
                        >
                          {routesOfAdministration.map((route) => (
                            <option key={route.id} value={route.id}>
                              {route.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      {/* <td >
                        <div style={{ display: "flex", gap: "4px" }}>
                          <input
                            type="text"
                            className="input-field-table"
                            value={med.quantity}
                            onChange={(e) =>
                              handleMedicationChange(
                                index,
                                "quantity",
                                e.target.value,
                                "otherMedications"
                              )
                            }
                          />
                          <select>
                            <option>mg</option>
                          </select>
                        </div>
                      </td> */}
                      {/* <td>
                        <div style={{ display: "flex", gap: "4px" }}>
                          <input
                            type="text"
                            className="input-field-table"
                            value={med.frequency}
                            onChange={(e) =>
                              handleMedicationChange(
                                index,
                                "frequency",
                                e.target.value,
                                "otherMedications"
                              )
                            }
                          />
                          <select>
                            <option>times a day</option>
                            <option>times a week</option>
                          </select>
                        </div>
                      </td> */}
                      {/* <td>
                        <div style={{ display: "flex", gap: "4px" }}>
                          <input
                            type="text"
                            className="input-field-table"
                            value={med.duration}
                            onChange={(e) =>
                              handleMedicationChange(
                                index,
                                "duration",
                                e.target.value,
                                "otherMedications"
                              )
                            }
                          />
                          <select>
                            <option>days</option>
                            <option>weeks</option>
                          </select>
                        </div>
                      </td> */}
                      <td>
                        <BsTrash
                          className="text-red pointer"
                          onClick={() =>
                            removeMedication(index, "otherMedications")
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* <div className="m-t-20">
            <Suggestions payload={sugesstPayload} patientId={visit?.patientId} symptoms={diagnosis} />
          </div> */}

          <button
            className="btn m-t-20 w-100"
            onClick={addTreatment}
            disabled={loading}
          >
            Add Treatment
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddTreatment;
