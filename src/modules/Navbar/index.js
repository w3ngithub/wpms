import React from "react";
import "./style.css";
import HomeIcon from "@material-ui/icons/Home";

import AddIcon from "@material-ui/icons/Add";
import Icon from "../../components/Icon";
import logo from "../../assets/logo.png";
import InputField from "../../components/InputField";
import { Avatar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  avatar: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    fontSize: "15px",
    fontWeight: "600",
    backgroundColor: "#f3f1f1",
    color: "black",
  },
}));

function Navbar() {
  const classes = useStyles();
  return (
    <nav className="navbar">
      <div className="navbar__front">
        <Icon Icon={HomeIcon} />
        <InputField type="text" />
      </div>

      <img src={logo} alt="logo" className="navbar__logo" />
      <div className="navbar__last">
        <Icon Icon={AddIcon} />
        <Avatar alt="PM" className={classes.avatar}>
          PM
        </Avatar>
      </div>
    </nav>
  );
}

export default Navbar;
