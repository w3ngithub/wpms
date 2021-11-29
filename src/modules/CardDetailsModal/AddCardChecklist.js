import { Button, TextField } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

function AddCardChecklist({ handleClosePopOver, handleSubmitCheckListTitle }) {
  return (
    <div
      style={{
        width: "300px",
        padding: "10px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <div
        style={{
          textAlign: "center",
          borderBottom: "2px solid rgba(0, 0, 0, 0.23)",
          marginBottom: "15px",
          padding: "0 10px 10px 0",
        }}
      >
        <p>Add Checklist</p>
      </div>
      <div
        style={{
          position: "absolute",
          top: "7px",
          right: "9px",
          fontSize: "20px",
          cursor: "pointer",
        }}
        onClick={handleClosePopOver}
      >
        <CloseIcon />
      </div>
      <p>Title</p>
      <form
        onSubmit={handleSubmitCheckListTitle}
        id="checklisttitle"
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
        <TextField
          id="outlined-basic"
          label="Checklist"
          variant="outlined"
          name="checklistTitle"
          fullWidth
        />
        <Button variant="contained" fullWidth color="primary" type="submit">
          Add
        </Button>
      </form>
    </div>
  );
}

export default AddCardChecklist;
