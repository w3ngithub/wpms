import React from "react";
import Card from "../../components/Card";
import "./style.css";
import { Draggable } from "react-beautiful-dnd";
import AddCardInput from "../../components/AddCardInput";

function CardContainer({ providedDroppable, list, containerIndex }) {
  const { id, title, cards } = list;
  // return (
  //   <Draggable draggableId={id} index={containerIndex}>
  //     {(provided) => (
  //       <div>
  //         <div
  //           className="container"
  //           {...providedDroppable.droppableProps}
  //           ref={providedDroppable.innerRef}
  //         >
  //           <h4>{title}</h4>
  //           {cards.map((card, index) => (
  //             <Draggable
  //               key={card.description}
  //               draggableId={card.description}
  //               index={index}
  //             >
  //               {(provided) => (
  //                 <Card
  //                   key={card}
  //                   provided={provided}
  //                   description={card.description}
  //                 />
  //               )}
  //             </Draggable>
  //           ))}
  //           {providedDroppable.placeholder}
  //         </div>
  //       </div>
  //     )}
  //   </Draggable>
  // );

  return (
    <div
      className="container"
      {...providedDroppable.droppableProps}
      ref={providedDroppable.innerRef}
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
      {providedDroppable.placeholder}
      <AddCardInput />
    </div>
  );
}

export default CardContainer;
