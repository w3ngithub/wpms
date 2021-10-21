import React, { useEffect, useState } from "react";
import ProjectDetailsNavbar from "../modules/ProjectDetailsNavbar";
import Board from "react-trello";
import { getSingleBoard, updateBoard } from "../api-config/boards";
import { useParams } from "react-router";
import Modal from "@material-ui/core/Modal";
import Circle from "@uiw/react-color-circle";

function SingleBoard() {
  const [data, setData] = useState({ lanes: [] });
  const { projectId, userName } = useParams();
  const [modelOpen, setModelOpen] = useState(false);
  const [laneData, setLaneData] = useState();

  const onConfirmCardDelete = (params) => {
    const doDelete = window.confirm("Are you sure?");
    if (doDelete) {
      params();
    }
  };

  const handleSetLaneColor = (color) => {
    updateBoard(
      projectId,
      "lanes",
      laneData.map((lane, i) => {
        if (i === laneData.length - 1) {
          return { ...lane, style: { backgroundColor: color.hex } };
        }
        return lane;
      })
    );
    setModelOpen(false);
    getSingleBoard(projectId).then((data) => {
      setData(data);
    });
  };

  const onDataChange = (updatedData) => {
    setLaneData(updatedData.lanes);
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
      <ProjectDetailsNavbar projectTitle={data?.title} user={userName} />

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
        editLaneTitle={true}
        onLaneAdd={(e) => {
          setModelOpen(true);
        }}
      />
      <Modal open={modelOpen} onClose={() => setModelOpen(false)}>
        <div>
          <Circle
            colors={[
              "#F44E3B",
              "#FE9200",
              "#FCDC00",
              "#DBDF00",
              "#F44E3B",
              "#FE9200",
              "#FCDC00",
              "#DBDF00",
              "#F44E3B",
              "#FE9200",
              "#FCDC00",
              "#DBDF00",
            ]}
            onChange={(color) => handleSetLaneColor(color)}
          />
        </div>
      </Modal>
    </div>
  );
}

export default React.memo(SingleBoard);
