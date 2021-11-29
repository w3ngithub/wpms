import React, { useState } from "react";
import Icon from "../../components/Icon";
import ProjectNameField from "../../components/ProjectNameField";
import "./style.css";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import StarIcon from "@material-ui/icons/Star";
import {
  Divider,
  Popover,
  TextField,
  Button as MuiButton,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "react-avatar";
import Button from "../../components/Button";
import MenuList from "../../components/MenuList";
import EditableTextField from "../../components/EditableTextField";
import { useEffect } from "react";
import { addFavouriteBoard, updateBoard } from "../../api-config/boards";
import { useParams } from "react-router";
import InsertInvitationIcon from "@material-ui/icons/InsertInvitation";
import Circle from "@uiw/react-color-circle";
import CloseIcon from "@material-ui/icons/Close";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import { boardColor } from "../../constants/boardColors";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "14px",
    borderStyle: "inset",
    borderWidth: "1px",
    borderColor: "white",
  },
  IconRoot: {
    color: "red",
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

function ProjectDetailsNavbar({
  projectTitle,
  user,
  members,
  boardUser,
  favourite,
}) {
  const classes = useStyles();
  const [openMenu, setOpenMenu] = useState(null);
  const [editedTitle, setEditedTitle] = useState(projectTitle);
  const [createLink, setCreateLink] = useState(false);
  const [inviteLink, setInviteLink] = useState("");
  const { projectId } = useParams();

  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorE2, setAnchorE2] = useState(null);

  const handleClickPopOver = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopOver = () => {
    setAnchorEl(null);
  };

  const handleBGColorkPopOver = (event) => {
    setAnchorE2(event.currentTarget);
  };

  const handleBGColorClosePopOver = () => {
    setAnchorE2(null);
  };

  const open = Boolean(anchorEl);
  const openBgColor = Boolean(anchorE2);
  const id = open ? "simple-popover" : undefined;
  const idBgColor = openBgColor ? "simple-popover" : undefined;

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

  const handleFavouriteBoard = () => {
    let favouriteUsers = [];
    if (favourite.includes(user)) {
      favouriteUsers = favourite.filter((fav) => fav !== user);
    } else {
      favouriteUsers.push(user);
    }
    addFavouriteBoard(projectId, favouriteUsers);
  };

  const projectNameFieldCss = {
    padding: "6px 10px",
  };

  useEffect(() => {
    if (createLink) {
      setInviteLink(`${process.env.REACT_APP_BASE_URL}invite/${projectId}`);
    }
  }, [createLink, projectId]);

  useEffect(() => {
    if (projectTitle) {
      setEditedTitle(projectTitle);
    }
  }, [projectTitle]);

  const handleChangeBoardColor = async (color) => {
    handleBGColorClosePopOver();
    await updateBoard(projectId, "boardColor", color.hex);
  };
  return (
    <div className="projectdetailsnavbar">
      <div className="projectdetailsnavbar__front">
        <EditableTextField
          oldTitle={projectTitle}
          title={editedTitle}
          onChange={onEditedTitleChange}
          save={onSaveEditedTitle}
        />

        {favourite.includes(user) ? (
          <Icon
            Icon={StarIcon}
            style={{ fill: "yellow" }}
            onClick={handleFavouriteBoard}
          />
        ) : (
          <Icon Icon={StarBorderIcon} onClick={handleFavouriteBoard} />
        )}
        <Divider orientation="horizontal" classes={{ root: classes.root }} />

        <ProjectNameField
          title={`${user}'s workspace`}
          customCss={projectNameFieldCss}
        />
        <Divider orientation="horizontal" classes={{ root: classes.root }} />
        <div className="project_memebers">
          {[boardUser, ...members].map((name, i) => (
            <Avatar key={name + i} name={name} size={35} round />
          ))}
        </div>

        <Button
          aria-describedby={id}
          variant="contained"
          onClick={handleClickPopOver}
          style={{
            backgroundColor: "rgb(240 240 240)",
          }}
        >
          <GroupAddIcon style={{ color: "#000" }} />
          <span style={{ color: "#000" }}>Invite</span>
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
                top: "8px",
                right: "9px",
                fontSize: "20px",
                cursor: "pointer",
              }}
              onClick={handleClosePopOver}
            >
              <CloseIcon style={{ fontSize: "18px" }} />
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
                {!createLink ? "Create link" : "Disable link"}
              </div>
            </div>
            <div
              style={{ fontSize: "12px", color: "#5e6c84", marginTop: "6px" }}
            >
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
            <div style={{ marginTop: "30px" }}>
              <MuiButton variant="contained" fullWidth color="primary">
                Send Invitation
              </MuiButton>
            </div>
          </div>
        </Popover>
      </div>
      <div className="projectdetailsnavbar__last">
        <Button
          onClick={handleOpenMenu}
          id={openBgColor}
          style={{ width: "100px" }}
        >
          Show Menu
        </Button>
        <MenuList
          open={openMenu}
          handleClose={handleClose}
          items={[
            {
              name: "change Background",
              onClick: (e) => {
                handleClose();
                handleBGColorkPopOver(e);
              },
            },
          ]}
          css={{ top: "50px !important" }}
        />
        <Popover
          id={idBgColor}
          open={openBgColor}
          anchorEl={anchorE2}
          onClose={handleBGColorClosePopOver}
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
              <p>Change Background </p>
            </div>
            <div
              style={{
                position: "absolute",
                top: "8px",
                right: "9px",
                fontSize: "20px",
                cursor: "pointer",
              }}
              onClick={handleBGColorClosePopOver}
            >
              <CloseIcon style={{ fontSize: "18px" }} />
            </div>
            <Circle
              colors={boardColor}
              onChange={(color) => handleChangeBoardColor(color)}
            />
          </div>
        </Popover>
      </div>
    </div>
  );
}

export default ProjectDetailsNavbar;
