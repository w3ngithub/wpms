import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import Wrapper from "../Wrapper";
import "./style.css";

function EditableTextField({ title, oldTitle, onChange, save, style }) {
  const [isEditable, setIsEditable] = useState(false);

  const projectNameFieldCss = {
    padding: "6px 10px",
  };

  const onTextClick = () => {
    setIsEditable(true);
  };

  const onBlur = () => {
    setIsEditable(false);

    if (oldTitle === title) {
      return;
    }

    save();
  };

  useEffect(() => {
    if (isEditable) {
      const input = document.querySelector(".editInput");
      input.focus();
      input.select();
    }
  }, [isEditable]);

  const inputWidth = { width: (title?.length + 2) * 12 + "px" };

  return isEditable ? (
    <input
      className="editInput"
      type="text"
      value={title}
      style={{ ...inputWidth, ...style }}
      onChange={onChange}
      onBlur={onBlur}
    />
  ) : (
    <Wrapper customCss={projectNameFieldCss} onClick={onTextClick}>
      <h5 className="projectName" style={{ ...style }}>
        {title}
      </h5>
    </Wrapper>
  );
}

export default EditableTextField;
