import React from "react";
import "./style.css";

function Card({ provided, description }) {
  return (
    <div
      className="card"
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
    >
      <p>{description}</p>
    </div>
  );
}

export default Card;
