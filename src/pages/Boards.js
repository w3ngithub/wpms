import React from "react";
import BoardsContainer from "../components/BoardsContainer";

function Boards({ openCreateBoardModal, searchBoard, setSearchBoard }) {
  return (
    <>
      <BoardsContainer
        openCreateBoardModal={openCreateBoardModal}
        searchBoard={searchBoard}
        setSearchBoard={setSearchBoard}
      />
    </>
  );
}

export default Boards;
