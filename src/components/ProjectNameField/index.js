import React from "react";
import Wrapper from "../Wrapper";
import "./style.css";

function ProjectNameField({ customCss, title, isBold = false, rest }) {
  return (
    <Wrapper customCss={customCss}>
      {isBold ? (
        <h5 className="projectName">{title}</h5>
      ) : (
        <p className="projectName">{title}</p>
      )}

      {/* <input {...props} value="Project 2" className="inputfield" /> */}
    </Wrapper>
  );
}

export default ProjectNameField;
