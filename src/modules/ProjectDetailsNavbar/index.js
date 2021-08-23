import React, { useState } from "react";
import Icon from "../../components/Icon";
import ProjectNameField from "../../components/ProjectNameField";
import "./style.css";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import { Divider } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Avatar } from "@material-ui/core";
import Button from "../../components/Button";
import MenuList from "../../components/MenuList";

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

function ProjectDetailsNavbar({ projectTitle }) {
  const classes = useStyles();
  const [openMenu, setOpenMenu] = useState(null);

  const handleOpenMenu = (event) => {
    setOpenMenu(event.currentTarget);
  };

  const handleClose = () => {
    setOpenMenu(null);
  };

  const projectNameFieldCss = {
    padding: "6px 10px",
  };
  return (
    <div className="projectdetailsnavbar">
      <div className="projectdetailsnavbar__front">
        <ProjectNameField
          customCss={projectNameFieldCss}
          isBold={true}
          title={projectTitle}
        />
        <Icon Icon={StarBorderIcon} />
        <Divider orientation="horizontal" classes={{ root: classes.root }} />
        <ProjectNameField
          title="Pariskrit's workspace"
          customCss={projectNameFieldCss}
        />
        <Divider orientation="horizontal" classes={{ root: classes.root }} />
        <Avatar alt="PM" className={classes.avatar}>
          PM
        </Avatar>
        <Button>Invite</Button>
      </div>
      <div className="projectdetailsnavbar__last">
        <Button onClick={handleOpenMenu}>Show Menu</Button>
        <MenuList
          open={openMenu}
          handleClose={handleClose}
          items={["change Background"]}
          css={{ top: "50px !important" }}
        />
      </div>
    </div>
  );
}

export default ProjectDetailsNavbar;
