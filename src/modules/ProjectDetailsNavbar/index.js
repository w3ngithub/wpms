import React from "react";
import Icon from "../../components/Icon";
import ProjectNameField from "../../components/ProjectNameField";
import "./style.css";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import { Divider } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Avatar } from "@material-ui/core";
import Button from "../../components/Button";

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

function ProjectDetailsNavbar() {
  const classes = useStyles();

  const projectNameFieldCss = {
    padding: "6px 10px",
  };
  return (
    <div className="projectdetailsnavbar">
      <ProjectNameField
        customCss={projectNameFieldCss}
        isBold={true}
        title="Project 2"
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
  );
}

export default ProjectDetailsNavbar;
