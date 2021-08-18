import React from "react";
import Card from "../../components/Card";
import "./style.css";
import { Draggable } from "react-beautiful-dnd";

function CardContainer({ provided, list }) {
  const { title, cards } = list;
  return (
    <div
      className="container"
      {...provided.droppableProps}
      ref={provided.innerRef}
    >
      <h4>{title}</h4>
      {cards.map((card, index) => (
        <Draggable
          key={card.description}
          draggableId={card.description}
          index={index}
        >
          {(provided) => (
            <Card
              key={card}
              provided={provided}
              description={card.description}
            />
          )}
        </Draggable>
      ))}
      {provided.placeholder}
    </div>
  );
}

export default CardContainer;
