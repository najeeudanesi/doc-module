import React, { useState, useEffect } from "react";
import { RiCloseFill } from "react-icons/ri";
import Select from "react-select";
import InputField from "../UI/InputField";
import TextArea from "../UI/TextArea";
import { post, get } from "../../utility/fetch";
import toast from "react-hot-toast";
import { BsTrash } from "react-icons/bs";
import SpeechToTextButton from "../UI/SpeechToTextButton";
import axios from 'axios';


function ProcedureToLab({
  closeModal,
  visit,
  vital,
  id,
  treatment,
  setRepeatedDiagnosis,
  repeatedDiagnosis,
}) {
  const [testRequests, setTestRequests] = useState([]);
  const [otherTestRequests, setOtherTestRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState("");
  const [additionalNote, setAdditionalNote] = useState("");
  const [labCentre, setLabCentre] = useState("");
  const [labTest, setLabTest] = useState("");
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [hmo, setHmo] = useState(null);
  const [selectedLab, setSelectedLab] = useState(null);
  const [services, setServices] = useState(null);
  const [service, setService] = useState({})
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState({}); const [labType, setLabType] = useState([
    {
      value: 1,
      label: "Internal Lab",
    },

    {
      value: 2,
      label: "External Lab",
    },
  ]);

  const dummyLabCategories = [
    { value: 1, label: "Blood Test" },
    { value: 2, label: "Urine Test" },
    { value: 3, label: "X-Ray" },
    { value: 4, label: "CT Scan" },
  ];

  useEffect(() => {
    setCategoryOptions(dummyLabCategories);
    fetchPatientHMO();
    getCategories();

  }, []);

  useEffect(() => {
    if (category) {
      getCategoriesService();
    }
  }, [category, selectedLab]);

  useEffect(() => {
    setDiagnosis(repeatedDiagnosis);
    console.log(repeatedDiagnosis);
  }, [repeatedDiagnosis]);

  const fetchPatientHMO = async () => {
    try {
      const response = await get(`/hmo/get-patient-hmo/${id}`);
      setHmo(response?.data[0]);
    } catch (error) {
      console.error("Error fetching HMO:", error);
    }
  };

  console.log(vital, 'visit', visit)


  const getCategories = async () => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      console.error('Token not found in session storage');
      return;
    }

    const options = {
      method: 'GET',
      headers: {
        'Authorization': `${token}`
      }
    };

    try {
      const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/healthfinanceapi/api/category/list/1/1000`, options);

      const tempServices = res?.data?.resultList
        ?.filter((service) => service.name === "Lab Service" || service.name === "Lab Services")
        .map((category) => ({ label: category?.name, value: parseFloat(category?.id) }));

      tempServices?.unshift({ label: "Select Service", value: "" });

      setCategories(tempServices);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const getCategoriesService = async () => {
    const token = sessionStorage.getItem('token');

    if (!token) {
      console.error('Token not found in session storage');
      return;
    }

    const options = {
      method: 'GET',
      headers: {
        'Authorization': `${token}`
      }
    };

    try {
      setService({})
      setServices(null);
      const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/healthfinanceapi/api/categoryitem/list/category/${category?.value}/1/1000`, options);

      const tempServices = res?.data?.resultList
        .map((service) => ({ label: service?.itemName, value: parseFloat(service?.id) }));

      tempServices?.unshift({ label: "Select Service", value: "" });

      setServices(tempServices);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const addLabRequest = () => {
    if (selectedCategory && labCentre.trim() !== "") {
      setTestRequests([
        ...testRequests,
        {
          categoryItemId: selectedCategory.value,
          labCentre,
        },
      ]);
    } else if (labTest.trim() !== "" && labCentre.trim() !== "") {
      setOtherTestRequests([
        ...otherTestRequests,
        {
          labTest,
          labCentre,
        },
      ]);
    } else {
      toast.error("Please fill in all required fields");
      return;
    }

    setLabCentre("");
    setLabTest("");
    setSelectedCategory(null);
  };

  const removeLabRequest = (index, isOther = false) => {
    if (isOther) {
      const updated = [...otherTestRequests];
      updated.splice(index, 1);
      setOtherTestRequests(updated);
    } else {
      const updated = [...testRequests];
      updated.splice(index, 1);
      setTestRequests(updated);
    }
  };

  const referPatient = async () => {
    if (testRequests.length === 0 && otherTestRequests.length === 0) {
      toast.error("Please add at least one test request");
      return;
    }
    if (diagnosis === "" || additionalNote === "") {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

    const selectedVital = vital.find(v => v.appointmentId === visit.id);

    const payload = {
      labRequestType: selectedLab?.value,
      internalLab: testRequests?.length > 0 ? {
        diagnosis,
        dateOfVisit: new Date(visit?.appointDate).toISOString(),
        appointmentId: visit?.id,
        hmoId: hmo?.hmoProviderId || 0,
        hmoPackageId: hmo?.hmoPackageId || 0,
        testRequests,
        additionalNote
      } : null,
      externalLab: otherTestRequests?.length > 0 ? {
        diagnosis,
        dateOfVisit: new Date(visit?.appointDate).toISOString(),
        appointmentId: visit?.id,
        otherTestRequests,
        additionalNote
      } : null,
    };

    console.log(payload);

    try {
      await post(
        `/patients/${id}/vital/${selectedVital?.vitalId}/procedure-request`,
        payload
      );
      toast.success("Lab request added successfully");
      closeModal();
    } catch (error) {
      toast.error("Error adding lab request");
      console.error(error);
    }
    setLoading(false);
  };

  const handleTranscript = (transcript) => {
    setAdditionalNote(additionalNote + transcript)
  };


  return (
    <div className="overlay">
      <RiCloseFill className="close-btn pointer" onClick={closeModal} />
      <div className="modal-box max-w-800">
        <div className="p-40">
          <h3 className="bold-text">Procedures</h3>
          <div className="m-t-20">
            <div className="flex gap-8 flex-col">
              <div>
                <label>Lab Type</label>
                <Select
                  options={labType}
                  value={selectedLab}
                  onChange={setSelectedLab}
                  placeholder="Select a Lab Type"
                  isClearable
                />
              </div>
              {selectedLab?.value === 1 &&
                <div className="m-t-20">
                  <label>Service Category</label>
                  <Select
                    options={categories}
                    value={category}
                    onChange={(selectedOption) => {
                      setSelectedCategory(selectedOption);
                      setCategory(selectedOption);
                    }}
                    placeholder="Select a Lab Category"
                    isClearable
                  />

                  <>
                    {Array.isArray(services) &&
                      <div className="m-t-20">
                        <label>Lab Services</label>

                        <Select
                          options={services}
                          value={service}
                          onChange={(selectedOption) => {
                            setSelectedCategory(selectedOption);
                            setService(selectedOption);
                          }}
                          placeholder="Select a Lab Service"
                          isClearable
                        />
                      </div>
                    }
                  </>
                </div>
              }

              {selectedLab?.value === 2 &&
                <>
                  <p className="text-sm m-t-20">
                    Dont see a category? Specify the name of the lab test
                  </p>
                  <InputField
                    label="Lab Test"
                    name="labTest"
                    value={labTest}
                    disabled={selectedCategory ? true : false}
                    onChange={(e) => setLabTest(e.target.value)}
                  />
                </>
              }
              <div>
                <div className="flex gap-8">
                  <InputField
                    label="Lab Centre"
                    name="labCentre"
                    value={labCentre}
                    onChange={(e) => setLabCentre(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-h-end">
              <button className="btn m-t-10" onClick={addLabRequest}>
                + Add
              </button>
            </div>
          </div>

          {testRequests.length > 0 && (
            <>
              <h4 className="m-t-20">Category Test Requests</h4>
              <table className="bordered-table-2 m-t-10">
                <thead>
                  <tr>
                    <th className="w-20">s/n</th>
                    <th className="w-40">Service</th>
                    <th className="w-40">Lab Centre</th>
                    <th className="w-20">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {testRequests.map((request, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        {
                          services?.find(
                            (opt) => opt.value === request.categoryItemId
                          )?.label
                        }
                      </td>
                      <td>{request.labCentre}</td>
                      <td>
                        <BsTrash
                          className="text-red pointer"
                          onClick={() => removeLabRequest(index)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {otherTestRequests.length > 0 && (
            <>
              <h4 className="m-t-20">Other Test Requests</h4>
              <table className="bordered-table-2 m-t-10">
                <thead>
                  <tr>
                    <th className="w-20">s/n</th>
                    <th className="w-40">Lab Test</th>
                    <th className="w-40">Lab Centre</th>
                    <th className="w-20">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {otherTestRequests.map((request, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{request.labTest}</td>
                      <td>{request.labCentre}</td>
                      <td>
                        <BsTrash
                          className="text-red pointer"
                          onClick={() => removeLabRequest(index, true)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          <TextArea
            label="Diagnosis"
            name="diagnosis"
            value={diagnosis}
            onChange={(e) => {
              setDiagnosis(e.target.value);
              setRepeatedDiagnosis(e.target.value);
            }}
          />

          <div> <TextArea
            label="Additional Note"
            name="additionalNote"
            value={additionalNote}
            onChange={(e) => setAdditionalNote(e.target.value)}
          />

            <SpeechToTextButton onTranscript={handleTranscript} />
          </div>

          <button
            className="btn m-t-20 w-100"
            onClick={referPatient}
            disabled={loading}
          >
            Refer Patient to Lab
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProcedureToLab;
