import React, { useState, useEffect } from "react";
import { RiCloseFill } from "react-icons/ri";
import Select from "react-select";
import InputField from "../UI/InputField";
import TextArea from "../UI/TextArea";
import { post, get } from "../../utility/fetch";
import { get as gets, post as posts } from "../../utility/fetch2";
import toast from "react-hot-toast";
import { BsTrash } from "react-icons/bs";
import SpeechToTextButton from "../UI/SpeechToTextButton";
import axios from "axios";
import GhostTextCompletion from "../UI/TextPrediction";

function ReferPatient({
  closeModal,
  visit,
  vital,
  ivf,
  antenatal,
  generalSurgery,
  familyMedcine,
  orthopedic,
  id,
  generalPractice,
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
  const [servicesGeneral, setServicesGeneral] = useState([]);
  const [service, setService] = useState({});
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState({});

  const [labs, setLabs] = useState([]);
  const [laboratoryService, setLaboratoryService] = useState([]);


  useEffect(() => {
    fetchPatientHMO();
    fetchLabs();
    fetchGeneralService();
  }, []);

  useEffect(() => {
    if (category) {
      fetchLabService(selectedLab?.value);
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

  const fetchLabs = async () => {
    try {
      const response = await gets(`/healthcareprovider/list/1/10000`);
      // Filter for laboratory providers and format for react-select
      const laboratoryProviders = response.resultList
        .filter(lab => lab.healthCareProviderCategory?.name === "Laboratory")
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

  const fetchLabService = async (id) => {
    try {
      const response = await gets(`/internallabservice/list/healthcareprovider/${id}/1/10000`);
      // Filter for laboratory providers and format for react-select
      const laboratoryService = response.data.recordList
        .map(service => ({
          value: service.id,
          label: service.name,
          cost: service.cost
        }));
      setLaboratoryService(laboratoryService);
    } catch (error) {
      console.error("Error fetching laboratories:", error);
      setLaboratoryService([]);
    }
  };

  const fetchGeneralService = async () => {
    try {
      const response = await gets(`/generallabservice/list`);
      // Filter for laboratory providers and format for react-select
      const laboratoryService = response.data
        .map(service => ({
          value: service.id,
          label: service.name,
        }));
      setServicesGeneral(laboratoryService);
    } catch (error) {
      console.error("Error fetching laboratories:", error);
      setLaboratoryService([]);
    }
  };

  console.log(vital, "visit", visit);


  const addLabRequest = () => {
    if (!selectedLab) {
      toast.error("Please select a laboratory");
      return;
    }

    if (!service?.value) {
      toast.error("Please select a lab service");
      return;
    }

    const newRequest = {
      categoryItemId: service.value,
      labCentre: selectedLab.label,
      serviceName: service.label,
      cost: service.cost
    };

    setTestRequests([...testRequests, newRequest]);
    setService(null); // Reset service selection
  };

  // Add new function to handle general service addition
  const addGeneralLabRequest = () => {
    if (!selectedLab) {
      toast.error("Please select a laboratory");
      return;
    }

    if (!selectedCategory?.value) {
      toast.error("Please select a general service");
      return;
    }

    const newRequest = {
      categoryItemId: selectedCategory.value,
      labCentre: selectedLab.label,
      serviceName: selectedCategory.label,
      isGeneralService: true // Flag to identify general service
    };

    setTestRequests([...testRequests, newRequest]);
    setSelectedCategory(null); // Reset general service selection
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
    if (testRequests.length === 0) {
      toast.error("Please add at least one test request");
      return;
    }
    if (diagnosis === "" || additionalNote === "") {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

    const payload = {
      patientId: parseInt(id),
      severity: 1, // You can add a severity selector if needed
      diagnosis,
      additionalNote,
      doctorId: parseInt(sessionStorage.getItem("userId")),
      labHealthCareProviderId: selectedLab?.value,
      appointmentId: parseInt(visit?.id),
      testRequests: testRequests.map(test => ({
        generalLabServiceId: test.isGeneralService ? test.categoryItemId : 0,
        internalLabServiceId: test.isGeneralService ? 0 : test.categoryItemId
      }))
    };

    try {
      await posts("/refertolab/create-lab-request", payload);
      toast.success("Lab request sent successfully");
      closeModal();
    } catch (error) {
      toast.error("Error sending lab request");
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className="overlay">
      <RiCloseFill className="close-btn pointer" onClick={closeModal} />
      <div className="modal-box max-w-800">
        <div className="p-40">
          <h3 className="bold-text">Refer Patient to Lab</h3>
          <div className="m-t-20">
            <div className="flex gap-8 flex-col">
              <div>
                <label>Select Lab</label>
                <Select
                  options={labs}
                  value={selectedLab}
                  onChange={setSelectedLab}
                  placeholder="Select a Laboratory"
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
              <div>
                <label>Select General Service</label>
                <div className="flex gap-8 align-items-end">
                  <div className="flex-grow-1">
                    <Select
                      options={servicesGeneral}
                      value={selectedCategory}
                      onChange={setSelectedCategory}
                      placeholder="Select a general service"
                      isClearable
                      formatOptionLabel={lab => (
                        <div>
                          <div>{lab.label}</div>
                        </div>
                      )}
                    />
                  </div>
                  <button className="btn" onClick={addGeneralLabRequest}>
                    + Add General Service
                  </button>
                </div>
              </div>
              {selectedLab && (
                <div className="m-t-20">
                  <>
                    {Array.isArray(laboratoryService) && (
                      <div className="m-t-20">
                        <label>Lab Services</label>

                        <Select
                          options={laboratoryService}
                          value={service}
                          onChange={(selectedOption) => {
                            setSelectedCategory(selectedOption);
                            setService(selectedOption);
                          }}
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
                          
                          placeholder="Select a Lab Service"
                          isClearable
                        />
                      </div>
                    )}
                  </>
                </div>
              )}
             
            </div>
            <div className="flex flex-h-end">
              <button className="btn m-t-10" onClick={addLabRequest}>
                + Add
              </button>
            </div>
          </div>

          {testRequests.length > 0 && (
            <>
              <h4 className="m-t-20">Test Requests</h4>
              <table className="bordered-table-2 m-t-10">
                <thead>
                  <tr>
                    <th className="w-10">S/N</th>
                    <th className="w-30">Service</th>
                    <th className="w-30">Lab Centre</th>
                    <th className="w-20">Cost</th>
                    <th className="w-10">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {testRequests.map((request, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{request.serviceName}</td>
                      <td>{request.labCentre}</td>
                      <td>
                        {request.cost
                          ? new Intl.NumberFormat('en-NG', {
                            style: 'currency',
                            currency: 'NGN',
                            currencyDisplay: 'symbol',
                          }).format(request.cost)
                          : 'N/A'}
                      </td>
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

          <div>
            <GhostTextCompletion
              label="Additional Note"
              name="additionalNote"
              value={additionalNote}
              handleChange={(e) => setAdditionalNote(e.target.value)}
            />
          </div>

          <button
            className="btn m-t-20 w-100"
            onClick={referPatient}
            disabled={loading}
          >
            Refer Patient to Lab
          </button>
        </div>
      </div >
    </div >
  );
}

export default ReferPatient;
