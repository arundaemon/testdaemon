import { makeStyles } from "@mui/styles";
import { Modal } from "@material-ui/core";

export const useStyles = makeStyles((theme) => ({
  breadcrumbTabs: {
    display: "flex",
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  breadcrumbTabsItem: {
    display: "flex",
    alignItems: "center",
    marginRight: 5,
    position: "relative",
  },
  breadcrumbTabsItemBefore: {
    content: '""',
    borderStyle: "solid",
    borderWidth: "6px 10px 6px 0",
    borderColor: "transparent #007bff transparent transparent",
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    left: "-10px",
  },
  breadcrumbTabsItemLastChildBefore: {
    content: "none",
  },
  breadcrumbTabsLink: {
    textDecoration: "none",
    color: "#007bff",
    fontWeight: "bold",
  },
  activeTab: {
    fontWeight: "bold",
    color: "#000", // Change the color for the active tab
  },
}));
