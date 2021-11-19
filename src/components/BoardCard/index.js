import React from "react";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";

import "./style.css";

function BoardCard({ onClick, removeCard, name, backgroundColor }) {
  return (
    <div
      onClick={onClick}
      style={{ backgroundColor }}
      className="BoardCard_container"
    >
      <div
        className="BoardCard_removeIcon"
        onClick={(e) => {
          removeCard();
          e.stopPropagation();
        }}
      >
        <DeleteOutlinedIcon style={{ fontSize: "14px" }} />
      </div>
      <span>{name}</span>
    </div>
  );
}

export default BoardCard;
