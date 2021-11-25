import React, { useCallback, useEffect, useState } from "react";
import { Container, Divider } from "@material-ui/core";
import {
  getUsersBoards,
  getUsersFromFeatureBoards,
  removeBoard,
} from "../../api-config/boards";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import "./style.css";
import { useHistory } from "react-router";
import Loader from "../Loader";
import BoardCard from "../BoardCard";

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: "70px",
    textAlign: "center",
  },
  gridRoot: {
    flexGrow: 1,
    margin: "30px 0",
    marginBottom: "30px",
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
  const [loading, setLoading] = useState(false);
  const classes = useStyles();
  const history = useHistory();

  const { name } = JSON.parse(localStorage.getItem("user"));

  const fetchBoards = useCallback(async () => {
    setLoading(true);
    const result = await Promise.all([
      getUsersBoards(name),
      getUsersFromFeatureBoards("members", name),
    ]);
    const favouriteBoards = await getUsersFromFeatureBoards("favourite", name);
    setListOfBoards([...result.flat()]);
    setListOfFavouriteBoards(favouriteBoards);
    setLoading(false);
  }, [name]);

  const handleRemoveBoard = async (boardId) => {
    await removeBoard(boardId);
    const removeBoardFormList = (board) => board.id !== boardId;
    setListOfFavouriteBoards(listOfFavouriteBoards.filter(removeBoardFormList));
    setListOfBoards(listOfBoards.filter(removeBoardFormList));
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
  }, [fetchBoards]);

  return (
    <Container maxWidth="sm" className={classes.container}>
      <h1 className="boards__header">Boards</h1>
      <Divider />
      {loading ? (
        <Loader />
      ) : (
        <div>
          {searchBoard ? (
            <Grid container className={classes.gridRoot}>
              <Grid container justifyContent="center" spacing={4}>
                {searchListOfBoard.length ? (
                  searchListOfBoard.map((value) => (
                    <Grid key={value.id} item>
                      <BoardCard
                        name={value.data.title}
                        backgroundColor={value?.data?.boardColor}
                        onClick={() => history.push(`/${name}/${value.id}`)}
                        removeCard={() => handleRemoveBoard(value.id)}
                        user={value.data.user}
                        loggedInUser={name}
                      />
                    </Grid>
                  ))
                ) : (
                  <h4>No boards found</h4>
                )}
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
                        <BoardCard
                          name={value.data.title}
                          backgroundColor={value?.data?.boardColor}
                          onClick={() => history.push(`/${name}/${value.id}`)}
                          removeCard={() => handleRemoveBoard(value.id)}
                          user={value.data.user}
                          loggedInUser={name}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </>
              )}
              <h2 className="boards__header" style={{ marginTop: "25px" }}>
                Your WorkSpaces
              </h2>
              <Grid container justifyContent="flex-start" spacing={4}>
                {listOfBoards.map((value) => (
                  <Grid key={value.id} item>
                    <BoardCard
                      onClick={() => history.push(`/${name}/${value.id}`)}
                      name={value.data.title}
                      backgroundColor={value?.data?.boardColor}
                      removeCard={() => handleRemoveBoard(value.id)}
                      user={value.data.user}
                      loggedInUser={name}
                    />
                  </Grid>
                ))}
                <Grid key={"add"} item>
                  <Paper
                    onClick={openCreateBoardModal}
                    className={classes.paperCreateBoard}
                    variant="outlined"
                  >
                    <div className="paper">
                      <p className="title">Create New Board</p>
                    </div>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
          )}
        </div>
      )}
    </Container>
  );
}

export default React.memo(BoardsContainer);
