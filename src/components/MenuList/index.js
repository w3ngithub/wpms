import React from "react";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles } from "@material-ui/core";
import "./style.css";

function MenuList({ open, handleClose, items, css, paper = {} }) {
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
      classes={{ paper }}
    >
      {items.map((item) => (
        <MenuItem onClick={item.onClick} key={item.name}>
          {item.name}
        </MenuItem>
      ))}
    </Menu>
  );
}

export default MenuList;
