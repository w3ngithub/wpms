import React from "react";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";

import "./style.css";

function BoardCard({
  onClick,
  removeCard,
  name,
  backgroundColor,
  user,
  loggedInUser,
}) {
  return (
    <div
      onClick={onClick}
      style={{ backgroundColor }}
      className="BoardCard_container"
    >
      <div
        className={
          user === loggedInUser
            ? "BoardCard_removeIcon"
            : "BoardIcon_removeIcon_not_user"
        }
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
