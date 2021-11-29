import Circle from "@uiw/react-color-circle";
import CloseIcon from "@material-ui/icons/Close";
import { Button, TextField } from "@material-ui/core";
import { labelColors } from "../../constants/boardColors";

function AddCardLabels({
  handleCloseLabelPopOver,
  newLabel,
  newlabelColor,
  setLabelColor,
  handleSubmitNewLabel,
  labelToSearch,
  setLabelToSearch,
  boardLabels,
  filteredBoardLabels,
  handleAddLabelFromBoardLabel,
  setNewLabel,
}) {
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
          borderBottom: "2px solid rgba(0, 0, 0, 0.23)",
          marginBottom: "15px",
          padding: "0 10px 10px 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <p>Labels</p>
        <div onClick={handleCloseLabelPopOver} style={{ cursor: "pointer" }}>
          <CloseIcon />
        </div>
      </div>

      {newLabel ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "15px",
          }}
        >
          <form onSubmit={handleSubmitNewLabel}>
            <div>
              <p>Name</p>
              <TextField
                id="outlined-basic"
                variant="outlined"
                fullWidth
                name="newLabelName"
                size="small"
              />
            </div>
            <div
              style={{
                marginTop: "10px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <p>Select a color</p>
              <Circle
                color={newlabelColor?.hex}
                colors={labelColors}
                onChange={(color) => setLabelColor(color)}
              />
              <Button
                variant="contained"
                fullWidth
                color="primary"
                type="submit"
              >
                Create
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <>
          <TextField
            id="outlined-basic"
            variant="outlined"
            label="Search labels"
            fullWidth
            name="searchLabel"
            value={labelToSearch}
            onChange={(e) => setLabelToSearch(e.target.value)}
          />
          <p>Labels</p>
          {boardLabels &&
            boardLabels.length &&
            filteredBoardLabels?.map((label, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: label.color,
                  borderRadius: "5px",
                  padding: "10px",
                  cursor: "pointer",
                  color: "#fff",
                }}
                onClick={() => handleAddLabelFromBoardLabel(label)}
              >
                {label.name}
              </div>
            ))}
          <div
            className="add_to_cart"
            style={{ justifyContent: "center" }}
            onClick={() => setNewLabel(true)}
          >
            Create new label
          </div>
        </>
      )}
    </div>
  );
}

export default AddCardLabels;
