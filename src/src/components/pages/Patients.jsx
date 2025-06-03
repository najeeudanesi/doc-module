import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PatientsTable from "../tables/PatientsTable";
import StatCard from "../UI/StatCard";
import { get } from "../../utility/fetchWeb";
import { RiCalendar2Fill } from "react-icons/ri";
import { stats } from "./mockdata/PatientData";
import SearchInput from "../UI/SearchInput";
import AdmitCheck from "./Patient/AdmitCheck";

function Patients() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [assignedPatients, setAssignedPatients] = useState(0)
  const [outPatients, setOutpatients] = useState(0)
  const [waiting, setWaiting] = useState(0)
  const [admitted, setAdmitted] = useState(0)
  const [hmoPatients, setHmoPatients] = useState(0)
  const [summary, setSummary] = useState([0, 0, 0, 0, 0])
  const [patientData, setPatientData] = useState([])
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("")
  const [loading, setLoading] = useState(false)

  const [selectedTab, setSelectedTab] = useState("patients");
  const [filteredDate, setFilteredDate] = useState(null); // Add state for filtered date
  const [admittedPatients, setAdmittedPatients] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const doctorId = sessionStorage.getItem("userId");

  const getTableData = async () => {
    try {
      // const data = await get(`/patients/assignedtodoctor`);
      // setPatientData(data.data);
      // setFilteredData(data.data); // Initialize filtered data with all patient data


      ;
    } catch (e) {
      console.log("Error: ", e);
    }
  };

  //done
  const getAssigned = async () => {
    try {
      const data = await get(
        `/dashboard/assignedtodoctor`, { status: 1 }
      )
      setAssignedPatients(data)


    } catch (e) {
      console.log("Error: ", e)

    }

  }

  const getOutPatients = async () => {
    try {
      const data = await get(
        `/dashboard/AllOutPatientAndInPatientCount`
      )

      setOutpatients(data.outpatientCount || 0);



    } catch (e) {
      console.log("Error: ", e)

    }

  }

  const getWaiting = async () => {
    try {
      const data = await get(`/Appointment/doctor/${doctorId}`)
      console.log("Waiting patients: ", data?.data)
      if (data?.status === "success") {
        setPatientData(data?.data);
      } else {
        setPatientData([])
      }
    } catch (e) {
      console.log("Error: ", e)
    }

  }
  const getAdmitted = async () => {
    try {
      const data = await get(
        `/dashboard/doctor/admittedpatients`
      )

      setAdmitted(data);


    } catch (e) {
      console.log("Error: ", e)

    }

  }

  //done
  const getHmoPatients = async () => {
    try {
      const data = await get(
        `/dashboard/hmo-patient`
      )

      setHmoPatients(data);


    } catch (e) {
      console.log("Error: ", e)

    }

  }

  const getAllAdmittedPatients = async (currentPage) => {
    setLoading(true);
    try {
      let res = await get(`/patients/admitted-patients-service?pageNumber=${currentPage}&pageSize=10`);
      setAdmittedPatients(res?.data);
      setTotalPages(res?.pageCount);
    } catch (error) {
      console.error('Error fetching all patients:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllAdmittedPatients(currentPage)
  }, [currentPage]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true)
    
    await getWaiting();
    await getTableData()
    setLoading(false)
  }

  useEffect(() => {
    setSummary([assignedPatients, outPatients, waiting, admitted, hmoPatients]);
  }, [assignedPatients, outPatients, waiting, admitted, hmoPatients]);

  useEffect(() => {
    if (searchText === "") {
      dateFilter();
      return
    }
    const filteredResults = patientData.filter((patient) =>
      patient.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
      patient.lastName.toLowerCase().includes(searchText.toLowerCase())
    );

    setFilteredData(filteredResults);

  }, [searchText]);

  // Function to handle date change
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setFilteredDate(date); // Set the filtered date
  };

  const dateFilter = async () => {
    await getTableData();
    setFilteredData(patientData);
    if (filteredDate) {
      const filteredResults = patientData.filter((patient) => {
        // Parse the date string into a Date object
        const patientDateRaw = patient?.dateCreated

        const patientDate = new Date(patientDateRaw)

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
  }
  useEffect(() => {
    dateFilter();
  }, [filteredDate]);


  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };


  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const CustomInput = ({ value, onClick }) => (
    <button
      onClick={onClick}
      onKeyDown={(e) => e.preventDefault()} // Prevent typing in the date field
      className="custom-datepicker-input flex gap-6 flex-v-center"
    >
      {filteredDate ? formatDate(selectedDate) : "Select Date"} {/* Update this line */}
      <RiCalendar2Fill />
    </button>
  );

  return (
    <div className="w-100 m-t-80 p-20">

      {!loading ? (<div className="">
        <h3>Patients Management</h3>
        <div>
          <div className="flex w-100 space-between gap-8 m-t-20">
            {stats.map((stat, index) => (
              <div className="w-20" key={index}>
                <StatCard data={stat} number={summary[index]} icon={stat.icon} />
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-v-center w-100 space-between">
          <div className="flex gap-7 m-t-40">
            <p>Assigned Waiting Patients</p>|
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              dateFormat="dd-MM-yyyy"
              maxDate={new Date()}
              customInput={<CustomInput />}
              icon={<RiCalendar2Fill />}
            />
          </div>

          <div className="flex flex-v-end space-between  w-50 m-t-20 gap-10 ">
            <div></div>
            <div className="w-50">
              <SearchInput type="text" onChange={handleSearchChange} value={searchText} name="searchText" />
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
        </div>
        <div className="tabs m-t-20 bold-text">
          <div
            className={`tab-item ${selectedTab === "patients" ? "active" : ""}`}
            onClick={() => setSelectedTab("patients")}
          >
            Patients To See
          </div>
          <div
            className={`tab-item ${selectedTab === "admitted" ? "active" : ""}`}
            onClick={() => setSelectedTab("admitted")}
          >
            Patients Currently Admitted
          </div>

        </div>
        <div className="">
          {
            selectedTab === "patients" ? (
              <PatientsTable
                data={patientData}
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                totalPages={totalPages}

              />
            ) : (
              <AdmitCheck
                data={admittedPatients}
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                totalPages={totalPages}

              />
            )
          }
        </div>
      </div>) : (<div>loading....</div>)}


    </div>
  );
}

export default Patients;
