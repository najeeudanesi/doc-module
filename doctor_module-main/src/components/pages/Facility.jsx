import React, { useEffect, useState } from "react";
import FacilityCard from "../UI/FacilityCard";
import { get } from "../../utility/fetch";

function Facility() {
  // Sample data with a patient's name
  const [selectedTab, setSelectedTab] = useState("beds");
  const [newData, setNewData] = useState([])
  const [available, setAvailable] = useState(0);
  const [occupied, setOccupied] = useState(0);


  const data = [
    {
      patientName: "William Humphrey",
      facilityId: "A1",
      occupied: true,
    },


  ];

  const fetchData = async () => {
    try {
      const response = await get(`/facilities/beds/assignedtodoctor`)

      setNewData(response)
      calculateOccupied(response);
      calculateAvailable(response);

    } catch (e) {
      console.log(e)
    }

  }

  const calculateOccupied = (data) => {
    const occupied = data.filter((item) => item.isOccupied === "Occupied").length
    setOccupied(occupied)
  }

  const calculateAvailable = (data) => {
    const available = data.filter((item) => item.isOccupied === "Vacant").length
    setAvailable(available)
  }




  useEffect(() => {
    fetchData();
  }, [])

  const renderTabContent = () => {
    switch (selectedTab) {
      case "beds":
        return (
          <div>
            <div className="flex gap-8 m-t-20">
              <div className="bold-text">
                Assigned Patients location |
              </div>
              <div className="flex gap-10"> <h4>Occupied: {occupied}</h4> <h4>Available: {available}</h4></div>
            </div>

            {newData ? (<div className="grid m-t-20">
              {newData.map((patient, index) => (
                <FacilityCard key={index} data={patient} />
              ))}
            </div>) : (<div>null</div>)}
          </div>
        );
      case "equipments":
        // Render equipment content here
        return <div>Equipment Content</div>;
      case "ambulance":
        // Render ambulance content here
        return <div>Ambulance Content</div>;
      default:
        return null;
    }
  };

  return (
    <div className="w-100">
      <div className="m-t-20">...</div>
      <div className="m-t-20 bold-text">Facility | Bed Management</div>

      <div className="tabs flex m-t-20 bold-text">
        <div
          className={`tab-item ${selectedTab === "beds" ? "active" : ""}`}
          onClick={() => setSelectedTab("beds")}
        >
          Beds
        </div>

        <div
          className={`tab-item ${selectedTab === "equipments" ? "active" : ""}`}
          onClick={() => setSelectedTab("equipments")}
        >
          Equipments
        </div>

        <div
          className={`tab-item ${selectedTab === "ambulance" ? "active" : ""}`}
          onClick={() => setSelectedTab("ambulance")}
        >
          Ambulance
        </div>
      </div>

      {/* <div className="dropdown-input w-25 m-t-20 ">
        <select>
          <option value="Ward A">Ward A</option>
          <option value="Ward B">Ward B</option>
          <option value="Ward C">Ward C</option>
          <option value="Ward D">Ward D</option>
        </select>
      </div> */}



      {renderTabContent()}
    </div>
  );
}

export default Facility;
