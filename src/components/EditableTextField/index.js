import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import Wrapper from "../Wrapper";
import "./style.css";

function EditableTextField({
  title,
  oldTitle,
  onChange,
  save,
  style,
  minHeight,
  bigInput = false,
}) {
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
    <div>
      {bigInput ? (
        <textarea
          cols="30"
          rows="10"
          type="text"
          value={title}
          onChange={onChange}
          onBlur={onBlur}
          className="editInput"
          style={{
            fontSize: "14px",
            width: "100%",
            border: "2px solid #1f80d4",
          }}
        />
      ) : (
        <input
          className="editInput"
          type="text"
          value={title}
          style={{ ...inputWidth, ...style, minHeight }}
          onChange={onChange}
          onBlur={onBlur}
        />
      )}
    </div>
  ) : (
    <Wrapper customCss={projectNameFieldCss} onClick={onTextClick}>
      <h5 className="projectName" style={{ ...style, disple: "flex" }}>
        {title}
      </h5>
    </Wrapper>
  );
}

export default EditableTextField;
