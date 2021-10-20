import React, { useEffect, useState } from "react";
import { Container, Divider } from "@material-ui/core";
import { getUsersBoards } from "../../api-config/boards";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import "./style.css";
import { useHistory } from "react-router";

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: "50px",
  },
  gridRoot: {
    flexGrow: 1,
    margin: "30px 0",
  },
  paper: {
    height: 100,
    width: 150,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    background: "gray",
    transition: "0.2s",
    "&:hover": {
      opacity: "0.5",
    },
    color: "white",
  },
  control: {
    padding: theme.spacing(2),
  },
}));

function BoardsContainer() {
  const [listOfBoards, setListOfBoards] = useState([]);
  const classes = useStyles();
  const history = useHistory();

  const { name } = JSON.parse(localStorage.getItem("user"));

  const fetchBoards = async () => {
    const result = await getUsersBoards(name);
    console.log(result);
    setListOfBoards(result);
  };

  useEffect(() => {
    fetchBoards();
    // setListOfBoards([
    //   { id: 1, data: { title: "Project One" } },
    //   { id: 2, data: { title: "Project One" } },
    //   { id: 3, data: { title: "Project One" } },
    // ]);
  }, []);
  console.log("boards rerender");
  return (
    <Container maxWidth="sm" className={classes.container}>
      <h1 className="boards__header">Boards</h1>
      <Divider />
      <Grid container className={classes.gridRoot}>
        <Grid container justifyContent="flex-start" spacing={4}>
          {listOfBoards.map((value) => (
            <Grid key={value.id} item>
              <Paper
                className={classes.paper}
                elevation={0}
                variant="outlined"
                onClick={() =>
                  history.push(`/${name}/${value.id}/${value.data.title}`)
                }
              >
                <div className="paper">
                  <p className="title">{value.data.title}</p>
                </div>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Container>
  );
}

export default React.memo(BoardsContainer);
