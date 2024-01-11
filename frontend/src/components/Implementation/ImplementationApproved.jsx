import {
  Button,
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useStyles } from "../../css/Implementation-css";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { getPurchaseOrderDetails } from "../../config/services/purchaseOrder";
import { assignApprovalRequest } from "../../config/services/salesApproval";
import {
  updateActivationPackage,
  updateImplementationByStatus,
} from "../../config/services/implementationForm";
import { getUserData } from "../../helper/randomFunction/localStorage";
import { toast } from "react-hot-toast";
import { packageActivation } from "../../config/services/packageBundle";

export const ImplementationApprovedTableList = ({
  data,
  getSelectedItem,
  // draftImpList,
}) => {
  const classes = useStyles();

  const navigate = useNavigate();

  const [implementationNo, setImplementationNo] = useState([]);

  const handleCheckboxChange = (event, item) => {
    if (event.target.checked) {
      setImplementationNo([...implementationNo, item]);
    } else {
      setImplementationNo(
        implementationNo.filter((checkedRow) => checkedRow !== item)
      );
    }
  };

  const navigateTo = (row, page) => {
    if (page === "imp") {
      navigate("/authorised/implementationDetail", {
        state: { impFormNumber: row.impFormNumber },
      });
    }
    if (page === "po") {
      navigate("/authorised/purchase-order-details", {
        state: { data: row },
      });
    }
    if (page === "quotation") {
      navigate("/authorised/quotation-detail", {
        state: {
          quotationCode: row.quotationCode,
        },
      });
    }
  };

  useEffect(() => {
    getSelectedItem(implementationNo);
  }, [implementationNo]);

  // const sendApprovalHandler = async (implementation) => {
  //   let groupCode = implementation?.productDetails[0]?.groupCode;
  //   let groupName = implementation?.productDetails[0]?.groupName;
  //   let refCode = implementation?.impFormNumber;
  //   let createdBy = implementation?.createdByRoleName;

  //   let data = {
  //     createdByName: implementation?.createdByName,
  //     createdByProfileName: implementation?.createdByProfileName,
  //     createdByEmpcode: implementation?.createdByEmpCode,
  //     createdByUuid: implementation?.createdByUuid,
  //     result: implementation,
  //   };

  //   let approveData = {
  //     approvalType: "Implementation",
  //     groupCode: groupCode || null,
  //     groupName: groupName || null,
  //     createdByRoleName: createdBy,
  //     referenceCode: refCode || null,
  //     data: data || null,
  //   };

  //   await assignApprovalRequest(approveData)
  //     .then(async (res) => {
  //       if (res?.result) {
  //         let updatedDate = {
  //           impFormNumber: refCode,
  //           status: "New",
  //           modifiedByName: getUserData("userData")?.name,
  //           modifiedByRoleName: getUserData("userData")?.crm_role,
  //           modifiedByProfileName: getUserData("userData")?.crm_profile,
  //           modifiedByEmpCode: getUserData("userData")?.employee_code,
  //           modifiedByUuid: getUserData("loginData")?.uuid,
  //         };
  //         await updateImplementationByStatus(updatedDate)
  //           .then((res) => console.log(res))
  //           .catch((e) => console.log(e));

  //         let packageDetails = implementation?.productDetails;
  //         let packageActivationData = {
  //           school_code: implementation?.schoolCode,
  //           implementation_id: implementation?.impFormNumber,
  //           po_code: implementation?.purchaseOrderCode,
  //           quotation_code: implementation?.quotationCode,
  //           school_email: implementation?.schoolEmailId || "",
  //           school_mobile: implementation?.schoolMobile,
  //           lecture_mode: "impartus",
  //           coordinator_count: Number(implementation?.noOfCordinators),
  //           city: implementation?.schoolCityName,
  //           country: implementation?.schoolCountryName,
  //           country_code: 91,
  //           country_id: 99,
  //           state: implementation?.schoolStateName,
  //           activation_type:
  //             packageDetails[0].quotationFor === "ACTUAL" ? 1 : 2,
  //           package_details: [],
  //           uuid: getUserData("loginData")?.uuid,
  //         };
  //         packageDetails?.map((item) => {
  //           if (
  //             item.productCode === "esc_plus_basic" ||
  //             item.productCode === "esc_plus_pro" ||
  //             item.productCode === "esc_plus_advanced"
  //           ) {
  //             let productObject = {
  //               product_code: item.productCode,
  //               package_id: item.productType || item.productItemRefId,
  //               student_count: Number(item.studentCount),
  //               teacher_count: Number(item.teacherCount),
  //               validity: implementation.validity,
  //               esc_count: Number(item.escUnit),
  //               mrp: Number(item.productItemMrp),
  //               mop: Number(item.productItemMop),
  //               selling_price: Number(item.productItemSalePrice),
  //               version: "V001",
  //               syllabus_details: [
  //                 {
  //                   board_id: item.boardID,
  //                   class_details: [
  //                     {
  //                       class_id: item.classID,
  //                     },
  //                   ],
  //                 },
  //               ],
  //             };
  //             packageActivationData.package_details.push(productObject);
  //           } else if (item.productCode === "sip_live_class") {
  //           } else if (item.productCode === "retail_live_class") {
  //           } else if (item.productCode === "em_power") {
  //           } else if (item.productCode === "self_study") {
  //           } else if (item.productCode === "la") {
  //           } else if (item.productCode === "toa") {
  //           } else if (item.productCode === "teaching_app") {
  //           } else if (item.productCode === "assement_centre") {
  //           }
  //         });
  //         await packageActivation(packageActivationData)
  //           .then(async (res) => {
  //             let updatedData = {
  //               impFormNumber: refCode,
  //               packageActivation: true,
  //               status: "System Activated",
  //               modifiedByName: getUserData("userData")?.name,
  //               modifiedByRoleName: getUserData("userData")?.crm_role,
  //               modifiedByProfileName: getUserData("userData")?.crm_profile,
  //               modifiedByEmpCode: getUserData("userData")?.employee_code,
  //               modifiedByUuid: getUserData("loginData")?.uuid,
  //             };
  //             await updateActivationPackage(updatedData)
  //               .then((res) => console.log(res))
  //               .catch((e) => console.log(e));
  //           })
  //           .catch((e) => console.log(e));
  //         // ACTIVATION KEY API
  //       } else {
  //         toast.error("Please Submit Again");
  //       }
  //     })
  //     .catch((e) => {
  //       console.log(e);
  //     });
  //   // window.location.reload()
  // };

  return (
    <>
      <TableContainer>
        <Table
          component={Paper}
          aria-label="simple table"
          className="custom-table datasets-table crm-sd-claims-table crm-table-header-left-aligned"
        >
          <TableHead>
            <TableRow className="cm_table_head">
              <TableCell>S.No</TableCell>
              <TableCell>
                {/* {" "} */}
                <div className="tableHeadCell">Implementation No</div>
              </TableCell>
              <TableCell>
                {/* {" "}  */}
                <div className="tableHeadCell">PO No</div>
              </TableCell>
              <TableCell>
                {/* {" "} */}
                <div className="tableHeadCell">Quotation No</div>
              </TableCell>
              <TableCell>
                {/* {" "} */}
                <div className="tableHeadCell">City</div>
              </TableCell>
              <TableCell>
                {/* {" "} */}
                <div className="tableHeadCell">State</div>
              </TableCell>
              <TableCell>
                <div className="tableHeadCell">School Code</div>
              </TableCell>
              <TableCell>
                <div className="tableHeadCell">School Name</div>
              </TableCell>
              <TableCell>
                <div className="">Product</div>
              </TableCell>
              <TableCell>
                <div className="tableHeadCell">Status</div>
              </TableCell>
              <TableCell>
                <div className="tableHeadCell">Created date</div>
              </TableCell>
              <TableCell>
                <div className="tableHeadCell">Created by</div>
              </TableCell>
              <TableCell>
                <div className="tableHeadCell">Assigned Engineer</div>
              </TableCell>
              {/* <TableCell></TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((item, index) => (
              <TableRow
                key={item.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>
                   {index + 1}
                </TableCell>
                <TableCell>
                  <p
                    onClick={() => navigateTo(item, "imp")}
                    className={classes.quotationLink}
                  >
                    {item?.impFormNumber || "NA"}
                  </p>
                </TableCell>
                <TableCell>
                  <p
                    onClick={() => navigateTo(item, "po")}
                    className={classes.quotationLink}
                  >
                    {item?.purchaseOrderCode || "NA"}
                  </p>
                </TableCell>
                <TableCell>
                  <p
                    onClick={() => navigateTo(item, "quotation")}
                    className={classes.quotationLink}
                  >
                    {item?.quotationCode || "NA"}
                  </p>
                </TableCell>
                <TableCell>{item?.schoolCityName || "NA"}</TableCell>
                <TableCell>{item?.schoolStateName || "NA"}</TableCell>
                <TableCell>{item?.schoolCode || "NA"}</TableCell>
                <TableCell>{item?.schoolName || "NA"}</TableCell>
                <TableCell>
                  {item?.productDetails?.length
                    ? item?.productDetails
                        ?.map((obj) => obj?.productItemName)
                        ?.join(",")
                    : "NA"}
                </TableCell>
                <TableCell>
                  {item?.status || "Ready for implementation"}
                </TableCell>
                <TableCell>
                  {moment(item?.createdAt).format("DD/MM/YYYY")}
                </TableCell>
                <TableCell>{item?.createdByName ?? "NA"}</TableCell>
                <TableCell>{item?.assignedEngineerName ?? "NA"}</TableCell>
                {/* <TableCell>
                  {draftImpList.length > 0 &&
                    draftImpList?.map((imp) => {
                      if (imp.impFormNumber === item.impFormNumber) {
                        return (
                          <Button
                            onClick={() => sendApprovalHandler(imp)}
                            sx={{
                              backgroundColor: "#f45e29",
                              border: "1px solid #f45e29",
                              borderRadius: "4px !important",
                              color: "#ffffff !important",
                              width: "90px",
                              "&:hover": {
                                color: "#f45e29 !important",
                              },
                            }}
                          >
                            Re-Submit
                          </Button>
                        );
                      }
                    })}
                </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
