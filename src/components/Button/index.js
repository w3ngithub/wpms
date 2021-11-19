import React from "react";
import Wrapper from "../Wrapper";
import "./style.css";

function Button({ onClick, children, id }) {
  return (
    <Wrapper onClick={onClick} id={id}>
      <p className="button">{children}</p>
    </Wrapper>
  );
}

export default Button;
