import React from 'react';
import { Grid, Typography, Avatar, Button } from "@mui/material";
import { makeStyles } from '@mui/styles';
import iconFire from "../../assets/icons/Icon-fire.svg";

const useStyles = makeStyles((theme) => ({
  headerSection: {
    borderBottom: "1px solid #ccc",
  },
  title: {
    fontWeight: "600",
  },
  nameCard: {
    display: "flex",
    alignItems: "center",
  },
  avatar: {
    marginRight: "12px",
  },
  name: {
    fontSize: "15px",
    fontWeight: "600",
  },
  role: {
    fontSize: "12px",
    display: "flex",
  },
  tagIcon: {
    width: "10px",
    margin: "0 3px 0 12px",
  },
  tag: {
    color: "red"
  },
  detailsSection: {
    backgroundColor: "#FFE0D6",
    borderRadius: "5px",
    padding: "1rem",
    margin: "12px 0",
  },
  details: {
    fontSize: "12px",
    marginBottom: "5px",
    '&:last-child': {
      marginBottom: "0px",
    },
  },
  submitBtn: {
    backgroundColor: "#f45e29",
    border: "1px solid #f45e29",
    borderRadius: "4px !important",
    color: "#ffffff !important",
    padding: "4px 16px !important",
    margin: "0 12px 8px 0",
    fontWeight: "500 !important",
    "&:hover": {
      color: "#f45e29 !important",
    }
  },
}));

export default function CustomerDetails() {
  const classes = useStyles();

  return (
    <>
      <Grid sx={{ px: "16px", py: "12px" }} className={classes.headerSection}>
        <Typography className={classes.title}>Customer Details :</Typography>
      </Grid>
      <Grid sx={{ p: "12px" }}>
        <Grid className={classes.nameCard}>
          <Avatar
            alt="Remy Sharp"
            src="/static/images/avatar/1.jpg"
            sx={{ width: 45, height: 45 }}
            className={classes.avatar}
          >V</Avatar>
          <Grid>
            <Typography className={classes.name}>Vikrant Shonit</Typography>
            <Typography className={classes.role}>Student
              <img src={iconFire} alt="tagIcon" className={classes.tagIcon} />
              <span className={classes.tag}>Hot Lead</span>
            </Typography>
          </Grid>
        </Grid>
        <Grid className={classes.detailsSection}>
          <Typography className={classes.details}>Board : CBSE</Typography>
          <Typography className={classes.details}>Class : XII</Typography>
          <Typography className={classes.details}>City : New Delhi</Typography>
          <Typography className={classes.details}>School : Delhi Public School</Typography>
          <Typography className={classes.details}>Address : 201,Expo Centre, sec 130, Noida</Typography>
          <Typography className={classes.details}>Street : Expo Lane</Typography>
          <Typography className={classes.details}>Pincode : 220123</Typography>
          <Typography className={classes.details}>Owner : Shashank Bopche</Typography>
          <Typography className={classes.details}>Coupon Code : EMNEW2O</Typography>
        </Grid>
        <Button className={classes.submitBtn}>Upgrade & Re-punch</Button>
        <Button className={classes.submitBtn}>Raise Support</Button>
        <Button className={classes.submitBtn}>Raise Cancellation</Button>
      </Grid>
    </>
  )
}
