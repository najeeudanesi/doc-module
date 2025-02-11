import React, { useState, useEffect } from "react";
import { RiCloseFill } from "react-icons/ri";
import Select from "react-select";
import InputField from "../UI/InputField";
import TextArea from "../UI/TextArea";
import { post, get } from "../../utility/fetch";
import toast from "react-hot-toast";
import { BsTrash } from "react-icons/bs";

function ReferPatient({
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

  const dummyLabCategories = [
    { value: 1, label: "Blood Test" },
    { value: 2, label: "Urine Test" },
    { value: 3, label: "X-Ray" },
    { value: 4, label: "CT Scan" },
  ];

  useEffect(() => {
    setCategoryOptions(dummyLabCategories);
    fetchPatientHMO();
    fetchCategories();
  }, []);

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

  const fetchCategories = async () => {
    try {
      const response = await get("/CategoryItem/list/1/100");
      const data = response?.resultList.map((cat) => ({
        value: cat?.id,
        label: cat?.itemName,
      }));
      setCategoryOptions(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching lab categories:", error);
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
    const payload = {
      age: treatment?.age,
      diagnosis,
      dateOfVisit: new Date(visit?.appointDate).toISOString(),
      appointmentId: visit?.id,
      hmoId: hmo?.hmoProviderId,
      hmoPackageId: hmo?.hmoPackageId,
      testRequests,
      otherTestRequests,
      additionalNote,
    };
    console.log(payload);
    try {
      await post(
        `/patients/${id}/vital/${vital?.vitalId}/lab-request`,
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

  return (
    <div className="overlay">
      <RiCloseFill className="close-btn pointer" onClick={closeModal} />
      <div className="modal-box max-w-800">
        <div className="p-40">
          <h3 className="bold-text">Refer Patient to Lab</h3>
          <div className="m-t-20">
            <div className="flex gap-8 flex-col">
              <div>
                <Select
                  options={categoryOptions}
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                  placeholder="Select a Lab Category"
                  isClearable
                />
              </div>
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
                    <th className="w-40">Category</th>
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
                          categoryOptions.find(
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
          <TextArea
            label="Additional Note"
            name="additionalNote"
            value={additionalNote}
            onChange={(e) => setAdditionalNote(e.target.value)}
          />
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

export default ReferPatient;
