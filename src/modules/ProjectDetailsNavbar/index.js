import React, { useState } from "react";
import Icon from "../../components/Icon";
import ProjectNameField from "../../components/ProjectNameField";
import "./style.css";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import {
  Divider,
  Popover,
  TextField,
  Button as MuiButton,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Avatar } from "@material-ui/core";
import Button from "../../components/Button";
import MenuList from "../../components/MenuList";
import EditableTextField from "../../components/EditableTextField";
import { useEffect } from "react";
import { updateBoard } from "../../api-config/boards";
import { useParams } from "react-router";
import InsertInvitationIcon from "@material-ui/icons/InsertInvitation";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "14px",
    borderStyle: "inset",
    borderWidth: "1px",
    borderColor: "white",
  },
  avatar: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    fontSize: "15px",
    fontWeight: "600",
    backgroundColor: "#f3f1f1",
    color: "black",
  },
}));

function ProjectDetailsNavbar({ projectTitle, user, members, boardUser }) {
  console.log(user, members, boardUser);
  const classes = useStyles();
  const [openMenu, setOpenMenu] = useState(null);
  const [editedTitle, setEditedTitle] = useState(projectTitle);
  const [createLink, setCreateLink] = useState(false);
  const [inviteLink, setInviteLink] = useState("");
  const { projectId } = useParams();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClickPopOver = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopOver = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleOpenMenu = (event) => {
    setOpenMenu(event.currentTarget);
  };

  const handleClose = () => {
    setOpenMenu(null);
  };

  const onEditedTitleChange = (e) => setEditedTitle(e.target.value);

  const onSaveEditedTitle = () => {
    updateBoard(projectId, "title", editedTitle);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
  };

  const handleCreateLink = () => {
    setCreateLink(!createLink);
  };

  const projectNameFieldCss = {
    padding: "6px 10px",
  };

  useEffect(() => {
    if (createLink) {
      setInviteLink(`http://localhost:3000/invite/${projectId}`);
    }
  }, [createLink, projectId]);

  useEffect(() => {
    if (projectTitle) {
      setEditedTitle(projectTitle);
    }
  }, [projectTitle]);
  return (
    <div className="projectdetailsnavbar">
      <div className="projectdetailsnavbar__front">
        <EditableTextField
          oldTitle={projectTitle}
          title={editedTitle}
          onChange={onEditedTitleChange}
          save={onSaveEditedTitle}
        />

        <Icon Icon={StarBorderIcon} />
        <Divider orientation="horizontal" classes={{ root: classes.root }} />
        <ProjectNameField
          title={`${user}'s workspace`}
          customCss={projectNameFieldCss}
        />
        <Divider orientation="horizontal" classes={{ root: classes.root }} />
        {[{ name: boardUser }, ...members].map(({ name }) => (
          <Avatar alt={name} className={classes.avatar}>
            {name[0].toUpperCase()}
          </Avatar>
        ))}

        <Button
          aria-describedby={id}
          variant="contained"
          onClick={handleClickPopOver}
        >
          Invite
        </Button>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClosePopOver}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <div style={{ width: "300px", padding: "10px" }}>
            <div
              style={{
                textAlign: "center",
                borderBottom: "2px solid rgba(0, 0, 0, 0.23)",
                marginBottom: "15px",
                padding: "0 10px 10px 0",
              }}
            >
              <p>Invite to board</p>
            </div>
            <div
              style={{
                position: "absolute",
                top: "5px",
                right: "9px",
                fontSize: "20px",
                cursor: "pointer",
              }}
              onClick={handleClosePopOver}
            >
              x
            </div>
            <TextField
              id="outlined-basic"
              label="Email Address"
              variant="outlined"
              fullWidth
            />
            <div
              style={{
                align: "center",
                display: "flex",
                justifyContent: "space-between",
                marginTop: "20px",
              }}
            >
              <div style={{ align: "center", display: "flex" }}>
                <InsertInvitationIcon />
                <p> Invite with Link</p>
              </div>
              <div
                style={{
                  color: "#0079bf",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
                onClick={handleCreateLink}
              >
                Create link
              </div>
            </div>
            <div style={{ fontSize: "12px", color: "#5e6c84" }}>
              Anyone with link can join as board member
            </div>
            {createLink && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  marginTop: "10px",
                }}
              >
                <TextField
                  autoFocus
                  variant="outlined"
                  size="small"
                  value={inviteLink}
                />
                <MuiButton
                  color="primary"
                  variant="contained"
                  onClick={handleCopyLink}
                >
                  Copy
                </MuiButton>
              </div>
            )}
            <div style={{ marginTop: "50px" }}>
              <MuiButton variant="contained" fullWidth color="primary">
                Send Invitation
              </MuiButton>
            </div>
          </div>
        </Popover>
      </div>
      <div className="projectdetailsnavbar__last">
        <Button onClick={handleOpenMenu}>Show Menu</Button>
        <MenuList
          open={openMenu}
          handleClose={handleClose}
          items={[
            {
              name: "change Background",
              onClick: () => console.log("change background"),
            },
          ]}
          css={{ top: "50px !important" }}
        />
      </div>
    </div>
  );
}

export default ProjectDetailsNavbar;
