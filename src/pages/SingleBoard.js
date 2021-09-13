import React, { useEffect, useState } from "react";
import Navbar from "../modules/Navbar";
import ProjectDetailsNavbar from "../modules/ProjectDetailsNavbar";
import Board from "react-trello";
import { getSingleBoard, updateBoard } from "../api-config/boards";
import { useParams } from "react-router";

function SingleBoard() {
  const [data, setData] = useState({ lanes: [] });
  const { projectId } = useParams();

  const onConfirmCardDelete = (params) => {
    const doDelete = window.confirm("Are you sure?");
    if (doDelete) {
      params();
    }
  };

  const onDataChange = (updatedData) => {
    updateBoard(projectId, updatedData);
  };

  useEffect(() => {
    getSingleBoard(projectId).then((data) => {
      setData(data);
    });
  }, []);
  console.log(data);
  return (
    <div
      style={{
        // backgroundImage: `url(${img})`,
        backgroundColor: "rgb(97 102 117)",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <Navbar />
      <ProjectDetailsNavbar projectTitle={data?.title} />

      <Board
        data={{ lanes: data?.lanes || [] }}
        draggable
        canAddLanes
        addCardTitle="Add Item"
        style={{ backgroundColor: "transparent", maxHeight: "546px" }}
        editable
        onBeforeCardDelete={onConfirmCardDelete}
        onDataChange={onDataChange}
        collapsibleLanes={true}
      />
    </div>
  );
}

export default SingleBoard;
