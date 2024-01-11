import { useState, useCallback, useEffect, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import toast from "react-hot-toast";
import moment from "moment";

import { scheduleActions } from "../redux/reducers/invoiceSchdeuler";
import { fetchImplementationListByApprovalStatus } from "../config/services/implementationForm";
import { useNavigate } from "react-router-dom";

const ScheduleList = ({}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [implementationList, setImplementationList] = useState([]);

  const generateSchedule = useCallback((implmentationObj) => {
    dispatch(scheduleActions.init({ obj: implmentationObj }));
    navigate("/authorised/create-schedule");
  });

  useEffect(() => {
    let params = {
      search: "",
      pageNo: 0,
      limit: 10,
      sortKey: "updatedAt",
      sortOrder: "desc",
      approvalStatus: "Approved",
    };
    fetchImplementationListByApprovalStatus(params)
      .then((res) => {
        //console.log(res)
        if (res.result) {
          setImplementationList([...res.result]);
        } else {
          setImplementationList([]);
        }
      })
      .catch((err) => {
        console.log(err);
        setImplementationList([]);
        toast.error("Something went wrong, while fetching the list");
      });
  }, []);

  return (
    <>
      <div>Generate Schedule</div>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow className="cm_table_head">
              <TableCell>
                <div className="tableHeadCell">PO Code</div>
              </TableCell>
              <TableCell>
                <div className="tableHeadCell">School Code</div>
              </TableCell>
              <TableCell>
                <div className="tableHeadCell">School Name</div>
              </TableCell>
              <TableCell>
                <div className="tableHeadCell">Implementation ID</div>
              </TableCell>
              <TableCell>
                <div className="tableHeadCell">Schedule Amount</div>
              </TableCell>
              <TableCell>
                <div className="tableHeadCell">Implementation Date</div>
              </TableCell>
              <TableCell>
                <div className="tableHeadCell">Action</div>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {implementationList.map((record, index) => (
              <TableRow
                key={record._id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>{record?.purchaseOrderCode || "NA"}</TableCell>
                <TableCell>{record?.schoolCode || "NA"}</TableCell>
                <TableCell>{record?.schoolName || "NA"}</TableCell>
                <TableCell>{record?.impFormNumber || "NA"}</TableCell>
                <TableCell>
                  {(record?.serviceDetails
                    ? [...record?.productDetails, ...record?.serviceDetails]
                    : [...record?.productDetails]
                  ).reduce(
                    (partialSum, obj) => partialSum + obj.productItemSalePrice,
                    0
                  ) || "NA"}
                </TableCell>
                <TableCell>
                  {moment
                    .utc(record?.implementationStartDate)
                    .format("DD-MM-YYYY")}
                </TableCell>
                <TableCell>
                  <Link onClick={(e) => generateSchedule(record)}>
                    Generate Schedule
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default memo(ScheduleList);
