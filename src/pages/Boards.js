import React from "react";
import BoardsContainer from "../components/BoardsContainer";

function Boards({ openCreateBoardModal, searchBoard }) {
  return (
    <>
      <BoardsContainer
        openCreateBoardModal={openCreateBoardModal}
        searchBoard={searchBoard}
      />
    </>
  );
}

export default Boards;
