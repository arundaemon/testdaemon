import { makeStyles } from "@mui/styles";

export const Tabs = ({ children, renderType }) => {
  const classes = useStyles();
  if (renderType === "leadInterest") {
    return <div className={classes.tabMainConatinerlead}>{children}</div>;
  } else {
    return <div className={classes.tabMainConatiner}>{children}</div>;
  }
};

const useStyles = makeStyles((theme) => ({
  tabContainer: {
    display: "flex",
    // gap: "10px",
    alignItems: "center",
    cursor: "pointer",
  },
  tabMainConatiner: {
    display: "flex",
    justifyContent: 'center',
    padding: '10px'
    // [theme.breakpoints.down("md")]: {
    //   maxWidth: "450px",
    //   gap: "initial",
    //   justifyContent: "space-between",
    // },
  },
  tabMainConatinerlead: {
    display: "flex",
    padding: "20px 0 0 0",
    marginBottom: "-20px",
    marginLeft: "20px",
    [theme.breakpoints.down("md")]: {
      maxWidth: "450px",
      gap: "initial",
      justifyContent: "space-between",
    },
  },
}));
const ItemBase = ({ active, children, onClick }) => {
  let label = children[0];
  let color = children[1];
  const classes = useStyles();

  return (
    <div className={classes.tabContainer + ` crm-arrow-tabs-item-container`} onClick={onClick} >
      <div
        className={`crm-arrow-tabs-item ` + (active ? `active` : ``)}
        // style={
        //   active
        //     ? {
        //         fontWeight: "600",
        //         color: "#fff",
        //         fontSize: "14px",
        //         // border: "1px solid #eee",
        //         // background: '#f45e29',
        //         // minWidth: '150px',
        //         textAlign: 'center'
        //       }
        //     : {
        //         fontWeight: "400",
        //         color: "#f45e29",
        //         fontSize: "14px",
        //         // border: "1px solid #eee",
        //         // minWidth: '150px',
        //         textAlign: 'center'
        //       }
        // }
      >
        {label}
      </div>
    </div>
  );
};

const Item = ({ children, active, onClick, addressBox, renderType }) => {
  return (
    <ItemBase  onClick={onClick} active={active}>{children}</ItemBase>
  );
};

const ItemLead = ({ active, children }) => {
  const classes = useStyles();

  return (
    <div className={classes.tabContainer}>
      <div
        className={`crm-arrow-tabs-item ` + (active ? `active` : ``)}
        // style={
        //   active
        //     ? {
        //         fontWeight: "600",
        //         color: "#202124",
        //         fontSize: "12px",
        //         border: "1px solid #eee",
        //         padding: "10px 20px",
        //       }
        //     : {
        //         fontWeight: "400",
        //         color: "#202124",
        //         fontSize: "12px",
        //         border: "1px solid #eee",
        //         padding: "10px 20px",
        //       }
        // }
      >
        {children}
      </div>
    </div>
  );
};

Tabs.Item = Item;
