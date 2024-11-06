import React from "react";
import InputField from "../../UI/InputField";

function ContactDetails({ data }) {
  return (
    <div>
      <div className="w-40">
        {" "}
        <div className="m-t-40"></div>
        <InputField label="State Of Residence" value={data?.stateOfResidence} disabled={true} />
        <InputField label="LGA" value={data?.lgaResidence} disabled={true} />
        <InputField label="City" value={data?.city} disabled={true} />
        <InputField label="Home Address" value={data?.homeAddress} disabled={true} />
        <InputField label="Phone Number" value={data?.phone} disabled={true} />
        <InputField label="Email Address" value={data?.email} disabled={true} />
        <InputField label="Alt Phone Number" value={data?.altPhone} disabled={true} />
      </div>
    </div>
  );
}

export default ContactDetails;
