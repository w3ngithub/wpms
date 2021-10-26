import React from "react";
import "./style.css";

function Wrapper({ customCss = null, onClick, children, ...rest }) {
  return (
    <div
      className="wrapper"
      style={customCss && customCss}
      onClick={onClick}
      {...rest}
    >
      {children}
    </div>
  );
}

export default Wrapper;
