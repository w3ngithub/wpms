import React from "react";
import AddIcon from "@material-ui/icons/Add";
import "./style.css";

function AddCardInput() {
  return (
    <div className="cardinput">
      <AddIcon className="icon" />
      <p>Add a card</p>
    </div>
  );
}

export default AddCardInput;
