import React, { useEffect, useState } from "react";
import { RiHotelBedFill } from "react-icons/ri";
import { get } from "../../utility/fetch";
import NurseNotes from "../modals/NurseNotes";

function FacilityCard({ data }) {
  const [modal, setModal] = useState(false);
  const [visits, setVisits] = useState([]);
  const [lastVisit, setLastVisit] = useState(null);


  const fetchData = async () => {
    try {
      const response = await get(`/patients/${data?.patientId}/visitrecord`);

      setVisits(response);
      setLastVisit(response[response.length - 1] || null);
    }
    catch (e) {
      console.log(e);
    }
  };


  const toggleModal = () => {
    setModal(!modal);
  }

  useEffect(() => {
    fetchData();
  }, [])
  return (
    <div className="pointer">
      {data?.status === "Occupied" ? (
        <div className="w-50" onClick={toggleModal}>
          <div className="card">

            <RiHotelBedFill size={98} className="text-green" />
            <p>{data?.facilityId}</p>
            <div>{data?.bedName}</div>
          </div>
          <div className="comment-btn w-100">
            <p className="text-center w-100 p-10">{data?.patientName || "Patient Name"}</p>
          </div>
        </div>
      ) : (
        <div className="w-50">
          <div className="card gray-bg">

            <RiHotelBedFill size={98} className="text-gray" />
            <p>{data?.facilityId}</p>
            <div>{data?.bedName}</div>
          </div>
          <button className="comment-btn w-80" disabled>
            <p className="text-center w-100 p-10">{data?.status}</p>
          </button>
        </div>
      )}

      {
        modal && (
          <NurseNotes data={lastVisit} patientId={data?.patientId} closeModal={toggleModal} isFacilityView={true} />
        )
      }
    </div>
  );
}

export default FacilityCard;
