import React, { useState } from "react";
import AddIcon from "@material-ui/icons/Add";
import "./style.css";
import { Button, TextField } from "@material-ui/core";

function AddCardInput() {
  const [showTextField, setShowTextField] = useState(false);

  const handleShowTextField = () => setShowTextField(true);

  return showTextField ? (
    <div className="cardtextfield">
      <TextField
        id="outlined-primary"
        label="Enter a title for this card..."
        variant="outlined"
        color="primary"
        multiline
        rows={4}
        fullWidth
        className="textfield"
      />

      <Button
        variant="contained"
        color="primary"
        size="small"
        className="button"
      >
        Add card
      </Button>
    </div>
  ) : (
    <div className="cardinput" onClick={handleShowTextField}>
      <AddIcon className="icon" />
      <p>Add a card</p>
    </div>
  );
}

export default AddCardInput;
