import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import Wrapper from "../Wrapper";
import "./style.css";

function EditableTextField({ title, onChange, save }) {
  const [isEditable, setIsEditable] = useState(false);
  const projectNameFieldCss = {
    padding: "6px 10px",
  };

  const onTextClick = () => {
    setIsEditable(true);
  };

  const onBlur = () => {
    setIsEditable(false);
    save();
  };

  useEffect(() => {
    if (isEditable) {
      const input = document.querySelector(".editInput");
      input.focus();
      input.select();
    }
  }, [isEditable]);

  const inputWidth = { width: (title?.length + 1) * 6.5 + "px" };

  return isEditable ? (
    <input
      className="editInput"
      type="text"
      value={title}
      style={inputWidth}
      onChange={onChange}
      onBlur={onBlur}
    />
  ) : (
    <Wrapper customCss={projectNameFieldCss} onClick={onTextClick}>
      <h5 className="projectName">{title}</h5>
    </Wrapper>
  );
}

export default EditableTextField;
