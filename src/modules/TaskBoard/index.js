import React, { useState } from "react";
import CardContainer from "../CardContainer";
import "./style.css";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

function TaskBoard() {
  const [lists, setLists] = useState([
    {
      id: "todo",
      title: "TODO",
      cards: [{ description: "design" }, { description: "navbar" }],
    },
    {
      id: "in progress",
      title: "In Progress",
      cards: [{ description: "hello" }, { description: "pari" }],
    },
  ]);

  const handleOnDragEnd = (result) => {
    const reOrderedLists = [...lists[0].cards];
    let temp = null;
    temp = reOrderedLists[result.destination.index];
    reOrderedLists[result.destination.index] =
      reOrderedLists[result.source.index];
    reOrderedLists[result.source.index] = temp;
    setLists([
      ...lists.map((list, index) =>
        index === 0 ? { ...list, cards: reOrderedLists } : list
      ),
    ]);
  };
  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <div className="taskboard">
        {lists.map((list, index) => (
          <Droppable droppableId={list.id} key={list.id} index={index}>
            {(provided) => <CardContainer provided={provided} list={list} />}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}

export default TaskBoard;
