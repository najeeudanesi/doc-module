import React, { useEffect, useState } from "react";
import { stats } from "./mockdata/PatientData";
import StatCard from "../UI/StatCard";
import PatientsBreakdown from "../UI/PatientsBreakdown";
import PatientAdmission from "../UI/PatientAdmission";

import GenderDistribution from "../UI/GenderDistribution";
import OutAndInpatientGraph from "../UI/OutAndInpatientGraph";
import { get } from "../../utility/fetch";

function Dashboard() {
  const user = localStorage.getItem("name")
  const [assignedPatients, setAssignedPatients] = useState(0)
  const [outPatients, setOutpatients] = useState(0)
  const [waiting, setWaiting] = useState(0)
  const [admitted, setAdmitted] = useState(0)
  const [hmoPatients, setHmoPatients] = useState(0)
  const [gender, setGender] = useState({})
  const [summary, setSummary] = useState([0, 0, 0, 0, 0])
  const [graph, setGraph] = useState({
    "inPatientPercentage": 0,
    "outPatientPercentage": 0,
    "dailyAverageCount": [
      {
        "date": "Mar 21",
        "inPatientCount": 0,
        "outPatientCount": 0
      },]
  })
  const [loading, setLoading] = useState(false)

  //done
  const getGraphDetails = async () => {
    try {
      const response = await fetch("https://edogoverp.com/medicals/api/dashboard/AllOutPatientAndInPatientCount");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data)
      setGraph(data);
    } catch (e) {
      console.log("Error: ", e);
    }
  };



  const getGender = async () => {
    try {
      const data = await get(
        `/dashboard/gender`
      )
      setGender(data)


    } catch (e) {
      console.log("Error: ", e)

    }

  }
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
      setOutpatients(0)

    }

  }

  const getWaiting = async () => {
    try {
      const data = await get(
        `/dashboard/assignedtodoctor`, { status: 2 }
      )

      setWaiting(data);


    } catch (e) {
      console.log("Error: ", e)

    }

  }
  const getAdmitted = async () => {
    try {
      const data = await get(
        `/dashboard/doctor/admittedpatients`,
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



  const fetchData = async () => {
    setLoading(true);
    await getAssigned();
    await getAdmitted();
    await getHmoPatients();
    await getOutPatients();
    await getWaiting();
    await getGraphDetails();
    await getGender();
    setLoading(false)

  }

  useEffect(() => {
    fetchData();
  }, [])

  useEffect(() => {
    setSummary([assignedPatients, outPatients, waiting, admitted, hmoPatients])
  }, [assignedPatients, outPatients, waiting, admitted, hmoPatients])





  return (
    <div className="w-100 m-t-80">
      {loading ? (<div className="loader">loading ...</div>) : (
        <div className="m-t-20">
          <div>Good Day</div>
          <h3 className="m-t-10">Dr. {user}</h3>
          <div className="flex w-98 gap-8 space-between m-t-10">
            {" "}
            {stats.map((stat, index) => (
              <div className="w-20" key={index}>
                <StatCard data={stat} number={summary[index]} icon={stat.icon} />
              </div>
            ))}
          </div>
          <div className="w-98 gap-16 flex">
            <div className="w-80 m-t-40">
              <OutAndInpatientGraph propdata={graph} />
              <div className="flex m-t-20 w-100">
                {/* <div className="m-r-20 w-50">
                  <PatientAdmission />
                </div>
                <div className="w-50">
                  <PatientsBreakdown />
                </div> */}
              </div>
            </div>
            <div className="w-20 m-t-40 m-r-20">
              <GenderDistribution propData={gender} />
            </div>
          </div>
        </div>
      )}


    </div>
  );
}

export default Dashboard;
