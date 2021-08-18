import React from "react";
import "./style.css";

function Wrapper({ customCss = null, children }) {
  return (
    <div className="wrapper" style={customCss && customCss}>
      {children}
    </div>
  );
}

export default Wrapper;
