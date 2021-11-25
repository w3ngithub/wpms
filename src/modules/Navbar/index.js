import React, { useState } from "react";
import "./style.css";
import HomeIcon from "@material-ui/icons/Home";

import AddIcon from "@material-ui/icons/Add";
import Icon from "../../components/Icon";
import logo from "../../assets/logo.png";
import SearchInputField from "../../components/SearchInputField";
import Avatar from "react-avatar";
import MenuList from "../../components/MenuList";
import { useHistory, useLocation } from "react-router";
import { useEffect } from "react";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  paper: { minWidth: "160px", right: "100px", top: "60px" },
});

function Navbar({
  openCreateBoardModal,
  setSearchBoard,
  setIsFocused,
  searchBoard,
}) {
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
          ? { background: "linear-gradient(#337ab7,#5490c3)" }
          : null
      }
    >
      <div className="navbar__front">
        <Icon
          Icon={HomeIcon}
          onClick={() => history.push(`/${user?.name}/boards`)}
        />
        <img src={logo} alt="logo" className="navbar__logo" />
      </div>

      <div className="navbar__last">
        <SearchInputField
          onChange={(e) => {
            setSearchBoard(e.target.value);
          }}
          value={searchBoard}
          onFocus={() => {
            setIsFocused(true);
          }}
          onBlur={() => {
            setSearchBoard("");
            setIsFocused(false);
          }}
        />
        <Icon Icon={AddIcon} onClick={openCreateBoardModal} />
        <Avatar
          name={user?.name}
          onClick={handleOpenAccountMenu}
          size={35}
          round
        />
        <MenuList
          open={openAccountMenuList}
          handleClose={handleClose}
          items={[{ name: "Logout", onClick: onLogout }]}
          css={{ top: "40px !important" }}
          paper={classes.paper}
        />
      </div>
    </nav>
  );
}

export default Navbar;
