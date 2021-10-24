import React, { useEffect, useState } from "react";
import ProjectDetailsNavbar from "../modules/ProjectDetailsNavbar";
import Board from "react-trello";
import { updateBoard } from "../api-config/boards";
import { useParams } from "react-router";
import Modal from "@material-ui/core/Modal";
import Circle from "@uiw/react-color-circle";
import { fireStore } from "../firebase/config";

const labelColor = {
  backgroundColor: "#fff",
  position: "absolute",
  top: "40%",
  left: "30%",
  padding: "30px",
};

function SingleBoard() {
  const [data, setData] = useState({ lanes: [] });
  const [dataTopass, setDatatoPass] = useState(null);
  const { projectId, userName } = useParams();
  const [modelOpen, setModelOpen] = useState(false);

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
      data?.lanes?.map((lane, i) => {
        if (i === data.lanes.length - 1) {
          return { ...lane, style: { backgroundColor: color.hex } };
        }
        return lane;
      })
    );
    setModelOpen(false);
  };

  const onDataChange = (updatedData) => {
    setData(updatedData);
    updateBoard(projectId, "lanes", updatedData.lanes);
  };

  useEffect(() => {
    fireStore
      .collection("boards")
      .doc(projectId)
      .onSnapshot((doc) => {
        setData(doc.data());
        setDatatoPass(doc.data());
      });
  }, [projectId]);
  console.log(data);

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
      <ProjectDetailsNavbar
        projectTitle={dataTopass?.title}
        user={userName}
        projectId={projectId}
        members={dataTopass.members || []}
        boardUser={dataTopass.user}
      />

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
        <div style={labelColor}>
          <h2>Add Label </h2>
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
