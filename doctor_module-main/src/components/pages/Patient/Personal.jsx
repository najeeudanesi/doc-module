import React, { useEffect, useState } from "react";
import InputField from "../../UI/InputField";
import { get } from "../../../utility/fetch";

function Personal({ data }) {

  const defaultImage = "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
  const [extraDetails, setExtraDetails] = useState(false);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Adjust format as needed
  };

  const getExtraDetails = async () => {
    try {
      const response = await get(`/patients/allpatientbyid/`, { patientId: data.id });
      setExtraDetails(response);

    }
    catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getExtraDetails();
  }, [])
  return (
    <div className="flex gap-10">
      <div className="w-40">
        {" "}
        <div className="m-t-40" ></div>
        <InputField label="First Name" value={data?.firstName} disabled={true} />
        <InputField label="Last Name" value={data?.lastName} disabled={true} />
        <InputField label="Gender" value={data?.gender} disabled={true} />
        <InputField label="Date Of Birth" value={formatDate(data?.dateOfBirth)} disabled={true} />
        <InputField label="Nationality" value={data?.country || "Nigerian"} disabled={true} />
        <InputField label="State Of Origin" value={data?.stateOfOrigin} disabled={true} />
        <InputField label="LGA" value={data?.lga} disabled={true} />
        <InputField label="Place Of Birth" value={data?.placeOfBirth} disabled={true} />
        <InputField label="Marital Status" value={data?.maritalStatus} disabled={true} />
      </div>

      <div className="imageDimension m-t-40">{extraDetails?.pictureUrl ? <img src={extraDetails?.pictureUrl} alt="" className="rounded-lg " /> : <img src={defaultImage} alt="" className="" />}</div>
    </div>
  );
}

export default Personal;
