import React from "react";
import InputField from "../../UI/InputField";

function EmergencyContact({ data, next }) {
  return (
    <div className="w-40">
      {" "}
      <div className="m-t-40"></div>
      <InputField label="Relationship" value={data?.relationship} disabled={true} />
      <InputField label="First Name" value={data?.firstName} disabled={true} />
      <InputField label="Last Name" value={data?.lastName} disabled={true} />
      {/* <InputField label="Gender" value={data.gender} disabled={true} /> */}
      {/* <InputField label="Date Of Birth" value={data.dateOfBirth} disabled={true} /> */}

      <InputField label="State Of Residence" value={data?.stateOfResidence} disabled={true} />
      <InputField label="City" value={data?.city} disabled={true} />
      <InputField label="LGA" value={data?.lga} disabled={true} />
      <InputField label="Contact Address" value={data?.contactAddress} disabled={true} />
      <InputField label="Email" value={data?.email} disabled={true} />
      <InputField label="Phone" value={data?.phone} disabled={true} />
      <InputField label="Alt Phone" value={data?.altPhone} disabled={true} />
      <button className="btn m-t-20 w-100" onClick={() => next()}>Continue</button>
    </div>
  );
}

export default EmergencyContact;
