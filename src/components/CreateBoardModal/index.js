import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { createBoard } from "../../api-config/boards";
import LinearProgress from "@material-ui/core/LinearProgress";
import { useHistory } from "react-router";
import { boardColor } from "../../constants/boardColors";

function CreateBoardModal({ open, handleClose }) {
  const [title, setTitle] = useState("");
  const [isLoading, setLoading] = useState(false);
  const { name } = JSON.parse(localStorage.getItem("user"));
  const history = useHistory();

  const onInputChange = (e) => setTitle(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title === "") {
      return;
    }

    setLoading(true);
    const boardBackColor =
      boardColor[Math.floor(Math.random() * boardColor.length)];

    createBoard(title, name, boardBackColor).then((res) => {
      res.get().then((data) => {
        handleClose();
        setLoading(false);

        history.push(`/${name}/${res.id}`);
      });
    });
  };

  useEffect(() => {
    return () => {
      setTitle("");
      setLoading(false);
    };
  }, []);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
      fullWidth={true}
      maxWidth="sm"
    >
      <DialogTitle id="form-dialog-title">Create Board</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Board Title"
          type="text"
          value={title}
          onChange={onInputChange}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Create Board
        </Button>
      </DialogActions>
      {isLoading && <LinearProgress />}
    </Dialog>
  );
}

export default CreateBoardModal;
