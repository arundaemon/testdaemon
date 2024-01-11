import React from "react";
import { makeStyles } from '@mui/styles'
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import logo from "../../assets/logo/extramarks-smart-classes-500x500.svg";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        paddingBottom: "1%",
    },
    title: {
      flexGrow: 1,
      textAlign: "left"
    },
    logo: {
      maxWidth: 120,
      marginRight: "10px"
    }
  })
);

export default function Header({name}) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="relative">
        <Toolbar>
          <img src={logo} alt="extramarks" className={classes.logo} />
          <Typography variant="h4" className={classes.title}> {name ? name : ''}  </Typography>
          <Button color="inherit">Log out</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}