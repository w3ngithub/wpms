import React from "react";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import "./style.css";
import { makeStyles } from "@material-ui/core";

function MenuList({ open, handleClose, items, css }) {
  const useStyles = makeStyles({
    menu: css,
  });

  const classes = useStyles();
  return (
    <Menu
      id="simple-menu"
      anchorEl={open}
      keepMounted
      open={Boolean(open)}
      onClose={handleClose}
      className={classes.menu}
    >
      {items.map((item) => (
        <MenuItem onClick={handleClose}>{item}</MenuItem>
      ))}
    </Menu>
  );
}

export default MenuList;
