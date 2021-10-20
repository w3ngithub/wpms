import React, { useEffect, useState } from "react";
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
    updateBoard(projectId, "lanes", updatedData.lanes);
  };

  useEffect(() => {
    getSingleBoard(projectId).then((data) => {
      setData(data);
    });
  }, [projectId]);
  return (
    <div
      style={{
        // backgroundImage: `url(${img})`,
        backgroundColor: "rgb(97 102 117)",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
        paddingTop: "45px",
      }}
    >
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

export default React.memo(SingleBoard);
