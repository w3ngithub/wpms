import React, { useState } from "react";
import Wrapper from "../Wrapper";
import SearchIcon from "@material-ui/icons/Search";
import "./style.css";
import { grey } from "@material-ui/core/colors";

function SearchInputField(props) {
  return (
    <Wrapper>
      <div className="search__container">
        <input {...props} className="input" placeholder="Search" />
        <SearchIcon style={{ color: grey[50] }} />
        {/* {showInputField ? (
          // <input {...props} className="input" placeholder="Enter text.." />
          <Input
            placeholder="Enter text..."
            endAdornment={
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            }
          />
        ) : (
          <>
            <p>Enter text...</p>
            <SearchIcon style={{ color: grey[50] }} />
          </>
        )} */}
      </div>
    </Wrapper>
  );
}

export default SearchInputField;
