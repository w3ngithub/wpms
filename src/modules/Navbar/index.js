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
import { useHistory, useLocation } from "react-router";
import { useEffect } from "react";

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

function Navbar({ openCreateBoardModal, setSearchBoard }) {
  const classes = useStyles();
  const [openAccountMenuList, setOpenAccountMenuList] = useState(null);
  const history = useHistory();
  const user = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();

  const handleOpenAccountMenu = (event) => {
    setOpenAccountMenuList(event.currentTarget);
  };

  const handleClose = () => {
    setOpenAccountMenuList(null);
  };

  const onLogout = () => {
    localStorage.removeItem("user");
    history.push("/login");
  };

  useEffect(() => {
    if (openAccountMenuList) {
      setOpenAccountMenuList(false);
    }
  }, [location]);

  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  return (
    <nav
      className="navbar"
      style={
        location.pathname.split("/")[2] === "boards"
          ? { backgroundColor: "#026AA7" }
          : null
      }
    >
      <div className="navbar__front">
        <Icon
          Icon={HomeIcon}
          onClick={() => history.push(`/${user?.name}/boards`)}
        />
      </div>

      <img src={logo} alt="logo" className="navbar__logo" />
      <div className="navbar__last">
        <SearchInputField
          onChange={(e) => {
            setSearchBoard(e.target.value);
          }}
        />
        <Icon Icon={AddIcon} onClick={openCreateBoardModal} />
        <Avatar
          alt="PM"
          className={classes.avatar}
          onClick={handleOpenAccountMenu}
        >
          {user?.name[0]?.toUpperCase()}
        </Avatar>
        <MenuList
          open={openAccountMenuList}
          handleClose={handleClose}
          items={[
            { name: "Profile", onClick: () => console.log("Profile") },
            { name: "My Account", onClick: () => console.log("my account") },
            { name: "Logout", onClick: onLogout },
          ]}
          css={{ top: "30px !important" }}
        />
      </div>
    </nav>
  );
}

export default Navbar;
