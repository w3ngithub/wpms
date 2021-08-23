import React from "react";
import Wrapper from "../Wrapper";
import "./style.css";

function Button({ onClick, children }) {
  return (
    <Wrapper onClick={onClick}>
      <p className="button">{children}</p>
    </Wrapper>
  );
}

export default Button;
