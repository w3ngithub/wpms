import React from "react";
import Wrapper from "../Wrapper";
import SearchIcon from "@material-ui/icons/Search";
import "./style.css";
import { grey } from "@material-ui/core/colors";

function InputField(props) {
  return (
    <Wrapper>
      <input {...props} className="input" placeholder="Enter text.." />
      <SearchIcon style={{ color: grey[50] }} />
    </Wrapper>
  );
}

export default InputField;
