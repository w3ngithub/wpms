import React from "react";
import Navbar from "../modules/Navbar";
import BoardsContainer from "../components/BoardsContainer";

function Boards({ openCreateBoardModal }) {
  return (
    <>
      <BoardsContainer openCreateBoardModal={openCreateBoardModal} />
    </>
  );
}

export default Boards;
