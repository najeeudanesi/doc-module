import React, { useEffect, useState } from "react";
import InputField from "../../UI/InputField";
import TextArea from "../../UI/TextArea";
import { RiToggleFill } from "react-icons/ri";
import doc from "../../../assets/images/doc-icon.jpg";
import { get, post } from "../../../utility/fetch";
import AddMedicalRecord from "../../modals/AddMedicalRecord";
import MedicalRecordTable from "../../tables/MedicalRecordTable";
import toast from "react-hot-toast";

function MedicalRecordFiles({ data, next, patientId, fetchData }) {
  const [selectedTab, setSelectedTab] = useState(1);
  const [medicalRecords, setMedicalRecords] = useState({});
  const [medicalRecordsPic, setMedicalRecordsPic] = useState([]);
  const [medicalTypes, setMedicalTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [typeName, setTypeName] = useState("");
  const [typeComment, setTypeComment] = useState("");
  const [newData, setNewData] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [docpaths, setdocpaths] = useState();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setdocpaths(null);
    setIsModalOpen(false);
  };

  const getNewData = async () => {
    setLoading(true);
    try {
      const res = await get(`/Patients/${patientId}/medicalrecord`);
      setNewData(res);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const getMedicalTypes = async () => {
    setLoading(true);
    try {
      const res = await get("/Patients/getAllMedicalTypes");
      setMedicalTypes(res);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const toggleModal = () => {
    setModal(!modal);
  };

  const addMedicalRecord = async () => {
    if (typeComment === "" || typeName === "") {
      toast("Please fill in fields");
      return;
    }
    setLoading(true);
    const payload = {
      medicalRecordType: selectedTab,
      name: typeName,
      comment: typeComment,
      patientId: data[0]?.patientId,
    };
    console.log(payload);
    try {
      await post(`/patients/addmedicalrecord`, payload);
      toast.success("Medical record added successfully");
      await fetchData();
    } catch (error) {
      toast.error("Error adding medical record");
      console.log(error);
    }
    setLoading(false);
  };

  const getMedicalRecordz = async () => {
    // if (typeComment === "" || typeName === "") {
    //   toast("Please fill in fields")
    //   return
    // }
    // setLoading(true);
    // const payload = {
    //   medicalRecordType: selectedTab,
    //   name: typeName,
    //   comment: typeComment,
    //   patientId: data[0]?.patientId
    // };
    // console.log(payload);
    try {
      let response = await get(`/patients/${patientId}/patient_files`);
      // toast.success("Medical record added successfully");
      // await fetchData();
      setMedicalRecordsPic(response);

      console.log(response);
    } catch (error) {
      toast.error("Error adding medical record");
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getNewData();
    getMedicalTypes();
    getMedicalRecordz();
  }, []);

  useEffect(() => {
    if (medicalTypes && medicalTypes.length > 0) {
      setSelectedTab(medicalTypes[0].index); // Set the default tab
      initializeMedicalRecords();
    }
  }, [medicalTypes]);

  const initializeMedicalRecords = () => {
    const initialRecords = {};
    if (selectedTab !== "") {
      const selectedType = medicalTypes.find(
        (type) => type.index === selectedTab
      );
      if (selectedType) {
        const recordsOfType = data.filter(
          (record) => record.medicalRecordType === selectedType.index
        );
        if (recordsOfType.length === 0) {
          // Add an empty record if no records are found
          initialRecords[selectedType.index] = [{ name: "", comment: "" }];
        } else {
          initialRecords[selectedType.index] = recordsOfType.map((record) => ({
            name: record.name || "",
            comment: record.comment || "",
            actionTaken: record.actionTaken || "",
            createdAt: record.createdAt || "",
          }));
        }
      }
    }
    setMedicalRecords(initialRecords);
  };

  useEffect(() => {
    if (selectedTab) {
      initializeMedicalRecords();
    }
  }, [selectedTab]);

  function hasTIFFExtension(url) {
    return url.toLowerCase().endsWith(".tif");
  }

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <div className="m-t-40 bold-text">Patient's Files</div>
          <div>
            {/* <div className="flex m-t-30">
                <div className="m-r-80">
                  {medicalTypes &&
                    medicalTypes.map((type) => (
                      <div
                        key={type.index}
                        className={`pointer m-t-30 font-sm ${selectedTab === type.index ? "pilled bold-text " : ""
                          }`}
                        onClick={() => setSelectedTab(type.index)}
                      >
                        {type.value}
                      </div>
                    ))}
                </div>

                <div>
                  {(selectedTab && medicalTypes) &&

                    <div>
                      <InputField
                        label={`${medicalTypes[selectedTab - 1]?.value}`}
                        type="text"
                        placeholder={`${medicalTypes[selectedTab - 1]?.value}`}
                        value={typeName}
                        onChange={(e) => setTypeName(e.target.value)}
                      />
                      <TextArea
                        label="Comment"
                        type="text"
                        placeholder="Comment"
                        value={typeComment}
                        onChange={(e) => setTypeComment(e.target.value)}
                      />
                    </div>
                  }
                  <div className="w-100 flex flex-h-end">
                    <button
                      className="rounded-btn m-t-20"
                      onClick={() => addMedicalRecord()}
                    >
                      Add {medicalTypes[selectedTab - 1]?.value}
                    </button>
                  </div>
                  <button className="btn w-100 m-t-20" onClick={() => next()}>
                    Continue
                  </button>
                </div>
              </div> */}

            <div className="w-100 m-t-20">
              <div className="flex flex-h-end">
                {/* <div className="rounded-btn" onClick={() => toggleModal()}>
                  + Add Record
                </div> */}
              </div>
              {/* <MedicalRecordTable data={newData || []} /> */}
            </div>
          </div>

          <div
            className="flex"
            style={{
              gap: "5px",
              alignItems: "center",
              width: "100%",
              flexWrap: "wrap",
            }}
          >
            {medicalRecordsPic?.map((images, index) => (
              <div
                key={index}
                style={{
                  width: "100%",
                  cursor: "pointer",
                  padding: "10px",
                  borderRadius: "8px",
                  transition: "all 0.3s ease",
                  border: "1px solid transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#f8f9fa";
                  e.currentTarget.style.border = "1px solid #007bff";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(0,123,255,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.border = "1px solid transparent";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
                onClick={() => {
                  setdocpaths(images);
                  openModal();
                }}
              >
                <div
                  className="flex"
                  style={{ gap: "10px", alignItems: "center" }}
                >
                  <img
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "4px",
                      transition: "transform 0.2s ease",
                    }}
                    src={doc}
                    alt="Document icon"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  />
                  <p
                    style={{
                      margin: "0",
                      fontSize: "14px",
                      transition: "color 0.2s ease",
                    }}
                  >
                    {images?.fileName}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isModalOpen && docpaths?.filePath ? (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              overflow: "hidden",
              position: "relative",
              width: "80%",
              height: "83vh",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div>{docpaths.fileName}</div>
            {/* Close Button */}
            <button
              onClick={closeModal}
              style={{
                position: "absolute",

                top: "10px",
                right: "10px",
                backgroundColor: "red",
                color: "#fff",
                border: "none",
                width: "60px",
                height: "60px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              <span
                style={{
                  fontSize: "24px",
                  lineHeight: "24px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                &times;
              </span>
            </button>

            {/* iFrame */}
            <iframe
              className="flex justify-center items-center w-full"
              src={
                hasTIFFExtension(docpaths?.filePath)
                  ? `https://docs.google.com/gview?url=${
                      docpaths?.filePath
                    }&embedded=true&cacheBust=${Date.now()}`
                  : docpaths?.filePath
              }
              style={{
                width: "100%",
                height: "100%",
                border: "none",
              }}
              title="Document Viewer"
            ></iframe>
          </div>
        </div>
      ) : (
        ""
      )}

      {modal && (
        <AddMedicalRecord
          closeModal={toggleModal}
          patientId={patientId}
          fetchData={fetchData}
          medicalRecordType={selectedTab}
        />
      )}
    </div>
  );
}

export default MedicalRecordFiles;
