import React, { useState } from "react";
import CardContainer from "../CardContainer";
import "./style.css";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

function TaskBoard() {
  const [lists, setLists] = useState([
    {
      id: "todo",
      title: "TODO",
      cards: [
        { description: "design" },
        { description: "navbar" },
        { description: "start" },
        { description: "end" },
      ],
    },
    {
      id: "in progress",
      title: "In Progress",
      cards: [{ description: "hello" }, { description: "pariskrit" }],
    },
    {
      id: "code review",
      title: "In Code Review",
      cards: [
        { description: "integration" },
        { description: "test" },
        { description: "looking" },
        { description: "ok" },
      ],
    },
    {
      id: "Done",
      title: "Done",
      cards: [
        { description: "navbar design" },

        { description: "desing card components" },
      ],
    },
  ]);

  const handleOnDragEnd = (result) => {
    const { source, destination } = result;
    let newLists = [...lists];
    if (
      !result.destination ||
      (source.droppableId === destination.droppableId &&
        source.index === destination.index)
    )
      return;

    if (source.droppableId !== destination.droppableId) {
      newLists = newLists.reduce((accList, currentList, currentIndex) => {
        if (source.droppableId === currentList.id) {
          return [
            ...accList,
            {
              ...currentList,
              cards: [
                ...currentList.cards.filter((_, i) => i !== source.index),
              ],
            },
          ];
        }

        if (destination.droppableId === currentList.id) {
          const newCard = {
            ...newLists.find((list) => list.id === source.droppableId).cards[
              source.index
            ],
          };
          const cardList = [...currentList.cards];
          cardList.splice(destination.index, 0, newCard);

          return [
            ...accList,
            {
              ...currentList,
              cards: cardList,
            },
          ];
        }

        return [...accList, currentList];
      }, []);

      setLists(newLists);
    } else {
      const indexOfSelectedList = newLists.findIndex(
        (list) => list.id === source.droppableId
      );

      const listOfCards = [...newLists[indexOfSelectedList].cards];
      const [newCard] = listOfCards.splice(source.index, 1);

      listOfCards.splice(destination.index, 0, newCard);
      setLists(
        newLists.map((list, index) =>
          index === indexOfSelectedList
            ? { ...newLists[indexOfSelectedList], cards: listOfCards }
            : list
        )
      );
    }
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <div className="taskboard">
        {lists.map((list, index) => (
          <Droppable droppableId={list.id} key={list.id} index={index}>
            {(provided) => (
              <CardContainer
                providedDroppable={provided}
                list={list}
                containerIndex={index}
              />
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}

export default TaskBoard;
