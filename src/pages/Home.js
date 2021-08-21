import React, { useState } from "react";
import Navbar from "../modules/Navbar";
import ProjectDetailsNavbar from "../modules/ProjectDetailsNavbar";
import TaskBoard from "../modules/TaskBoard";
import Board from "react-trello";

const data = {
  lanes: [
    {
      id: "todo",
      title: "TODO",

      cards: [
        {
          id: "Milk",
          title: "Buy milk",
          label: "15 mins",
          description: "2 Gallons of milk at the Deli store",
        },
        {
          id: "Plan2",
          title: "Dispose Garbage",
          label: "10 mins",
          description: "Sort out recyclable and waste as needed",
        },
      ],
    },
    {
      id: "in progress",
      title: "In Progress",
      cards: [
        {
          id: "Plan3",
          title: "Write Blog",
          label: "30 mins",
          description: "Can AI make memes?",
        },
        {
          id: "Plan4",
          title: "Pay Rent",
          label: "5 mins",
          description: "Transfer to bank account",
        },
      ],
    },
  ],
};
function Home() {
  const [lists, setLists] = useState({
    lanes: [
      {
        id: "todo",
        title: "TODO",

        cards: [
          {
            id: "Milk",
            title: "Buy milk",
            label: "15 mins",
            description: "2 Gallons of milk at the Deli store",
          },
          {
            id: "Plan2",
            title: "Dispose Garbage",
            label: "10 mins",
            description: "Sort out recyclable and waste as needed",
          },
        ],
      },
      {
        id: "in progress",
        title: "In Progress",
        cards: [
          {
            id: "Plan3",
            title: "Write Blog",
            label: "30 mins",
            description: "Can AI make memes?",
          },
          {
            id: "Plan4",
            title: "Pay Rent",
            label: "5 mins",
            description: "Transfer to bank account",
          },
        ],
      },
    ],
  });

  const handleDragEnd = (
    cardId,
    sourceLaneId,
    targetLaneId,
    position,
    cardDetails
  ) => {
    let newLists = [...lists.lanes];

    //remove the card from the source list
    const indexOfSourceList = newLists.findIndex(
      (list) => list.id === sourceLaneId
    );

    const listOfSourceCards = [...newLists[indexOfSourceList].cards];
    listOfSourceCards.splice(
      listOfSourceCards.findIndex((card) => card.id === cardId),
      1
    );

    if (sourceLaneId === targetLaneId) {
      // for drag and drop card in same lane
      listOfSourceCards.splice(position, 0, cardDetails);
      setLists({
        lanes: newLists.map((list, index) =>
          index === indexOfSourceList
            ? { ...newLists[indexOfSourceList], cards: listOfSourceCards }
            : list
        ),
      });
    } else {
      // for drag and drop card in different lane
      const indexOfDestinationList = newLists.findIndex(
        (list) => list.id === targetLaneId
      );
      const listOfDestinationCards = [
        ...newLists[indexOfDestinationList].cards,
      ];
      listOfDestinationCards.splice(position, 0, cardDetails);

      setLists({
        lanes: newLists.map((list, index) =>
          index === indexOfDestinationList
            ? {
                ...newLists[indexOfDestinationList],
                cards: listOfDestinationCards,
              }
            : index === indexOfSourceList
            ? { ...newLists[indexOfSourceList], cards: listOfSourceCards }
            : list
        ),
      });
    }
  };

  const onCardAdd = (card, laneId) => {
    const newList = [...lists.lanes];

    setLists({
      lanes: newList.map((list) =>
        list.id === laneId ? { ...list, cards: [...list.cards, card] } : list
      ),
    });
  };

  const onConfirmCardDelete = (params) => {
    const doDelete = window.confirm("Are you sure?");
    if (doDelete) {
      params();
    }
  };

  const onCardDelete = (cardId, laneId) => {
    setLists({
      lanes: [
        ...lists.lanes.map((list) =>
          list.id === laneId
            ? {
                ...list,
                cards: [...list.cards.filter((card) => card.id !== cardId)],
              }
            : list
        ),
      ],
    });
  };

  const handleLaneDragEnd = (removedIndex, addedIndex, payload) => {
    const newLanes = [...lists.lanes];
    newLanes.splice(removedIndex, 1);
    newLanes.splice(addedIndex, 0, {
      id: payload.id,
      title: payload.title,
      cards: payload.cards,
    });
    setLists({ lanes: newLanes });
  };

  const onLaneAdd = (params) => {
    setLists({ lanes: [...lists.lanes, { ...params, cards: [] }] });
  };

  const onLaneDelete = (laneId) => {
    setLists({ lanes: [...lists.lanes.filter((lane) => lane.id !== laneId)] });
  };

  console.log(lists);
  return (
    <>
      <Navbar />
      <ProjectDetailsNavbar />
      {/* <TaskBoard /> */}
      <Board
        data={data}
        draggable
        canAddLanes
        addCardTitle="Add Item"
        style={{ backgroundColor: "transparent" }}
        editable
        handleDragEnd={handleDragEnd}
        handleLaneDragEnd={handleLaneDragEnd}
        onCardAdd={onCardAdd}
        onBeforeCardDelete={onConfirmCardDelete}
        onCardDelete={onCardDelete}
        onLaneAdd={onLaneAdd}
        onLaneDelete={onLaneDelete}
      />
    </>
  );
}

export default Home;
