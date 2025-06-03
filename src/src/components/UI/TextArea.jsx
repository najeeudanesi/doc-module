import React from "react";

function TextArea(props) {
  return (
    <div className="flex flex-v-center m-t-20">
      <div className="label-textarea">{props.label}</div>
      <textarea
        className="text-area-input-field"
        type={props.type}
        placeholder={props.placeholder}
        name={props.name}
        value={props.value}
        onChange={props.onChange}
        disabled={props.disabled}
      />
    </div>
  );
}

export default TextArea;
