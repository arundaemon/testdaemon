import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { fieldTab } from "../../constants/general";
import moment from "moment";

const SSRActivityTable = ({ data }) => {
  const navigate = useNavigate();

  const isRedirect = (obj) => {
    let implementationCode = obj?._id;
    navigate(`/authorised/site-survey-dash/${implementationCode}`, {
      state: {
        linkType: fieldTab?.SSR,
        isShowSSRForm: true,
      },
    });
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table
          aria-label="simple table"
          className="custom-table datasets-table crm-sd-claims-table crm-table-header-left-aligned"
        >
          <TableHead>
            <TableRow className="cm_table_head">
              <TableCell/>
              <TableCell>
                <div className="tableHeadCell">S.No</div>
              </TableCell>
              <TableCell>
                <div className="tableHeadCell">Activity ID</div>
              </TableCell>
              <TableCell>
                <div className="tableHeadCell">School Name & Code </div>
              </TableCell>
              <TableCell>
                <div className="tableHeadCell">Form Type</div>
              </TableCell>
              <TableCell>
                <div className="tableHeadCell">Implementation ID</div>
              </TableCell>
              <TableCell>
                <div className="tableHeadCell">Form Creation Date</div>
              </TableCell>
              <TableCell>
                <div className="tableHeadCell">Action</div>
              </TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.length > 0
              ? data?.map((obj, index) => {
                  return (
                    <TableRow
                      key={index}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >  
                      <TableCell/>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell sx={{minWidth: '250px'}}>
                        {/* {obj?.documents
                          ?.map((obj) => obj?.activityId)
                          ?.join(", ")} */}
                          {
                            obj?.documents?.[0]?.activityId
                          }
                      </TableCell>
                      <TableCell>{`${obj?.documents?.[0].schoolName}-${obj?.documents?.[0].schoolCode}`}</TableCell>
                      <TableCell>
                        {obj?.documents?.[0]?.leadType
                          ? obj?.documents?.[0]?.leadType
                          : "NA"}
                      </TableCell>
                      <TableCell>
                        {obj?.documents?.[0]?.leadId
                          ? obj?.documents?.[0]?.leadId
                          : "NA"}
                      </TableCell>
                      <TableCell>{obj?.documents?.[0]?.createdAt
                          ? moment(obj?.documents?.[0]?.createdAt).format('DD-MM-YYYY')
                          : "NA"}</TableCell>
                      <TableCell className="crm-sd-table-cell-anchor">
                        <div onClick={() => isRedirect(obj)}>Fill Details</div>
                      </TableCell>
                      <TableCell />
                    </TableRow>
                  );
                })
              : ""}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default SSRActivityTable;
