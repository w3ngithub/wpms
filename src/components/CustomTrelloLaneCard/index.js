import React from "react";
import { CgDetailsMore } from "@react-icons/all-files/cg/CgDetailsMore";
import { FaRegComment } from "@react-icons/all-files/fa/FaRegComment";
import { GrAttachment } from "@react-icons/all-files/gr/GrAttachment";
import { BsFolderCheck } from "@react-icons/all-files/bs/BsFolderCheck";
import CloseIcon from "@material-ui/icons/Close";
import "./style.css";

function CustomTrelloLaneCard(props) {
  const {
    style: { backgroundColor = "#FFFFFF" } = {},
    title,
    onClick,
    labels = [],
    comments = [],
    attachments = [],
    checklist = [],
    description = "",
    onDelete,
  } = props;
  return (
    <div
      className="card_container"
      style={{ backgroundColor: backgroundColor }}
      onClick={onClick}
    >
      <div
        onClick={(e) => {
          onDelete();
          e.stopPropagation();
        }}
        className="card_delete_container"
      >
        <CloseIcon style={{ fontSize: "16px" }} />
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "5px",
          marginBottom: "7px",
        }}
      >
        {labels.length !== 0 &&
          labels.map((label, i) => (
            <div
              style={{
                backgroundColor: label.color,
                borderRadius: "6px",
                padding: "2px 5px 2px 5px",
                boxShadow: " 0 1px 0 #091e4240",
                minWidth: "50px",
                height: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: "14px",
              }}
              key={i}
            >
              {label.name}
            </div>
          ))}
      </div>
      <p>{title}</p>
      <div className="card_footer">
        {description !== "" && (
          <div>
            <CgDetailsMore />
          </div>
        )}
        {comments.length !== 0 && (
          <div className="card_footer" style={{ gap: "5px" }}>
            <FaRegComment />
            <span>{comments.length}</span>
          </div>
        )}
        {attachments.length !== 0 && (
          <div className="card_footer" style={{ gap: "5px" }}>
            <GrAttachment />
            <span>{attachments.length}</span>
          </div>
        )}
        {checklist.length !== 0 && (
          <div className="card_footer" style={{ gap: "5px" }}>
            <BsFolderCheck />
            <span>{checklist.length}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomTrelloLaneCard;
