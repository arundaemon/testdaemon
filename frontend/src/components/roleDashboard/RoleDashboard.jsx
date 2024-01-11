import {
  Grid,
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  Alert,
  TextField,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { getHierachyDetails } from "../../config/services/hierachy";
import { useEffect, useState } from "react";
import { getUserData } from "../../helper/randomFunction/localStorage";
import { useLocation } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const styles = {
  primaryStyle: {
    display: "flex",
    padding: "20px",
    justifyContent: "flex-start",
    alignItems: "center",
  },
};

const ParentAccordian = ({ parentInfo, handleRoleSearch }) => {
  return (
    <div className="tableCardContainer">
      <Accordion defaultExpanded="true">
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography variant="h5">Parent Config</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {parentInfo && parentInfo?.length > 0 ? (
            <TableContainer component={Paper}>
              <Table
                aria-label="customized table"
                className="custom-table datasets-table"
              >
                <TableHead>
                  <TableRow className="cm_table_head">
                    <TableCell>S.No</TableCell>
                    <TableCell>
                      <div className="tableHeadCell">Profile</div>
                    </TableCell>
                    <TableCell>
                      <div className="tableHeadCell">Role</div>
                    </TableCell>
                    <TableCell>
                      <div className="tableHeadCell">Name</div>
                    </TableCell>
                    <TableCell>
                      <div className="tableHeadCell">EmpCode</div>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {parentInfo?.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell>{i + 1}.</TableCell>
                      <TableCell>
                        {row?.profileName ?? row.profileName ?? "-"}
                      </TableCell>
                      <TableCell
                        className="crm-anchor crm-anchor-small"
                        onClick={(e) => handleRoleSearch(row.roleName)}
                      >
                        {row?.roleName ?? row.roleName ?? "-"}
                      </TableCell>
                      <TableCell>
                        {row?.displayName ?? row.displayName ?? "-"}
                      </TableCell>
                      <TableCell>
                        {row?.userName ?? row.userName ?? "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Alert severity="error">No Content Available!</Alert>
          )}
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

const ChildAccordian = ({ childInfo, handleRoleSearch }) => {
  return (
    <div className="tableCardContainer">
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography variant="h5">Child Config</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {childInfo && childInfo?.length > 0 ? (
            <TableContainer component={Paper}>
              <Table
                aria-label="customized table"
                className="custom-table datasets-table"
              >
                <TableHead>
                  <TableRow className="cm_table_head">
                    <TableCell>S.No</TableCell>
                    <TableCell>
                      <div className="tableHeadCell">Profile</div>
                    </TableCell>
                    <TableCell>
                      <div className="tableHeadCell">Role</div>
                    </TableCell>
                    <TableCell>
                      <div className="tableHeadCell">Name</div>
                    </TableCell>
                    <TableCell>
                      <div className="tableHeadCell">EmpCode</div>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {childInfo?.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell>{i + 1}.</TableCell>
                      <TableCell>
                        {row?.profileName ?? row.profileName ?? "-"}
                      </TableCell>
                      <TableCell
                        className="crm-anchor crm-anchor-small"
                        onClick={(e) => handleRoleSearch(row.roleName)}
                      >
                        {row?.roleName ?? row.roleName ?? "-"}
                      </TableCell>
                      <TableCell>
                        {row?.displayName ?? row.displayName ?? "-"}
                      </TableCell>
                      <TableCell>
                        {row?.userName ?? row.userName ?? "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Alert severity="error">No Content Available!</Alert>
          )}
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

const RoleDashboard = () => {
  const [childConfig, setChildConfig] = useState(null);
  const [parentConfig, setParentConfig] = useState(null);
  const [search, setSearch] = useState(null);
  const [isDisable, setIsDisable] = useState(true);
  const location = useLocation();
  const role = location.state?.role;

  const fetchHierarchyDetail = (roleName) => {
    if (roleName === "") return;
    let params = {
      roleName: roleName,
    };
    getHierachyDetails(params)
      .then((res) => {
        if (res.result) {
          let parentArray = [];
          parentArray = convertObjectToArray(res.result, parentArray);
          let reversedArray = parentArray?.reverse();
          setParentConfig(reversedArray);
        }
        if (res.hierarchyInfo.childs) {
          setChildConfig(res.hierarchyInfo.childs);
        }
        setIsDisable(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const convertObjectToArray = (obj, array) => {
    const resultObject = {};
    for (const key in obj) {
      if (typeof obj[key] === "object") {
        const arrayUpdated = convertObjectToArray(obj[key], array);
      } else {
        resultObject[key] = obj[key];
      }
    }
    if (Object.keys(resultObject).length > 0) {
      array.push(resultObject);
      return array;
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.trim();
    setSearch(value);
    setIsDisable(false);
  };

  const handleRoleSearch = (role) => {
    setSearch(role);
    fetchHierarchyDetail(role);
  };

  useEffect(() => {
    if (role !== undefined) {
      setSearch(role);
      fetchHierarchyDetail(role);
    }
  }, [role]);

  return (
    <div className="tableCardContainer">
      <Paper>
        <Grid container spacing={2} sx={styles.primaryStyle}></Grid>
        <Grid
          item
          md={12}
          xs={12}
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <Typography variant="h5" mr={2}>
            Role Name :
          </Typography>
          <TextField
            id="standard-basic"
            variant="standard"
            value={search}
            onChange={handleSearch}
          />
          <Button
            variant="text"
            style={{ display: isDisable ? "none" : "block" }}
            onClick={() => fetchHierarchyDetail(search)}
          >
            <ArrowForwardIcon />
          </Button>
        </Grid>
        <Grid item md={12} xs={12}>
          <ParentAccordian
            parentInfo={parentConfig}
            handleRoleSearch={handleRoleSearch}
          />
        </Grid>

        <Grid item md={12} xs={12}>
          <ChildAccordian
            childInfo={childConfig}
            handleRoleSearch={handleRoleSearch}
          />
        </Grid>
      </Paper>
    </div>
  );
};

export default RoleDashboard;
