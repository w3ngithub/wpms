import { Button, TextField } from "@material-ui/core";
import { BsFillPeopleFill } from "@react-icons/all-files/bs/BsFillPeopleFill";
import CloseIcon from "@material-ui/icons/Close";

function ShareCard({ handleCloseSharePopOver }) {
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
        <p>Share and more...</p>
      </div>
      <div
        style={{
          position: "absolute",
          top: "7px",
          right: "9px",
          fontSize: "20px",
          cursor: "pointer",
        }}
        onClick={handleCloseSharePopOver}
      >
        <CloseIcon />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <strong>Share link to this card</strong>
        <BsFillPeopleFill />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <TextField
          id="outlined-basic"
          variant="outlined"
          fullWidth
          size="small"
          autoFocus
          value="https://trello.com/c/yhBgSWFC"
        />
        <Button
          type="button"
          color="primary"
          variant="contained"
          onClick={() => {
            navigator.clipboard.writeText("https://trello.com/c/yhBgSWFC");
          }}
        >
          Copy
        </Button>
      </div>
    </div>
  );
}

export default ShareCard;
