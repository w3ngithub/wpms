import React, { useEffect, useState } from "react";
import { Container, Divider } from "@material-ui/core";
import {
  getUsersBoards,
  getUsersFromFeatureBoards,
} from "../../api-config/boards";
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
  paperCreateBoard: {
    height: 100,
    width: 150,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    background: "#FAFBFC",
    transition: "0.2s",
    "&:hover": {
      opacity: "0.6",
      background: "#97a0af",
    },
    color: "#172b4d",
  },
  control: {
    padding: theme.spacing(2),
  },
}));

function BoardsContainer({ openCreateBoardModal, searchBoard }) {
  const [listOfBoards, setListOfBoards] = useState([]);
  const [listOfFavouriteBoards, setListOfFavouriteBoards] = useState([]);
  const [searchListOfBoard, setSearchListOfBoards] = useState([]);
  const classes = useStyles();
  const history = useHistory();

  const { name } = JSON.parse(localStorage.getItem("user"));

  const fetchBoards = async () => {
    const result = await Promise.all([
      getUsersBoards(name),
      getUsersFromFeatureBoards("members", name),
    ]);
    const favouriteBoards = await getUsersFromFeatureBoards("favourite", name);
    setListOfBoards([...result.flat()]);
    setListOfFavouriteBoards(favouriteBoards);
  };

  useEffect(() => {
    setSearchListOfBoards(
      listOfBoards.filter((board) =>
        board.data.title.toUpperCase().includes(searchBoard.toUpperCase())
      )
    );
  }, [searchBoard, listOfBoards]);

  useEffect(() => {
    fetchBoards();
  }, []);

  return (
    <Container maxWidth="sm" className={classes.container}>
      <h1 className="boards__header">Boards</h1>
      <Divider />
      {searchBoard ? (
        <Grid container className={classes.gridRoot}>
          <Grid container justifyContent="flex-start" spacing={4}>
            {searchListOfBoard.map((value) => (
              <Grid key={value.id} item>
                <Paper
                  className={classes.paper}
                  elevation={0}
                  variant="outlined"
                  onClick={() => history.push(`/${name}/${value.id}`)}
                >
                  <div className="paper">
                    <p className="title">{value.data.title}</p>
                  </div>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Grid>
      ) : (
        <Grid container className={classes.gridRoot}>
          {listOfFavouriteBoards.length !== 0 && (
            <>
              <h2 className="boards__header">Your Favourites</h2>
              <Grid container justifyContent="flex-start" spacing={4}>
                {listOfFavouriteBoards.map((value) => (
                  <Grid key={value.id} item>
                    <Paper
                      className={classes.paper}
                      elevation={0}
                      variant="outlined"
                      onClick={() => history.push(`/${name}/${value.id}`)}
                    >
                      <div className="paper">
                        <p className="title">{value.data.title}</p>
                      </div>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </>
          )}
          <h2 className="boards__header">Your WorkSpaces</h2>
          <Grid container justifyContent="flex-start" spacing={4}>
            {listOfBoards.map((value) => (
              <Grid key={value.id} item>
                <Paper
                  className={classes.paper}
                  elevation={0}
                  variant="outlined"
                  onClick={() => history.push(`/${name}/${value.id}`)}
                >
                  <div className="paper">
                    <p className="title">{value.data.title}</p>
                  </div>
                </Paper>
              </Grid>
            ))}
            <Grid key={"add"} item>
              <Paper
                className={classes.paperCreateBoard}
                elevation={0}
                variant="outlined"
                onClick={openCreateBoardModal}
              >
                <div className="paper">
                  <p className="title">Create New Board</p>
                </div>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      )}
    </Container>
  );
}

export default React.memo(BoardsContainer);
