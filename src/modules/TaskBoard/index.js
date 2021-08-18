import React from "react";
import Board from "react-trello";

const data = {
  lanes: [
    {
      cards: [
        {
          description: "2 Gallons of milk at the Deli store",
          label: "15 mins",
          title: "Buy Milk",
          id: 1,
        },
        {
          description: "2 Gallons of milk at the Deli store",
          label: "15 mins",
          title: "Buy Milk",
          id: 2,
        },
        {
          description: "2 Gallons of milk at the Deli store",
          label: "15 mins",
          title: "Buy Milk",
          id: 3,
        },
      ],
      currentPage: 1,
      disallowAddingCard: true,
      id: "PLANNED",
      label: "20/70",
      style: {
        width: 280,
      },
      title: "Disallowed adding card",
    },
  ],
};
function TaskBoard() {
  return (
    <div>
      <Board data={data} />
    </div>
  );
}

export default TaskBoard;
