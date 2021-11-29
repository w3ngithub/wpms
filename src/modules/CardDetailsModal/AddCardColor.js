import Circle from "@uiw/react-color-circle";
import CloseIcon from "@material-ui/icons/Close";
import { laneColors } from "../../constants/boardColors";

function AddCardColor({ handleCloseCardColor, handleSetCardColor }) {
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
          marginBottom: "5px",
          padding: "0 10px 10px 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <p>Card Color</p>
        <div onClick={handleCloseCardColor} style={{ cursor: "pointer" }}>
          <CloseIcon />
        </div>
      </div>
      <p>Select color</p>
      <Circle
        colors={laneColors}
        onChange={(color) => handleSetCardColor(color)}
      />
    </div>
  );
}

export default AddCardColor;
