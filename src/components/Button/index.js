import React from "react";
import Wrapper from "../Wrapper";
import "./style.css";

function Button({ onClick, children, id, style }) {
  return (
    <Wrapper onClick={onClick} id={id} style={{ ...style }}>
      <p className="button">{children}</p>
    </Wrapper>
  );
}

export default Button;
