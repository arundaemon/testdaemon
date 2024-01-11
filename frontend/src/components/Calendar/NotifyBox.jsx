import moment from "moment"
import { Link } from "react-router-dom"
import { makeStyles } from '@mui/styles';
import { color } from "@mui/system";

const useStyles = makeStyles((theme) => ({

  box: {
    padding: "10px 10px 0 10px",
  },

  boxGrid: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "14px",
    color: "#202124"
  },
  boxHead: {
    color: "#202124",
    fontSize: "18px",
  },

  textPara: {

  },
  viewAllBtn: {
    fontSize: "14px",
    color: "#4482FF",
    cursor: "pointer",
    fontWeight: '600',
    textDecoration: 'underline'
  },

}))

export const NotifyAlert = (props) => {

  let { count } = props;

  const classes = useStyles();
  return (
    <>
      <div className={classes.box}>
        <h2 className={classes.boxHead}>{moment(new Date).format("MMM D , YYYY")}</h2>
        <div className={classes.boxGrid}>
          <p>Follow up calls</p>
          <Link className={classes.viewAllBtn} to="/authorised/my-calendar">
            View All
          </Link>
        </div>
      </div>
    </>
  )
}