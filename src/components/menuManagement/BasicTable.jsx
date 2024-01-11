import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
} from "@mui/material";
import EditIcon from "../../assets/icons/edit-icon.svg";
import PlusIcon from "../../assets/icons/Plus_Icon.svg";
import TableIcon from "../../assets/icons/table-icon.svg";
import { makeStyles } from '@mui/styles'




const BasicTable = () => {
  const items = [
    {
      Id: 1,
      BannerName: "Happy Teacher's Day 1",
      AppImage: "Image Link",
      WebImage: "Image Link",
      Priority: 1,
      Createdby: "Shashank 28-12-02",
      Status: "Active",
      Action: "Icon",
    },
    {
      Id: 2,
      BannerName: "Happy Teacher's Day 2",
      AppImage: "Link",
      WebImage: "Image Link",
      Priority: 2,
      Createdby: "Nikhil 28-12-02",
      Status: "Active",
      Action: "Icon",
    },
    {
      Id: 3,
      BannerName: "Happy Teacher's Day 3",
      AppImage: "Image Link",
      WebImage: "Image Link",
      Priority: 3,
      Createdby: "Digvijay 28-12-02",
      Status: "Active",
      Action: "Icon",
    },
  ];
  const useStyles = makeStyles({
    table: {
      // minWidth: 650,
      "& .MuiTableCell-root": {
        borderLeft: "1px solid rgba(224, 224, 224, 1)"
      }
    }
  });
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table 
        aria-label="customized table"
        className={` ${classes.table} custom-table datasets-table`}
      >
        <TableHead>
          <TableRow className="cm_table_head" >
            <TableCell>Product</TableCell>
            <TableCell>Source</TableCell>
            <TableCell>Sub-Source</TableCell>
            <TableCell>Date</TableCell>
            {/* <TableCell>Priority</TableCell>
            <TableCell>Created by &amp; Date</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Action</TableCell> */}
          </TableRow>
        </TableHead>

        <TableBody>
          {items &&
            items.length > 0 &&
            items.map((row, i) => (
              <TableRow key={i}>
                <TableCell>Extramarks Essential JEE</TableCell>
                <TableCell>
                  Direct Traffic
                </TableCell>
                <TableCell>
                  App
                </TableCell>
                <TableCell>
                  26-07-2022
                  {/* <img
                    className="menu-table-icon"
                    src={PlusIcon}
                    alt="plus icon"
                  /> */}
                </TableCell>
                {/* <TableCell>{row.Priority}</TableCell>
                <TableCell>{row.Createdby}</TableCell>
                <TableCell>{row.Status}</TableCell>
                <TableCell className="edit-cell action-cell">
                  <Button className="form_icon">
                    <img src={EditIcon} alt="edit icon" />
                  </Button>
                </TableCell> */}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BasicTable;
