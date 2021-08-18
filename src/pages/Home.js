import React from "react";
import Navbar from "../modules/Navbar";
import ProjectDetailsNavbar from "../modules/ProjectDetailsNavbar";
import TaskBoard from "../modules/TaskBoard";

function Home() {
  return (
    <>
      <Navbar />
      <ProjectDetailsNavbar />
      <TaskBoard />
    </>
  );
}

export default Home;
