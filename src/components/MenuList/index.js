import React from "react";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import "./style.css";

function MenuList({ open, handleClose }) {
  return (
    <Menu
      id="simple-menu"
      anchorEl={open}
      keepMounted
      open={Boolean(open)}
      onClose={handleClose}
      className="menu"
    >
      <MenuItem onClick={handleClose}>Profile</MenuItem>
      <MenuItem onClick={handleClose}>My account</MenuItem>
      <MenuItem onClick={handleClose}>Logout</MenuItem>
    </Menu>
  );
}

export default MenuList;
