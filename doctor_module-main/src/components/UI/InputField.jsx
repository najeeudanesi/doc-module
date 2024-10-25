import React from "react";

function InputField(props) {
  return (
    <div className="flex flex-v-center m-t-10">
      {props.label &&
        <div className="label ">{props.label}</div>
      }
      <input
        className="input-field"
        type={props.type}
        placeholder={props.placeholder}
        name={props.name}
        value={props.value}
        onChange={props.onChange}
        disabled={props.disabled}
        required={props.required}
      />
    </div>
  );
}

export default InputField;
