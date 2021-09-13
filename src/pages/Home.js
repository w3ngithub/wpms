import React, { useEffect, useState } from "react";
import Navbar from "../modules/Navbar";
import ProjectDetailsNavbar from "../modules/ProjectDetailsNavbar";
import Board from "react-trello";
import { getSingleBoard, updateBoard } from "../api-config/boards";

function Home() {
  const [data, setData] = useState({ lanes: [] });

  const onConfirmCardDelete = (params) => {
    const doDelete = window.confirm("Are you sure?");
    if (doDelete) {
      params();
    }
  };

  const onDataChange = (updatedData) => {
    console.log(data);

    if (data.id) {
      updateBoard(data.id, updatedData);
    }
  };

  useEffect(() => {
    getSingleBoard("pariskrit").then((data) => {
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
      <ProjectDetailsNavbar projectTitle={data?.data?.title} />

      <Board
        data={{ lanes: data?.data?.lanes || [] }}
        draggable
        canAddLanes
        addCardTitle="Add Item"
        style={{ backgroundColor: "transparent", maxHeight: "540px" }}
        editable
        onBeforeCardDelete={onConfirmCardDelete}
        onDataChange={onDataChange}
        collapsibleLanes={true}
      />
    </div>
  );
}

export default Home;
