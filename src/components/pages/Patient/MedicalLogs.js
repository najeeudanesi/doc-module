import React, { useState, useEffect } from "react";
import "./ConsultationLog.css";
import { FaPlus, FaRegNoteSticky } from "react-icons/fa6";
import { FiEdit } from "react-icons/fi";
import FamilyConsultation from "./FamilyConsultation";
import AddNotes from "./AddNotes";
import FamilyConsultationReadOnly from "./FamilyConsultationReadOnly";
import FamilyMedicineTable from "./FamilyMedicineTable";
import { get } from "../../../utility/fetch";
import BirthRecordForm from "./BirthRecordForm";
import IVFConsultationTable from "./IVFConsultationTable";
import OrthopedicTable from "./OrthopedicTable";
import GeneralSurgery from "./GeneralSurgery";
import GeneralSurgeryTable from "./GeneralSurgeryTable";
import GeneralPractice from "./GeneralPracticeTable";
import OpthalmologyTable from "./OpthalmologyTable";
import AntinatalTable from "./AntinatalTable";
import CardiologyTable from "./CardiologyTable";
import { fileFromPath } from "openai";
import AllOtherPracticesTable from "./AllOtherPracticesTable";

const MedicalLog = ({ patient }) => {
  const [selectedSection, setSelectedSection] = useState("");
  const [newSpecialists, setNewSpecialists] = useState([]);
  const [selectedNewSpecialists, setSelectedNewSpecialists] = useState(null);
  const [visibleOptions, setvisibleOptions] = useState([]);
  const [FamilyMedicine, setFamilyMedicine] = useState([]);
  const [OG_IVF, setOG_IVF] = useState([]);
  const [orthopedic, setorthopedic] = useState([]);
  const [GeneralSurgery, setGeneralSurgery] = useState([]);
  const [Antenatal, setAntenatal] = useState([]);
  const [generalPracticeState, setGeneralPracticeState] = useState([]);
  const [opthalmology, setOpthalmology] = useState([]);
  const [cardiology, setcardiology] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // console.log(patient);
    getAvailableSIdebar(patient?.id);
  }, []);

  useEffect(() => {
    getSpecialist();

    const stateMap = {
      familymedcine: FamilyMedicine,
      ivf: OG_IVF,
      orthopedic: orthopedic,
      generalsurgery: GeneralSurgery,
      atenatal: Antenatal,
      generalPractice: generalPracticeState,
      opthalmology: opthalmology,
      cardiology: cardiology,
    };

    console.log(stateMap);

    // filter options based on non-empty state arrays
    let filteredOptions = sections.filter((opt) => {
      const stateValue = stateMap[opt.key];
      return stateValue && stateValue.length > 0;
    });

    console.log(filteredOptions);
    setvisibleOptions(filteredOptions);
  }, [
    FamilyMedicine,
    OG_IVF,
    orthopedic,
    GeneralSurgery,
    Antenatal,
    generalPracticeState,
    opthalmology,
    cardiology,
  ]);

  //   const getPatientDetails = async () => {
  //     setLoading(true);
  //     try {
  //       const data = await get(`/FamilyMedicine/list/1/10`);
  //       setPatient(data);
  //       console.log(data);
  //       console.log(data?.id);
  //       setVisit(data?.visits?.pop());
  //     } catch (e) {
  //       console.log(e);
  //     }
  //     setLoading(false);
  //   };

  //   useEffect(() => {
  //     getPatientDetails();
  //   }, []);

  const logs = [
    {
      date: "02.04.2025",
      type: "Case Note",
      history: "Family Planning Consultation Analysis",
      doctor: "Dr. Williams Humphrey",
    },
    {
      date: "02.04.2025",
      type: "Follow-up Consultation",
      history: "Family Planning Consultation Analysis",
      doctor: "Dr. Williams Humphrey",
    },
  ];

  // const getAvailableSIdebar = async (patient) => {
  //   const Ivf = await get(`/OG_IVF/list/patient/${patient}/${1}/10`);
  //   setOG_IVF(Ivf?.data);
  //   console.log(Ivf?.data);
  //   const orthopedic = await get(`/orthopedic/list/patient/${patient}/${1}/10`);
  //   setorthopedic(orthopedic?.data?.recordList);

  //   const GeneralSurgery = await get(
  //     `/GeneralSurgery/list/patient/${patient}/${1}/10`
  //   );
  //   setGeneralSurgery(GeneralSurgery?.data?.recordList);
  //   const Antenatal = await get(`/Antenatal/list/patient/${patient}/${1}/10`);
  //   setAntenatal(Antenatal?.data?.recordList);

  //   const FamilyMedicine = await get(
  //     `/FamilyMedicine/list/patient/${patient}/${1}/10`
  //   );
  //   setFamilyMedicine(FamilyMedicine?.data?.recordList);

  //   const GeneralPracticeArray = await get(
  //     `/GeneralPractice/list/patient/${patient}/${1}/10`
  //   );
  //   setGeneralPracticeState(GeneralPracticeArray?.data?.recordList);

  //   const cardiology = await get(`/cardiology/list/patient/${patient}/${1}/10`);
  //   setcardiology(cardiology?.data?.recordList);
  // };

  const getAvailableSIdebar = async (patient) => {
    setLoading(true);

    // Create an array of all your promises
    const promises = [
      get(`/OG_IVF/list/patient/${patient}/${1}/10`),
      get(`/orthopedic/list/patient/${patient}/${1}/10`),
      get(`/GeneralSurgery/list/patient/${patient}/${1}/10`),
      get(`/Antenatal/list/patient/${patient}/${1}/10`),
      get(`/FamilyMedicine/list/patient/${patient}/${1}/10`),
      get(`/GeneralPractice/list/patient/${patient}/${1}/10`),
      get(`/Ophthalmology/list/patient/${patient}/${1}/10`),
      get(`/cardiology/list/patient/${patient}/${1}/10`),
    ];
    try {
      // Wait for all promises to resolve
      const [
        IvfResponse,
        orthopedicResponse,
        GeneralSurgeryResponse,
        AntenatalResponse,
        FamilyMedicineResponse,
        GeneralPracticeArrayResponse,
        OphthalmologyResponse,
        cardiologyResponse,
      ] = await Promise.all(promises);

      // Once all are resolved, set your states
      setOG_IVF(IvfResponse?.data?.recordList);
      // console.log(IvfResponse?.data); // Your existing console log

      setorthopedic(orthopedicResponse?.data?.recordList);
      setGeneralSurgery(GeneralSurgeryResponse?.data?.recordList);
      setAntenatal(AntenatalResponse?.data?.recordList);
      setFamilyMedicine(FamilyMedicineResponse?.data?.recordList);
      setGeneralPracticeState(GeneralPracticeArrayResponse?.data?.recordList);
      setOpthalmology(OphthalmologyResponse?.data?.recordList);
      setcardiology(cardiologyResponse?.data?.recordList);

      // NOW all operations have finished loading
      console.log("All sidebar data has finished loading!");
      setLoading(false);

      // You can also set a loading state to false here
      // setLoading(false); // If you have a loading state
    } catch (error) {
      setLoading(false);
      console.error("Error loading sidebar data:", error);
      // Handle errors, e.g., show an error message to the user
      // setError(true); // If you have an error state
    }
  };

  const [selectedRecords, setSelectedRecords] = useState([]);

  const handleSelectChange = (e) => {
    const selectedValue = e.target.value;

    console.log(selectedValue);

    const temp = sections.find((temps) => temps.key == e.target.value);

    const filterChecker = visibleOptions.find((k) => k.key == temp.key);
    console.log(temp);
    setSelectedNewSpecialists(temp)

    if (filterChecker) {
      alert("Already on List");
    } else setvisibleOptions([...visibleOptions, temp]);

    // console.log([
    //   ...visibleOptions,
    //   { key: selectedValue.toLowerCase(), value: selectedValue },
    // ]);

    // console.log(filteredOptions);

    //   const optionsMap = {
    //   familymedcine: FamilyMedicine,
    //   ivf: OG_IVF,
    //   Orthopedic: orthopedic,
    //   generalsurgery: GeneralSurgery,
    //   atenatal: Antenatal,
    //   generalPractice: generalPracticeState,
    //   cardiology: cardiology,
    // };

    //   setSelectedRecords(optionsMap[selectedValue] || []);
  };
  const renderComponent = () => {
    switch (selectedSection.key) {
      case "familymedcine":
        return <FamilyMedicineTable patient={patient} />;
      case "birthrecord":
        return <BirthRecordForm patient={patient} />;
      case "ivf":
        return <IVFConsultationTable patient={patient} />;
      case "orthopedic":
        return <OrthopedicTable patient={patient} />;
      case "generalsurgery":
        return <GeneralSurgeryTable patient={patient} />;
      case "atenatal":
        return <AntinatalTable patient={patient} />;
      case "generalPractice":
        return <GeneralPractice patient={patient} />;
      case "opthalmology":
        return <OpthalmologyTable patient={patient} />;
      case "cardiology":
        return <CardiologyTable patient={patient} />;

      default:
        return selectedSection? <AllOtherPracticesTable selectedSpecialists={selectedSection} patient={patient} />:'';
    }
  };

  const getSpecialist = async () => {
    try {
      const response = await get(`/RoleSpecialist/list`);
      if (response.isSuccess) {
        // Filter out unwanted specialist names
        const filtered = response.data
          .filter((e) => e.role.name === "Doctor")
          .filter(
            (e) =>
              e.specialistService !== "Ophthalmologist" &&
              e.specialistService !== "Cardiologist" &&
              e.specialistService !== "General Surgeon" &&
              e.specialistService !== "Family Planning" &&
              e.specialistService !== "O&G IVF" &&
              e.specialistService !== "Opthalmology" &&
              e.specialistService !== "Orthopedic" &&
              e.specialistService !== "O&G Antenatal/Post-natal" &&
              e.specialistService !== "General Surgery" &&
              e.specialistService !== "General Practice" &&
              e.specialistService !== "Cardiology"
          );

          setNewSpecialists(filtered);
        console.log(filtered);
      }
    } catch (error) {
      console.error("Failed to fetch specialists:", error);
    }
  };

  const sections = [
    { key: "familymedcine", label: "Family Planning", idz: 0 },
    { key: "ivf", label: "O&G IVF", idz: 0 },
    { key: "opthalmology", label: "Opthalmology", idz: 0 },
    { key: "orthopedic", label: "Orthopedic", idz: 0 },
    { key: "atenatal", label: "O&G Antenatal/Post-natal", idz: 0 },
    { key: "generalsurgery", label: "General Surgery", idz: 0 },
    { key: "generalPractice", label: "General Practice", idz: 0 },
    { key: "cardiology", label: "Cardiology", idz: 0 },
    ...newSpecialists.map((spec) => ({ idz: spec.specialistService.toLowerCase().replace(/\s+/g, ''), label: spec.specialistService, key:spec.id })),
    // { key: "pediatrics", label: "Pediatrics" },
  ];

  return (
    <div className="w-100 consultation-page">
      <div>
        <div>
          <select
            className="border px-4 py-2 rounded"
            onChange={handleSelectChange}
            defaultValue=""
          >
            <option value="" disabled>
              Add Specialty Type
            </option>
            {sections.map((e) => (
              <option value={e.key}>{e.label}</option>
            ))}
            {/* <option value="Orthopedic">Orthopedic</option>
            <option value="GeneralSurgery">General Surgery</option>
            <option value="Antenatal">Antenatal</option>
            <option value="FamilyMedicine">Family Medicine</option>
            <option value="GeneralPractice">General Practice</option>
            <option value="Cardiology">Cardiology</option> */}
          </select>

          {/* <div className="mt-4">
          <h2 className="font-bold">Selected Records:</h2>
          <pre>{JSON.stringify(selectedRecords, null, 2)}</pre>
        </div> */}
        </div>
        <div
          className="m-t-10"
          style={{ display: "flex", alignItems: "start" }}
        >
          <div className="sidebar">
            <ul>
              {visibleOptions?.map((section) => (
                <li
                  key={section.key}
                  className={selectedSection.key === section.key ? "active" : ""}
                  onClick={() => setSelectedSection(section)}
                >
                  {section.label}
                </li>
              ))}
            </ul>
          </div>
          <div className="">
            {loading ? <p>Loading patient details...</p> : renderComponent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalLog;
