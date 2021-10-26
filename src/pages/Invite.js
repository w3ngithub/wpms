import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import { Button } from "@material-ui/core";
import { useHistory, useParams } from "react-router";
import { addNewMemberToBoard } from "../api-config/boards";

function Invite() {
  const { name, email } = JSON.parse(localStorage.getItem("user"));
  const { id } = useParams();
  const { push } = useHistory();
  const handleJoinBoard = () => {
    addNewMemberToBoard(id, name).then(push(`/${name}/${id}`));
  };
  return (
    <div
      style={{
        paddingTop: "100px",
        textAlign: "center",
      }}
    >
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <h3>You have been invited to join the board!</h3>
        <Button variant="contained" color="primary" onClick={handleJoinBoard}>
          Join Board
        </Button>
      </Container>
    </div>
  );
}

export default Invite;
