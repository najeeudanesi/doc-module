import React, { useEffect, useState, useCallback } from "react";
import Select from "react-select";
import toast from "react-hot-toast";
import { BsTrash } from "react-icons/bs";
import { RiCloseFill } from "react-icons/ri";
import { get, post } from "../../utility/fetch";
import TextArea from "../UI/TextArea";
import debounce from "lodash.debounce"; // Import debounce from lodash
import SpeechToTextButton from "../UI/SpeechToTextButton";
import GhostTextCompletion from "../UI/TextPrediction";
import Suggestions from "../UI/Suggestions";
import PatientDetails from "../pages/PatientDetails";

function AddMoreTreatment({
  closeModal,
  visit,
  id,
  fetchData,
  treatment,
  patientId,
  data,
  repeatedDiagnosis,
  setRepeatedDiagnosis,
  getAllAdmittedPatients,
}) {
  const [carePlan, setCarePlan] = useState("");
  const [diagnosis, setDiagnosis] = useState(treatment?.diagnosis || "");
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

  // const routesOfAdministration = [
  //     { id: 1, name: "Orally" },
  //     { id: 2, name: "Sublingual" },
  //     { id: 3, name: "Topical" },
  //     { id: 4, name: "Inhalation" },
  //     { id: 5, name: "Suppository" },
  //     { id: 6, name: "IV" },
  //     { id: 7, name: "IM" },
  //     { id: 8, name: "Subcut" },
  //     { id: 9, name: "Intradermal" },
  //     { id: 10, name: "PerRectum" },
  //     { id: 11, name: "PerVagina" },
  //     { id: 12, name: "Implant" },
  // ];
  const routesOfAdministration = [
    { id: 4, name: "Inhalation" },
    { id: 9, name: "Intradermal" },
    { id: 7, name: "IM" }, // Intramuscular
    { id: 12, name: "Implant" },
    { id: 6, name: "IV" }, // Intravenous
    { id: 1, name: "Orally" },
    { id: 10, name: "PerRectum" },
    { id: 11, name: "PerVagina" },
    { id: 8, name: "Subcut" }, // Subcutaneous
    { id: 2, name: "Sublingual" },
    { id: 5, name: "Suppository" },
    { id: 3, name: "Topical" },
  ];

  // const administrationFrequencies = [
  //     { id: 1, name: "Immediately" },
  //     { id: 2, name: "As needed" },
  //     { id: 3, name: "Once daily" },
  //     { id: 4, name: "Twice a day" },
  //     { id: 5, name: "Three times a day" },
  //     { id: 6, name: "Four times a day" },
  //     { id: 7, name: "At night" },
  //     { id: 8, name: "Morning" },
  //     { id: 9, name: "Evening" },
  //     { id: 10, name: "Every 24 hours" },
  //     { id: 11, name: "Every 12 hours" },
  //     { id: 12, name: "Every 8 hours" },
  //     { id: 13, name: "Every 6 hours" },
  //     { id: 14, name: "Every 4 hours" },
  //     { id: 15, name: "Every 3 hours" },
  //     { id: 16, name: "Every 2 hours" },
  //     { id: 17, name: "Every hour" },
  //     { id: 18, name: "Every 2 months" },
  //     { id: 19, name: "Every 3 months" },
  //     // Every 3 months
  // ];

  const administrationFrequencies = [
    { id: 1, name: "Immediately", abbreviation: "STAT" },
    { id: 2, name: "As needed", abbreviation: "PRN" },
    { id: 3, name: "Once daily", abbreviation: "QD / SID" }, // QD often discouraged, SID clearer
    { id: 4, name: "Twice a day", abbreviation: "BID" },
    { id: 5, name: "Three times a day", abbreviation: "TID" },
    { id: 6, name: "Four times a day", abbreviation: "QID" },
    { id: 7, name: "At night", abbreviation: "HS / noct." },
    { id: 8, name: "Morning", abbreviation: "AM" },
    { id: 9, name: "Evening", abbreviation: "PM" },
    { id: 10, name: "Every 24 hours", abbreviation: "Q24H" },
    { id: 11, name: "Every 12 hours", abbreviation: "Q12H" },
    { id: 12, name: "Every 8 hours", abbreviation: "Q8H" },
    { id: 13, name: "Every 6 hours", abbreviation: "Q6H" },
    { id: 14, name: "Every 4 hours", abbreviation: "Q4H" },
    { id: 15, name: "Every 3 hours", abbreviation: "Q3H" },
    { id: 16, name: "Every 2 hours", abbreviation: "Q2H" },
    { id: 17, name: "Every hour", abbreviation: "Q1H" },
    { id: 18, name: "Every 2 months", abbreviation: "q2mo" }, // Common shorthand, not a strict Latin abbr.
    { id: 19, name: "Every 3 months", abbreviation: "q3mo" }, // Common shorthand, not a strict Latin abbr.
  ];

  console.log(visit, treatment);

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
    console.log(visit);
  }, [repeatedDiagnosis]);

  // const drugMeasurementUnits = [
  //     { id: 1, name: "Milligrams", symbol: "mg" },
  //     { id: 2, name: "Grams", symbol: "g" },
  //     { id: 3, name: "Micrograms", symbol: "µg" },
  //     { id: 4, name: "Milliliters", symbol: "mL" },
  //     { id: 5, name: "Liters", symbol: "L" },
  //     { id: 6, name: "Units", symbol: "U" },
  //     { id: 7, name: "Puffs" },
  //     { id: 8, name: "Sprays" },
  //     { id: 9, name: "Drops" },
  //     { id: 10, name: "Patch" },
  //     { id: 11, name: "Bottle" },
  //     { id: 12, name: "Transdermal System" },
  //     { id: 13, name: "Tablet" },
  //     { id: 14, name: "Capsule" },
  //     { id: 15, name: "Suppository" },
  //     { id: 16, name: "Scoop" },
  //     { id: 17, name: "Sachet" },
  //     { id: 18, name: "Ampoule" },
  //     { id: 19, name: "Vial" },
  //     { id: 20, name: "Injection Pen" },
  //     { id: 21, name: "Enema" },
  //     { id: 22, name: "Ounces", symbol: "oz" },
  //     { id: 23, name: "Teaspoon", symbol: "tsp" },
  //     { id: 24, name: "Tablespoon", symbol: "tbsp" },
  //     { id: 25, name: "Milliequivalents", symbol: "mEq" },
  //     { id: 26, name: "International Units", symbol: "IU" }
  // ];
  const drugMeasurementUnits = [
    { id: 18, name: "Ampoule", symbol: "amp" },
    { id: 11, name: "Bottle", symbol: "btl" },
    { id: 14, name: "Capsule", symbol: "cap" },
    { id: 9, name: "Drops", symbol: "gtt" }, // or "drop" / "drops"
    { id: 21, name: "Enema", symbol: "enema" },
    { id: 2, name: "Grams", symbol: "g" },
    { id: 26, name: "International Units", symbol: "IU" },
    { id: 20, name: "Injection Pen", symbol: "pen" },
    { id: 5, name: "Liters", symbol: "L" },
    { id: 3, name: "Micrograms", symbol: "µg" },
    { id: 1, name: "Milligrams", symbol: "mg" },
    { id: 25, name: "Milliequivalents", symbol: "mEq" },
    { id: 4, name: "Milliliters", symbol: "mL" },
    { id: 22, name: "Ounces", symbol: "oz" },
    { id: 10, name: "Patch", symbol: "patch" },
    { id: 7, name: "Puffs", symbol: "puff" },
    { id: 17, name: "Sachet", symbol: "sachet" },
    { id: 16, name: "Scoop", symbol: "scoop" },
    { id: 8, name: "Sprays", symbol: "spray" },
    { id: 15, name: "Suppository", symbol: "supp" },
    { id: 24, name: "Tablespoon", symbol: "tbsp" },
    { id: 13, name: "Tablet", symbol: "tab" },
    { id: 23, name: "Teaspoon", symbol: "tsp" },
    { id: 12, name: "Transdermal System", symbol: "TD system" }, // Common clinical shorthand
    { id: 6, name: "Units", symbol: "U" },
    { id: 19, name: "Vial", symbol: "vial" },
  ];

  // // Verify alphabetical order by name
  // drugMeasurementUnits.sort((a, b) => a.name.localeCompare(b.name));

  // console.log(drugMeasurementUnits);

  // Fetch Medications from API with Filter Query (Debounced)
  const fetchMedications = async (
    filterOn = "name",
    filterQuery = " ",
    pageNumber = 1,
    itemsPerPage = 10
  ) => {
    try {
      const response = await get(
        `/pharmacyinventory/filter-list/${filterOn}/${filterQuery}/${pageNumber}/${itemsPerPage}`
      );
      const data = response?.resultList;
      console.log(response);
      // Map the response to a format usable by React Select
      const options = data?.map((med) => ({
        value: med?.id, // or med.code if you have it
        label: med?.productName, // Adjust this based on your response structure
      }));

      setMedicationOptions(options); // Set options for the dropdown
      // setSelectedMedication(null); // Clear selection after fetching data
    } catch (error) {
      console.log(error);
    }
  };

  const handleTranscript = (transcript) => {
    setCarePlan(carePlan + transcript);
  };

  const fetchPatientHMO = async () => {
    try {
      const response = await get(`/hmo/get-patient-hmo/${patientId}`);
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
    if (selectedMedication) {
      setMedications((prev) => [
        ...prev,
        {
          name: selectedMedication.label,
          pharmacyInventoryId: selectedMedication.value, // Save the medication ID (value) here
          quantity: "",
          frequency: "",
          duration: "",
        },
      ]);
      setSelectedMedication(null); // Clear selection after adding
    } else {
      toast.error("Please select a valid medication");
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

    updatedMedications[index] = {
      ...updatedMedications[index],
      [field]: value, // Always store as string
    };

    if (type === "medications") {
      setMedications(updatedMedications);
    } else {
      setOtherMedications(updatedMedications);
    }
  };
  const addTreatment = async () => {
    if (diagnosis === "" || carePlan === "") {
      toast.error("Please fill in all fields");
      return;
    }

    // const dateOfVisit = new Date(visit?.dateOfVisit).toISOString();
    // setLoading(true);

    // Prepare the medications payload with pharmacyInventoryId
    const formattedMedications = medications.map((med) => ({
      pharmacyInventoryId: med.pharmacyInventoryId,
      quantity: med.quantity,
      strength: med.frequency,
      administrationFrequency: +med.administrationFrequency || 1,
      routeOfAdministration: +med.routeOfAdministration || 1,
      duration: med.duration,

      drugStrengthUnit: +med.drugStrengthUnit,
    }));

    // Prepare the otherMedications payload
    const formattedOtherMedications = otherMedications.map((med) => ({
      name: med.name,
      quantity: med.quantity,
      strength: med.frequency,
      administrationFrequency: +med.administrationFrequency || 1,
      routeOfAdministration: +med.routeOfAdministration || 1,
      duration: med.duration,
      drugStrengthUnit: +med.drugStrengthUnit || 1,
    }));

    // Construct the payload in the required format
    const payload = {
      patientId: treatment?.patient.id,
      medications: medications.map((med) => ({
        pharmacyInventoryId: med.pharmacyInventoryId,
        doctorPrescription: {
          strength: med.frequency || "",
          drugStrengthUnit: med.drugStrengthUnit || "",
          quantity: med.quantity || "",
          administrationFrequency: med.administrationFrequency || "",
          routeOfAdministration: med.routeOfAdministration || "",
          duration: med.duration || "",
          dosage: med.dosage || "",
        },
        comment: med.comment || "",
      })),
      otherMedications: otherMedications.map((med) => ({
        name: med.name,
        doctorOtherPrescription: {
          strength: med.frequency || "",
          drugStrengthUnit: med.drugStrengthUnit || "",
          quantity: med.quantity || "",
          administrationFrequency: med.administrationFrequency || "",
          routeOfAdministration: med.routeOfAdministration || "",
          duration: med.duration || "",
          dosage: med.dosage || "",
        },
        comment: med.comment || "",
      })),
    };

    console.log(payload);
    // return;
    // if (createTreatment) {
    //   createTreatment && createTreatment(payload);
    //   return;
    // }
    // getAllAdmittedPatients()
    // return

    try {
      const res = await post(
        `/ServiceTreatment/additional-prescription/${treatment?.id}`,
        // `/patients/${patientId}/Treatment/${treatment?.id}/add-additional-prescription`,
        payload
      ); // Send payload to the endpoint
      console.log(res);
      if (res.isSuccess || res.success) {
        toast.success("Treatment added successfully");
        getAllAdmittedPatients();
        setLoading(false);

        // closeModal();
      } else {
        toast.error("Error adding prescription");
      }
    } catch (error) {
      // toast.error("Error adding treatment");
      console.log(error);
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
    fetchTreatmentCategory();
    fetchPatientHMO();
    fetchMedications();
  }, []);

  return (
    <div className="overlay">
      <RiCloseFill className="close-btn pointer" onClick={closeModal} />
      <div className="modal-box max-w-700">
        <div className="p-40">
          <h3 className="bold-text">Add Treatment</h3>

          {/* Treatment Category */}
          <div className="w-100 m-t-20 flex">
            <label htmlFor="category" className="label">
              Treatment Category
            </label>
            <select
              id="category"
              className="input-field"
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
            >
              {treatmentCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <GhostTextCompletion
            label="Patient Diagnosis"
            name="diagnosis"
            value={diagnosis}
            handleChange={(e) => {
              setDiagnosis(e.target.value);
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
          <div className="w-100 m-t-20 flex">
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
          <div className="m-t-20">
            <Select
              options={medicationOptions} // Use fetched medication options
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
                    <th>Dosage</th>
                    <th>Strength</th>
                    <th>Units Of Measurement</th>
                    <th>Administration Frequency</th>
                    <th>Duration (days)</th>
                    <th>Route</th>
                    <th>Quantity</th>
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
                          type="text"
                          className="input-field-table"
                          value={med.dosage || ""}
                          onChange={(e) =>
                            handleMedicationChange(
                              index,
                              "dosage",
                              e.target.value,
                              "medications"
                            )
                          }
                          placeholder="Dosage"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input-field-table"
                          value={med.frequency}
                          onChange={(e) =>
                            handleMedicationChange(
                              index,
                              "frequency",
                              e.target.value,
                              "medications"
                            )
                          }
                          placeholder="Strength"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input-field-table"
                          value={med.drugStrengthUnit || ""}
                          onChange={(e) =>
                            handleMedicationChange(
                              index,
                              "drugStrengthUnit",
                              e.target.value,
                              "medications"
                            )
                          }
                          placeholder="Units"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input-field-table"
                          value={med.administrationFrequency || ""}
                          onChange={(e) =>
                            handleMedicationChange(
                              index,
                              "administrationFrequency",
                              e.target.value,
                              "medications"
                            )
                          }
                          placeholder="Frequency"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input-field-table"
                          value={med.duration}
                          onChange={(e) =>
                            handleMedicationChange(
                              index,
                              "duration",
                              e.target.value,
                              "medications"
                            )
                          }
                          placeholder="Duration"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input-field-table"
                          value={med.routeOfAdministration || ""}
                          onChange={(e) =>
                            handleMedicationChange(
                              index,
                              "routeOfAdministration",
                              e.target.value,
                              "medications"
                            )
                          }
                          placeholder="Route"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input-field-table"
                          value={med.quantity}
                          onChange={(e) =>
                            handleMedicationChange(
                              index,
                              "quantity",
                              e.target.value,
                              "medications"
                            )
                          }
                          placeholder="Quantity"
                        />
                      </td>
                      <td>
                        <BsTrash
                          className="text-red pointer"
                          onClick={() => removeMedication(index, "medications")}
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
                          //   type="number"
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
                        <input
                          type="text"
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
                          placeholder="Unit"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
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
                          placeholder="Frequency"
                        />
                      </td>
                      <td>
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
                          placeholder="Duration"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
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
                          placeholder="Route"
                        />
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
                        <Suggestions payload={sugesstPayload} patientId={visit?.patientId} />
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

export default AddMoreTreatment;
