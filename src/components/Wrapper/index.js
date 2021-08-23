import React from "react";
import "./style.css";

function Wrapper({ customCss = null, onClick, children }) {
  return (
    <div className="wrapper" style={customCss && customCss} onClick={onClick}>
      {children}
    </div>
  );
}

export default Wrapper;
