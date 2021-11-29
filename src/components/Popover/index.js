import { Avatar, makeStyles } from "@material-ui/core";
import React from "react";
import "./style.css";

const useStyles = makeStyles((theme) => ({
  Memberavatar: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    fontSize: "15px",
    fontWeight: "600",
    backgroundColor: "#E0E0DE",
    color: "black",
    cursor: "pointer",
  },
}));

function Popover({
  user,
  members,
  onClose,
  commentMemebers,
  handleAddMemberInComment,
  action = "Add",
}) {
  const classes = useStyles();
  return (
    <div className="popover_container">
      <div
        style={{
          textAlign: "center",
          borderBottom: "2px solid rgba(0, 0, 0, 0.23)",
          marginBottom: "15px",
          padding: "0 10px 10px 0",
        }}
      >
        <p>Mentions...</p>
      </div>
      <div
        style={{
          position: "absolute",
          top: "5px",
          right: "9px",
          fontSize: "20px",
          cursor: "pointer",
        }}
        onClick={onClose}
      >
        x
      </div>
      {commentMemebers.map((member) => (
        <div
          className="add_to_cart"
          style={{
            padding: "5px",
          }}
          onClick={() => handleAddMemberInComment(member, action)}
        >
          <Avatar alt="PM" className={classes.Memberavatar}>
            {member[0]}
          </Avatar>
          <span>{member}</span>
        </div>
      ))}
    </div>
  );
}

export default Popover;
