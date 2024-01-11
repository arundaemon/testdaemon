import React from 'react';
import { Grid, Paper, styled, Avatar, Typography, TableContainer, Table, TableBody, TableRow, TableCell } from "@mui/material";
import { makeStyles } from '@mui/styles';

const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const useStyles = makeStyles((theme) => ({
  blueTableRow: {
    "&:hover": {
      backgroundColor: "#E2EBFF !important"
    }
  },
  greenTableRow: {
    "&:hover": {
      backgroundColor: "#E2FFE6 !important"
    }
  },
  yellowTableRow: {
    "&:hover": {
      backgroundColor: "#FFE5BF !important"
    }
  },
  cusCard: {
    padding: "1px",
    boxShadow: "0px 0px 8px #00000029",
    borderRadius: "8px",
  },
  bgColorBlue: {
    backgroundColor: "#4482FF",
  },
  bgColorGreen: {
    backgroundColor: "#80CC8C",
  },
  bgColorYellow: {
    backgroundColor: "#FA9E2D",
  },
  headerSection: {
    borderBottom: "1px solid #ccc",
  },
  title: {
    fontWeight: "600",
  },
  discBox: {
    display: "flex",
    justifyContent: "space-between",
  },
  subTitle: {
    fontSize: "12px",
  },
  sectionTitle: {
    fontWeight: "600",
    fontSize: "14px",
    padding: "8px 0px",
  },
  tableCell: {
    padding: "3px 6px !important",
    fontWeight: "500",
  },
  avatar: {
    margin: "auto",
    border: "2px solid #ffffff",

  },
  large: {
    width: "60px",
    height: "60px",
  },
  small: {
    width: "50px",
    height: "50px",
  },
  badge: {
    right: "0",
    top: "0",
    position: "absolute",
    fontSize: "12px",
    fontWeight: "600",
    borderRadius: "100%",
    backgroundColor: "#E46179",
    height: "1rem",
    width: "1rem",
    textAlign: "center",
    lineHeight: "16px",
  },
  multiAvatar: {
    display: "flex",
    justifyContent: "space-around",
    padding: "14px 0px",
    color: "#ffffff",
  },
  multiAvatarSection: {
    position: "relative",
  },
  multiAvatarName: {
    fontSize: "12px",
    textAlign: "center",
  },
}));

export default function LeaderBoard() {
  const classes = useStyles();

  return (
    <>
      {/* <Grid sx={{ px: "16px", py: "12px" }} className={classes.headerSection}>
        <Typography className={classes.title}>Leader board</Typography>
        <Grid className={classes.discBox}>
          <Typography className={classes.subTitle}>Loremsipum Loremsipum</Typography>
        </Grid>
      </Grid>
      <Grid container spacing={2} sx={{ px: "12px", py: "12px" }}>

        <Grid item xs={4}>
          <Typography className={classes.sectionTitle}>Highest Talk Time</Typography>
          <Grid className={`${classes.cusCard} ${classes.bgColorBlue}`}>
            <div className={classes.multiAvatar}>
              <Grid className={classes.multiAvatarSection} sx={{ mt: "14px" }}>
                <Avatar alt="Rajesh" src="https://cms-assets.tutsplus.com/uploads/users/810/profiles/19338/profileImage/profile-square-extra-small.png" className={`${classes.avatar} ${classes.small}`} />
                <span className={classes.badge}>2</span>
                <Typography className={classes.multiAvatarName}>Shrishty</Typography>
                <Typography className={classes.multiAvatarName}>200pt</Typography>
              </Grid>
              <Grid className={classes.multiAvatarSection}>
                <Avatar alt="Rajesh" src="https://cms-assets.tutsplus.com/uploads/users/810/profiles/19338/profileImage/profile-square-extra-small.png" className={`${classes.avatar} ${classes.large}`} />
                <span className={classes.badge}>1</span>
                <Typography className={classes.multiAvatarName}>Shrishty</Typography>
                <Typography className={classes.multiAvatarName}>200pt</Typography>
              </Grid>
              <Grid className={classes.multiAvatarSection} sx={{ mt: "14px" }}>
                <Avatar alt="Rajesh" src="https://cms-assets.tutsplus.com/uploads/users/810/profiles/19338/profileImage/profile-square-extra-small.png" className={`${classes.avatar} ${classes.small}`} />
                <span className={classes.badge}>3</span>
                <Typography className={classes.multiAvatarName}>Shrishty</Typography>
                <Typography className={classes.multiAvatarName}>200pt</Typography>
              </Grid>
            </div>
            <TableContainer component={Paper} sx={{ px: "6px" }}>
              <Table>
                <TableBody>
                  <TableRow hover className={classes.blueTableRow}
                  >
                    <TableCell align="center" className={classes.tableCell}>1.</TableCell>
                    <TableCell align="center" className={classes.tableCell}>
                      <Avatar alt="Rajesh" src="https://cms-assets.tutsplus.com/uploads/users/810/profiles/19338/profileImage/profile-square-extra-small.png" className={classes.avatar} />
                    </TableCell>
                    <TableCell align="left" className={classes.tableCell}>Rajesh</TableCell>
                    <TableCell align="right" className={classes.tableCell}>300pt</TableCell>
                  </TableRow>
                  <TableRow hover className={classes.blueTableRow}
                  >
                    <TableCell align="center" className={classes.tableCell}>2.</TableCell>
                    <TableCell align="center" className={classes.tableCell}>
                      <Avatar alt="Rajesh" src="https://cms-assets.tutsplus.com/uploads/users/810/profiles/19338/profileImage/profile-square-extra-small.png" className={classes.avatar} />
                    </TableCell>
                    <TableCell align="left" className={classes.tableCell}>Rajesh</TableCell>
                    <TableCell align="right" className={classes.tableCell}>300pt</TableCell>
                  </TableRow>
                  <TableRow hover className={classes.blueTableRow}
                  >
                    <TableCell align="center" className={classes.tableCell}>3.</TableCell>
                    <TableCell align="center" className={classes.tableCell}>
                      <Avatar alt="Rajesh" src="https://cms-assets.tutsplus.com/uploads/users/810/profiles/19338/profileImage/profile-square-extra-small.png" className={classes.avatar} />
                    </TableCell>
                    <TableCell align="left" className={classes.tableCell}>Rajesh</TableCell>
                    <TableCell align="right" className={classes.tableCell}>300pt</TableCell>
                  </TableRow>
                  <TableRow hover className={classes.blueTableRow}
                  >
                    <TableCell align="center" className={classes.tableCell}>4.</TableCell>
                    <TableCell align="center" className={classes.tableCell}>
                      <Avatar alt="Rajesh" src="https://cms-assets.tutsplus.com/uploads/users/810/profiles/19338/profileImage/profile-square-extra-small.png" className={classes.avatar} />
                    </TableCell>
                    <TableCell align="left" className={classes.tableCell}>Rajesh</TableCell>
                    <TableCell align="right" className={classes.tableCell}>300pt</TableCell>
                  </TableRow>
                  <TableRow hover className={classes.blueTableRow}
                  >
                    <TableCell align="center" className={classes.tableCell}>5.</TableCell>
                    <TableCell align="center" className={classes.tableCell}>
                      <Avatar alt="Rajesh" src="https://cms-assets.tutsplus.com/uploads/users/810/profiles/19338/profileImage/profile-square-extra-small.png" className={classes.avatar} />
                    </TableCell>
                    <TableCell align="left" className={classes.tableCell}>Rajesh</TableCell>
                    <TableCell align="right" className={classes.tableCell}>300pt</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>

        <Grid item xs={4}>
          <Typography className={classes.sectionTitle}>Best Performer</Typography>
          <Grid className={`${classes.cusCard} ${classes.bgColorGreen}`}>
            <div className={classes.multiAvatar}>
              <Grid className={classes.multiAvatarSection} sx={{ mt: "14px" }}>
                <Avatar alt="Rajesh" src="https://cms-assets.tutsplus.com/uploads/users/810/profiles/19338/profileImage/profile-square-extra-small.png" className={`${classes.avatar} ${classes.small}`} />
                <span className={classes.badge}>2</span>
                <Typography className={classes.multiAvatarName}>Shrishty</Typography>
                <Typography className={classes.multiAvatarName}>200pt</Typography>
              </Grid>
              <Grid className={classes.multiAvatarSection}>
                <Avatar alt="Rajesh" src="https://cms-assets.tutsplus.com/uploads/users/810/profiles/19338/profileImage/profile-square-extra-small.png" className={`${classes.avatar} ${classes.large}`} />
                <span className={classes.badge}>1</span>
                <Typography className={classes.multiAvatarName}>Shrishty</Typography>
                <Typography className={classes.multiAvatarName}>200pt</Typography>
              </Grid>
              <Grid className={classes.multiAvatarSection} sx={{ mt: "14px" }}>
                <Avatar alt="Rajesh" src="https://cms-assets.tutsplus.com/uploads/users/810/profiles/19338/profileImage/profile-square-extra-small.png" className={`${classes.avatar} ${classes.small}`} />
                <span className={classes.badge}>3</span>
                <Typography className={classes.multiAvatarName}>Shrishty</Typography>
                <Typography className={classes.multiAvatarName}>200pt</Typography>
              </Grid>
            </div>
            <TableContainer component={Paper} sx={{ px: "6px" }}>
              <Table>
                <TableBody>
                  <TableRow hover className={classes.greenTableRow}
                  >
                    <TableCell align="center" className={classes.tableCell}>1.</TableCell>
                    <TableCell align="center" className={classes.tableCell}>
                      <Avatar alt="Rajesh" src="https://cms-assets.tutsplus.com/uploads/users/810/profiles/19338/profileImage/profile-square-extra-small.png" className={classes.avatar} />
                    </TableCell>
                    <TableCell align="left" className={classes.tableCell}>Rajesh</TableCell>
                    <TableCell align="right" className={classes.tableCell}>300pt</TableCell>
                  </TableRow>
                  <TableRow hover className={classes.greenTableRow}
                  >
                    <TableCell align="center" className={classes.tableCell}>2.</TableCell>
                    <TableCell align="center" className={classes.tableCell}>
                      <Avatar alt="Rajesh" src="https://cms-assets.tutsplus.com/uploads/users/810/profiles/19338/profileImage/profile-square-extra-small.png" className={classes.avatar} />
                    </TableCell>
                    <TableCell align="left" className={classes.tableCell}>Rajesh</TableCell>
                    <TableCell align="right" className={classes.tableCell}>300pt</TableCell>
                  </TableRow>
                  <TableRow hover className={classes.greenTableRow}
                  >
                    <TableCell align="center" className={classes.tableCell}>3.</TableCell>
                    <TableCell align="center" className={classes.tableCell}>
                      <Avatar alt="Rajesh" src="https://cms-assets.tutsplus.com/uploads/users/810/profiles/19338/profileImage/profile-square-extra-small.png" className={classes.avatar} />
                    </TableCell>
                    <TableCell align="left" className={classes.tableCell}>Rajesh</TableCell>
                    <TableCell align="right" className={classes.tableCell}>300pt</TableCell>
                  </TableRow>
                  <TableRow hover className={classes.greenTableRow}
                  >
                    <TableCell align="center" className={classes.tableCell}>4.</TableCell>
                    <TableCell align="center" className={classes.tableCell}>
                      <Avatar alt="Rajesh" src="https://cms-assets.tutsplus.com/uploads/users/810/profiles/19338/profileImage/profile-square-extra-small.png" className={classes.avatar} />
                    </TableCell>
                    <TableCell align="left" className={classes.tableCell}>Rajesh</TableCell>
                    <TableCell align="right" className={classes.tableCell}>300pt</TableCell>
                  </TableRow>
                  <TableRow hover className={classes.greenTableRow}
                  >
                    <TableCell align="center" className={classes.tableCell}>5.</TableCell>
                    <TableCell align="center" className={classes.tableCell}>
                      <Avatar alt="Rajesh" src="https://cms-assets.tutsplus.com/uploads/users/810/profiles/19338/profileImage/profile-square-extra-small.png" className={classes.avatar} />
                    </TableCell>
                    <TableCell align="left" className={classes.tableCell}>Rajesh</TableCell>
                    <TableCell align="right" className={classes.tableCell}>300pt</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>

        <Grid item xs={4}>
          <Typography className={classes.sectionTitle}>Highest No. of Conduction</Typography>
          <Grid className={`${classes.cusCard} ${classes.bgColorYellow}`}>
            <div className={classes.multiAvatar}>
              <Grid className={classes.multiAvatarSection} sx={{ mt: "14px" }}>
                <Avatar alt="Rajesh" src="https://cms-assets.tutsplus.com/uploads/users/810/profiles/19338/profileImage/profile-square-extra-small.png" className={`${classes.avatar} ${classes.small}`} />
                <span className={classes.badge}>2</span>
                <Typography className={classes.multiAvatarName}>Shrishty</Typography>
                <Typography className={classes.multiAvatarName}>200pt</Typography>
              </Grid>
              <Grid className={classes.multiAvatarSection}>
                <Avatar alt="Rajesh" src="https://cms-assets.tutsplus.com/uploads/users/810/profiles/19338/profileImage/profile-square-extra-small.png" className={`${classes.avatar} ${classes.large}`} />
                <span className={classes.badge}>1</span>
                <Typography className={classes.multiAvatarName}>Shrishty</Typography>
                <Typography className={classes.multiAvatarName}>200pt</Typography>
              </Grid>
              <Grid className={classes.multiAvatarSection} sx={{ mt: "14px" }}>
                <Avatar alt="Rajesh" src="https://cms-assets.tutsplus.com/uploads/users/810/profiles/19338/profileImage/profile-square-extra-small.png" className={`${classes.avatar} ${classes.small}`} />
                <span className={classes.badge}>3</span>
                <Typography className={classes.multiAvatarName}>Shrishty</Typography>
                <Typography className={classes.multiAvatarName}>200pt</Typography>
              </Grid>
            </div>
            <TableContainer component={Paper} sx={{ px: "6px" }}>
              <Table>
                <TableBody>
                  <TableRow hover className={classes.yellowTableRow}
                  >
                    <TableCell align="center" className={classes.tableCell}>1.</TableCell>
                    <TableCell align="center" className={classes.tableCell}>
                      <Avatar alt="Rajesh" src="https://cms-assets.tutsplus.com/uploads/users/810/profiles/19338/profileImage/profile-square-extra-small.png" className={classes.avatar} />
                    </TableCell>
                    <TableCell align="left" className={classes.tableCell}>Rajesh</TableCell>
                    <TableCell align="right" className={classes.tableCell}>300pt</TableCell>
                  </TableRow>
                  <TableRow hover className={classes.yellowTableRow}
                  >
                    <TableCell align="center" className={classes.tableCell}>2.</TableCell>
                    <TableCell align="center" className={classes.tableCell}>
                      <Avatar alt="Rajesh" src="https://cms-assets.tutsplus.com/uploads/users/810/profiles/19338/profileImage/profile-square-extra-small.png" className={classes.avatar} />
                    </TableCell>
                    <TableCell align="left" className={classes.tableCell}>Rajesh</TableCell>
                    <TableCell align="right" className={classes.tableCell}>300pt</TableCell>
                  </TableRow>
                  <TableRow hover className={classes.yellowTableRow}
                  >
                    <TableCell align="center" className={classes.tableCell}>3.</TableCell>
                    <TableCell align="center" className={classes.tableCell}>
                      <Avatar alt="Rajesh" src="https://cms-assets.tutsplus.com/uploads/users/810/profiles/19338/profileImage/profile-square-extra-small.png" className={classes.avatar} />
                    </TableCell>
                    <TableCell align="left" className={classes.tableCell}>Rajesh</TableCell>
                    <TableCell align="right" className={classes.tableCell}>300pt</TableCell>
                  </TableRow>
                  <TableRow hover className={classes.yellowTableRow}
                  >
                    <TableCell align="center" className={classes.tableCell}>4.</TableCell>
                    <TableCell align="center" className={classes.tableCell}>
                      <Avatar alt="Rajesh" src="https://cms-assets.tutsplus.com/uploads/users/810/profiles/19338/profileImage/profile-square-extra-small.png" className={classes.avatar} />
                    </TableCell>
                    <TableCell align="left" className={classes.tableCell}>Rajesh</TableCell>
                    <TableCell align="right" className={classes.tableCell}>300pt</TableCell>
                  </TableRow>
                  <TableRow hover className={classes.yellowTableRow}
                  >
                    <TableCell align="center" className={classes.tableCell}>5.</TableCell>
                    <TableCell align="center" className={classes.tableCell}>
                      <Avatar alt="Rajesh" src="https://cms-assets.tutsplus.com/uploads/users/810/profiles/19338/profileImage/profile-square-extra-small.png" className={classes.avatar} />
                    </TableCell>
                    <TableCell align="left" className={classes.tableCell}>Rajesh</TableCell>
                    <TableCell align="right" className={classes.tableCell}>300pt</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>

      </Grid> */}
    </>
  )
}
