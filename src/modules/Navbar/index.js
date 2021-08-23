import React, { useState } from "react";
import "./style.css";
import HomeIcon from "@material-ui/icons/Home";

import AddIcon from "@material-ui/icons/Add";
import Icon from "../../components/Icon";
import logo from "../../assets/logo.png";
import SearchInputField from "../../components/SearchInputField";
import { Avatar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import MenuList from "../../components/MenuList";

const useStyles = makeStyles((theme) => ({
  avatar: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    fontSize: "15px",
    fontWeight: "600",
    backgroundColor: "#f3f1f1",
    color: "black",
    cursor: "pointer",
  },
}));

function Navbar() {
  const classes = useStyles();
  const [openAccountMenuList, setOpenAccountMenuList] = useState(null);

  const handleOpenAccountMenu = (event) => {
    setOpenAccountMenuList(event.currentTarget);
  };

  const handleClose = () => {
    setOpenAccountMenuList(null);
  };
  return (
    <nav className="navbar">
      <div className="navbar__front">
        <Icon Icon={HomeIcon} />
        <SearchInputField type="text" />
      </div>

      <img src={logo} alt="logo" className="navbar__logo" />
      <div className="navbar__last">
        <Icon Icon={AddIcon} />
        <Avatar
          alt="PM"
          className={classes.avatar}
          onClick={handleOpenAccountMenu}
        >
          PM
        </Avatar>
        <MenuList
          open={openAccountMenuList}
          handleClose={handleClose}
          items={["Profile", "My Account", "Logout"]}
          css={{ top: "30px !important" }}
        />
      </div>
    </nav>
  );
}

export default Navbar;
