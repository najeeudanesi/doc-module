import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PatientsTable from "../tables/PatientsTable";
import StatCard from "../UI/StatCard";
import { get } from "../../utility/fetch";
import { RiCalendar2Fill } from "react-icons/ri";
import { stats } from "./mockdata/PatientData";
import SearchInput from "../UI/SearchInput";
import AdmitCheck from "./Patient/AdmitCheck";
import HMOPatientListTable from "../tables/HMOPatientListTable";
import AllPatientsTable from "../tables/AllPatientsTable";
import { MdOutlineCancel } from "react-icons/md";
import { useSearchParams } from "react-router-dom"; // added import

function Patients() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [assignedPatients, setAssignedPatients] = useState(0);
  const [allPatientCount, setAllPatientCount] = useState(0);
  const [outPatients, setOutpatients] = useState(0);
  const [waiting, setWaiting] = useState(0);
  const [admitted, setAdmitted] = useState(0);
  const [hmoPatients, setHmoPatients] = useState(0);
  const [hmoPatientsList, setHmoPatientsList] = useState([]);
  const [allPatientsList, setAllPatientsList] = useState([]);

  const [summary, setSummary] = useState([0, 0, 0, 0, 0]);
  const [patientData, setPatientData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [holderData, setHolderData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [patientLoading, setPatientLoading] = useState(true);

  const [selectedTab, setSelectedTab] = useState("patients");
  const [filteredDate, setFilteredDate] = useState(null); // Add state for filtered date
  const [admittedPatients, setAdmittedPatients] = useState([]);
  const [assignedSpecialistPatients, setAssignedSpecialistPatients] = useState(
    []
  );

  const [totalPages, setTotalPages] = useState(1);
  const [totalPagesAdmitted, setTotalPagesAdmitted] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const docInfo = JSON.parse(localStorage.getItem("USER_INFO"));

  const [searchParams] = useSearchParams(); // added hook

  // new effect: read ?cardname=... and switch tab
  useEffect(() => {
    const cardname = searchParams.get("cardname");
    if (!cardname) return;

    console.log("cardname from URL:", cardname);

    const decoded = decodeURIComponent(cardname).trim();
    const matched = stats.find(
      (s) =>
        (s.title && s.title === decoded) ||
        (s.name && s.name === decoded) ||
        (s.label && s.label === decoded) ||
        (s.type && s.type === decoded)
    );

    if (matched) {
      setSelectedTab(matched.type);
      return;
    }

    // fallback mapping for common display names -> tab types
    const nameMap = {
      "assigned patients": "patients",
      assigned: "patients",
      "admitted patients": "admittedPatients",
      "hmo patients": "hmoPatients",
      "all patients": "allPatients",
      "reffered patients (external)": "specialistPatients",
      "referred patients (external)": "specialistPatients",
    };

    const key = decoded.toLowerCase();
    if (nameMap[key]) setSelectedTab(nameMap[key]);
  }, [searchParams]);

  const getTableData = async (page = 1, pageSize = 20) => {
    setPatientLoading(true);
    try {
      const data = await get(
        `/patients/assignedtodoctor?pageIndex=${page}&pageSize=${pageSize}`
      );
      setPatientData(data.data); // array of patients
      setFilteredData(data.data);
      setHolderData(data.data);
      setTotalPages(data.pageCount); // set total pages for pagination
      setCurrentPage(data.pageIndex); // update current page
    } catch (e) {
      setPatientLoading(false);
      console.log("Error: ", e);
    }
    setPatientLoading(false);
  };

  const getAssignedSpecialistPatients = async () => {
    try {
      const data = await get(
        `/patients/assignedtodoctorspecialist?pageIndex=1&pageSize=1000`
      );
      setAssignedSpecialistPatients(data.data);
      console.log("Assigned Specialist Patients:", data.data);
    } catch (e) {
      console.log("Error: ", e);
    }
  };

  //done
  const getAssigned = async () => {
    try {
      const data = await get(`/dashboard/assignedtodoctor`, { status: 1 });
      setAssignedPatients(data);
      console.log(data);
    } catch (e) {
      console.log("Error: ", e);
    }
  };

  const getAllPatientCount = async () => {
    try {
      const data = await get(`/dashboard/AllPatientCount`, { status: 1 });
      setAllPatientCount(data);
      console.log(data);
    } catch (e) {
      console.log("Error: ", e);
    }
  };

  // https://edogoverp.com/medicals/api/HMO/all-patient-hmo/2?pageIndex=1&pageSize=10

  const getOutPatients = async () => {
    try {
      const data = await get(`/dashboard/AllOutPatientAndInPatientCount`);

      setOutpatients(data.outpatientCount || 0);
    } catch (e) {
      console.log("Error: ", e);
    }
  };

  const getHMOPatientsByClientId = async (pageIndex = 1, pageSize = 1000) => {
    try {
      const data = await get(
        `/HMO/all-patient-hmo/${docInfo.clinicId}?pageIndex=${pageIndex}&pageSize=${pageSize}`
      );
      console.log(data);
      setHmoPatientsList(data.data);

      // setOutpatients(data.outpatientCount || 0);
    } catch (e) {
      console.log("Error: ", e);
    }
  };

  const getAllPatientsList = async (
    pageIndex = 1,
    pageSize = 1000,
    searchText = ""
  ) => {
    try {
      const params = new URLSearchParams({
        pageIndex,
        pageSize,
      });

      if (searchText) {
        params.append("firstName", searchText);
      }

      const data = await get(`/patients/filter?${params.toString()}`);
      console.log(data);
      setAllPatientsList(data.data);
    } catch (e) {
      console.log("Error: ", e);
    }
  };

  const getWaiting = async () => {
    try {
      const data = await get(`/dashboard/assignedtodoctor`, { status: 1 });

      setWaiting(data);
    } catch (e) {
      console.log("Error: ", e);
    }
  };
  const getAdmitted = async () => {
    try {
      const data = await get(`/dashboard/doctor/admittedpatients`);

      setAdmitted(data);
    } catch (e) {
      console.log("Error: ", e);
    }
  };

  //done
  const getHmoPatients = async () => {
    try {
      const data = await get(`/dashboard/hmo-patient`);

      setHmoPatients(data);
    } catch (e) {
      console.log("Error: ", e);
    }
  };

  const getAllAdmittedPatients = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const res = await get(
        `/ServiceTreatment/list/paginate/true/admitted-patients?pageNumber=${page}&pageSize=${pageSize}`
      );
      // Use recordList for data and metadata for pagination
      setAdmittedPatients(res?.data?.recordList || []);
      setTotalPagesAdmitted(res?.data?.metadata?.totalPages || 1);
      setCurrentPage(res?.data?.metadata?.page || 1);
    } catch (error) {
      console.error("Error fetching admitted patients:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (admittedPatients.length > 10) {
      getAllAdmittedPatients(currentPage);
    }
  }, [currentPage, admittedPatients]);

  useEffect(() => {
    fetchData();
    getAllAdmittedPatients(currentPage);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    await getAssigned();
    await getAllPatientCount();

    await getHMOPatientsByClientId();
    await getAllPatientsList();
    await getAdmitted();
    await getHmoPatients();
    await getOutPatients();
    await getWaiting();
    await getTableData();
    await getAssignedSpecialistPatients();
    setLoading(false);
  };

  useEffect(() => {
    setSummary([
      assignedPatients,
      admitted, // Use the count from API instead of array length
      hmoPatientsList?.length,
      allPatientCount,
    ]);
  }, [
    assignedPatients,
    allPatientCount,
    waiting,
    admitted,
    hmoPatients,
    admittedPatients,
    hmoPatientsList,
  ]);

  useEffect(() => {
    if (searchText === "") {
      dateFilter();
      return;
    }
    const filteredResults = patientData.filter(
      (patient) =>
        patient?.firstName?.toLowerCase()?.includes(searchText?.toLowerCase()) ||
        patient?.lastName?.toLowerCase()?.includes(searchText?.toLowerCase())
    );

    setFilteredData(filteredResults);
  }, [searchText]);

  // Function to handle date change
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setFilteredDate(date); // Set the filtered date
  };

  const dateFilter = async () => {
    // await getTableData();
    // setFilteredData(patientData);
    if (filteredDate) {
      const filteredResults = patientData.filter((patient) => {
        // Parse the date string into a Date object
        const patientDateRaw = patient?.dateCreated;

        const patientDate = new Date(patientDateRaw);

        // Extract the date components
        const patientYear = patientDate.getFullYear();
        const patientMonth = patientDate.getMonth();
        const patientDay = patientDate.getDate();

        // Extract the selected date components
        const selectedYear = filteredDate.getFullYear();
        const selectedMonth = filteredDate.getMonth();
        const selectedDay = filteredDate.getDate();

        // Compare the date components
        return (
          patientYear === selectedYear &&
          patientMonth === selectedMonth &&
          patientDay === selectedDay
        );
      });

      setFilteredData(filteredResults);
    } else {
      setFilteredData(patientData);
    }
  };
  useEffect(() => {
    dateFilter();
  }, [filteredDate]);

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
    // alert('')

    // if (selectedTab === "patients") {
    //   getAllPatientsList(1,1000, event.target.value)

    // }
    // if (selectedTab === "admittedPatients") {
    //   getAllAdmittedPatients(1,1000, event.target.value)

    // }
    // if (selectedTab === "hmoPatients") {
    //   getAllPatientsList(1,1000, event.target.value)

    // }
    if (selectedTab === "allPatients") {
      getAllPatientsList(1, 1000, event.target.value);
    }
  };

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const CustomInput = ({ value, onClick }) => (
    <div className="custom-datepicker-input flex gap-6 flex-v-center">
      <button
        onClick={onClick}
        onKeyDown={(e) => e.preventDefault()} // Prevent typing in the date field
        className="custom-datepicker-input flex gap-6 flex-v-center"
      >
        {filteredDate ? formatDate(selectedDate) : "Select Date"}{" "}
        {/* Update this line */}
        <RiCalendar2Fill />
      </button>
    </div>
  );

  return (
    <div className="w-100 m-t-80 p-20">
      {!loading ? (
        <div className="">
          <h3>Patients Management</h3>
          <div>
            <div className="flex w-100 gap-8 m-t-20">
              {stats.map((stat, index) => (
                <div
                  style={{
                    backgroundColor:
                      selectedTab == stat.type ? "#D5FFD5" : "white",
                  }}
                  onClick={() => setSelectedTab(stat.type)}
                  className="w-20"
                  key={index}
                >
                  <StatCard
                    data={stat}
                    number={summary[index]}
                    icon={stat.icon}
                  />
                </div>
              ))}
            </div>
          </div>{" "}
          {/* <div className="tabs m-t-20 bold-text">
            <div
              className={`tab-item ${
                selectedTab === "patients" ? "active" : ""
              }`}
              onClick={() => setSelectedTab("patients")}
            >
              Patients To See
            </div>
            <div
              className={`tab-item ${
                selectedTab === "admitted" ? "active" : ""
              }`}
              onClick={() => setSelectedTab("admitted")}
            >
              Patients Currently Admitted
            </div>
          </div> */}
          <div
            className=" flex gap-7 w-100 justify-between mt-40"
            style={{ alignItems: "center", marginTop: "70px" }}
          >
            <div className=" flex gap-7 w-100 ">
              <div
                className="flex"
                style={{
                  cursor: "pointer",
                  alignItems: "center",
                  marginLeft: "18px",
                  position: "relative",
                  zIndex: "1"
                }}
              >
                {/* <p>Assigned Waiting Patients</p>| */}
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  dateFormat="dd-MM-yyyy"
                  maxDate={new Date()}
                  customInput={<CustomInput />}
                  icon={<RiCalendar2Fill />}
                />
                <span
                  style={{
                    display: "inline-block",
                    width: "1px",
                    height: "24px",
                    background: "#ccc",
                    // margin: "0 12px",
                    verticalAlign: "middle",
                  }}
                />
                <MdOutlineCancel
                  onClick={() => {
                    setFilteredDate(null);
                    getTableData();
                  }}
                  style={{
                    width: "20px",
                    height: "20px",
                    cursor: "pointer",
                    // border: "1px solid #ccc",
                    borderRadius: "4px",
                    // padding: "4px 8px",
                  }}
                />
              </div>
              {(selectedTab === "allPatients" ||
                selectedTab === "patients") && (
                <div className="flex flex-v-end space-between  w-50 ">
                  <div className="">
                    <SearchInput
                      type="text"
                      onChange={handleSearchChange}
                      value={searchText}
                      name="searchText"
                    />
                  </div>
                  {/* <div className="dropdown-input w-25 ">
                {" "}
                <select>
                  <option value="">Name</option>
                  <option value="Ward B">Age</option>
                  <option value="Ward C"></option>
                  <option value="Ward D">Ward D</option>
                </select>
              </div> */}
                </div>
              )}
            </div>
            <div className="flex gap-10 w-100">
              <button
                className={`btn toggle-btn ${
                  selectedTab === "patients" ? "active" : ""
                }`}
                style={{
                  backgroundColor:
                    selectedTab === "patients" ? "#3c7e2d" : "#fff",
                  color: selectedTab === "patients" ? "#fff" : "#3c7e2d",
                  border:
                    selectedTab === "patients"
                      ? "2px solid #3c7e2d"
                      : "2px solid #3c7e2d",
                  fontWeight: selectedTab === "patients" ? "bold" : "normal",
                  boxShadow:
                    selectedTab === "patients"
                      ? "0 2px 8px rgba(0,123,255,0.15)"
                      : "none",
                }}
                onClick={() => setSelectedTab("patients")}
              >
                Assigned Patients
              </button>
              <button
                className={`btn toggle-btn ${
                  selectedTab === "specialistPatients" ? "active" : ""
                }`}
                style={{
                  backgroundColor:
                    selectedTab === "specialistPatients" ? "#3c7e2d" : "#fff",
                  color:
                    selectedTab === "specialistPatients" ? "#fff" : "#3c7e2d",
                  border:
                    selectedTab === "specialistPatients"
                      ? "2px solid #3c7e2d"
                      : "2px solid #3c7e2d",
                  fontWeight:
                    selectedTab === "specialistPatients" ? "bold" : "normal",
                  boxShadow:
                    selectedTab === "specialistPatients"
                      ? "0 2px 8px rgba(0,123,255,0.15)"
                      : "none",
                }}
                onClick={() => setSelectedTab("specialistPatients")}
              >
                Reffered Patients (External)
              </button>
            </div>
          </div>
          {/* <AdmitCheck
                data={admittedPatients}
                getAllAdmittedPatients={getAllAdmittedPatients}
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                totalPages={totalPagesAdmitted}
              /> */}
          <div className="">
            {selectedTab === "patients" ? (
              <PatientsTable
                loading={patientLoading}
                data={filteredData}
                setCurrentPage={(page) => {
                  setCurrentPage(page);
                  getTableData(page, 20); // 10 per page, or use your preferred pageSize
                }}
                currentPage={currentPage}
                totalPages={totalPages}
              />
            ) : selectedTab === "specialistPatients" ? (
              <PatientsTable
                data={assignedSpecialistPatients}
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                totalPages={totalPages}
                extraColumns={[
                  { key: "refferalNote", label: "Referral Note" },
                  { key: "diagnosis", label: "Diagnosis" },
                ]}
              />
            ) : selectedTab === "admittedPatients" ? (
              <AdmitCheck
                data={admittedPatients}
                getAllAdmittedPatients={getAllAdmittedPatients}
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                totalPages={totalPagesAdmitted}
              />
            ) : selectedTab === "hmoPatients" ? (
              <HMOPatientListTable patients={hmoPatientsList} />
            ) : selectedTab === "allPatients" ? (
              <AllPatientsTable patients={allPatientsList} />
            ) : (
              ""
            )}
          </div>
        </div>
      ) : (
        <div>loading....</div>
      )}
    </div>
  );
}

export default Patients;
