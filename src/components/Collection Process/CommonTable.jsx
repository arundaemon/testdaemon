import {
  Box,
  Button,
  Divider,
  Grid,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import { useStyles } from "../../css/Collection-css";
import { useNavigate } from "react-router-dom";
import {
  CurrencySymbol,
  UserProfileName,
  fieldTab,
} from "../../constants/general";
import { getAllProductList } from "../../config/services/packageBundle";
import { useEffect, useState } from "react";
import { getUserData } from "../../helper/randomFunction/localStorage";
import MultipleSelectCheckBox from "./MultipleSelectCheckbox";
import { sendLoopMail } from "../../config/services/sendLoopMail";
import toast from "react-hot-toast";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  boxShadow: 24,
};

export const CustomTable = ({ header, data, schoolDetail }) => {
  const classes = useStyles();
  const [options, setOptions] = useState([]);
  const [isModal, setContactModal] = useState(false);
  const [isContact, setContactList] = useState(null);

  const isContactDetail = () => {
    setContactModal(true);
  };

  const handleClose = () => {
    setContactModal(false);
  };

  const getProductList = () => {
    let params = {
      status: [1],
      uuid: getUserData("loginData")?.uuid,
      master_data_type: "package_products",
    };
    getAllProductList(params)
      .then((res) => {
        let data = res?.data?.master_data_list;
        let tempArray = data?.map((obj) => ({
          label: obj?.name,
          value: obj?.name,
          groupkey: obj?.group_key,
          groupName: obj?.group_name,
          productID: obj?.id,
          productCode: obj?.product_key,
        }));
        tempArray = tempArray?.filter((obj) => obj?.groupName && obj?.groupkey);
        setOptions(tempArray);
      })
      .catch((err) => {
        console.error(err, "Error while fetching product list");
      });
  };

  useEffect(() => {
    getProductList();
  }, []);

  const navigate = useNavigate();

  const getContactData = (data) => {
    setContactList(data);
  };

  const renderCollectionDate = (data) => {
    if (data) {
      return data?.map((obj) => {
        return (
          <ul style={{listStyle: 'none'}}>
            <li className={classes.itemList}>
              {obj?.collection_date ? obj?.collection_date : "NA"}
            </li>
          </ul>
        );
      });
    }
  };

  const renderCollectionAmount = (data) => {
    if (data) {
      return data?.map((obj) => {
        return (
          <ul  style={{listStyle: 'none'}}>
            <li className={classes.itemList}>
              {`${CurrencySymbol?.India}${Number(
                obj?.collection_amount ? obj?.collection_amount : 0
              )?.toLocaleString("en-IN", {
                maximumFractionDigits: 2,
              })}`}
              {/* {obj?.collection_amount ? obj?.collection_amount : 0} */}
            </li>
          </ul>
        );
      });
    }
  };

  const renderCollectedAmount = (data) => {
    if (data) {
      return data?.map((obj) => {
        return (
          <ul  style={{listStyle: 'none'}}>
            <li className={classes.itemList}>
              {`${CurrencySymbol?.India}${Number(
                obj?.collected_amount ? obj?.collected_amount : 0
              )?.toLocaleString("en-IN", {
                maximumFractionDigits: 2,
              })}`}
              {/* {obj?.collected_amount ? obj?.collected_amount : 0} */}
            </li>
          </ul>
        );
      });
    }
  };

  const renderDueAmount = (data) => {
    if (data) {
      return data?.map((obj) => {
        return (
          <ul  style={{listStyle: 'none'}}>
            <li className={classes.itemList}>
              {`${CurrencySymbol?.India}${Number(
                obj?.due_amount ? obj?.due_amount : 0
              )?.toLocaleString("en-IN", {
                maximumFractionDigits: 2,
              })}`}
              {/* {obj?.due_amount ? obj?.due_amount : 0} */}
            </li>
          </ul>
        );
      });
    }
  };

  const renderActualCollectionDate = (data) => {
    if (data) {
      return data?.map((obj) => {
        return (
          <ul  style={{listStyle: 'none'}}>
            <li className={classes.itemList}>
              {obj?.actual_collection_date ? obj?.actual_collection_date : "NA"}
            </li>
          </ul>
        );
      });
    }
  };

  const handleClick = (obj) => {
    let productName = data?.pending_collection_details?.[0]?.products_name;
    navigate("/authorised/school-dashboard", {
      state: {
        schoolReferenceCode: obj?.school_code,
        referenceType: fieldTab?.collection,
        productRefCode: options?.filter(
          (obj) => obj?.label === productName
        )?.[0]?.productCode,
        allSchool: true
      },
    });
  };

  const sendReminder = async () => {
    if(!isContact?.length) {
      toast.error('Please Select Contact')
      return
    }
    let params = {
      data: isContact?.map((obj) => obj?.emailId)
    }
    try {
      let res = await sendLoopMail(params);
      if(res?.status === 1 && res?.data === 'Success') {
        toast.success('Mail Has been Sent Successfully')
        setContactModal(false)
      }
    } catch (err) {
      setContactModal(false)
      console.error(err);
    }
  };

  return (
    <>
      <TableContainer component={Paper} className="crm-table-container">
        <Table
          aria-label="simple table"
          className="crm-table-size-md"
        >
          <TableHead>
            <TableRow className="cm_table_head">
              {header?.map((col, index) => (
                <TableCell align={((index + 1) == header?.length) ? 'right': 'left'} key={index}>
                  {col}
                </TableCell>
              ))}
             
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.pending_collection_details?.map((obj, index) => {
              return (
                <TableRow key={0}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                  <TableCell align="left">{index + 1}</TableCell>
                  <TableCell align="left">
                    {obj?.invoice_number ? obj?.invoice_number : "NA"}
                  </TableCell>
                  <TableCell align="left">{obj?.products_name}</TableCell>
                  <TableCell align="left">
                    {`${CurrencySymbol?.India}${Number(
                      obj?.invoice_amount ? obj?.invoice_amount : 0
                    )?.toLocaleString("en-IN", {
                      maximumFractionDigits: 2,
                    })}`}
                    {/* {obj?.invoice_amount ? obj?.invoice_amount : 0} */}
                  </TableCell>
                  <TableCell align="left">
                    {" "}
                    {`${CurrencySymbol?.India}${Number(
                      obj?.late_fees_amount ? obj?.late_fees_amount : 0
                    )?.toLocaleString("en-IN", {
                      maximumFractionDigits: 2,
                    })}`}
                  </TableCell>
                  <TableCell align="left">
                    {`${CurrencySymbol?.India}${Number(
                      obj?.outstanding_amount ? obj?.outstanding_amount : 0
                    )?.toLocaleString("en-IN", {
                      maximumFractionDigits: 2,
                    })}`}
                    {/* {obj?.outstanding_amount ? obj?.outstanding_amount : 0} */}
                  </TableCell>
                  <TableCell align="left">
                    {renderCollectionDate(obj?.invoice_collection_details)}
                  </TableCell>
                  <TableCell align="left">
                    {renderCollectionAmount(obj?.invoice_collection_details)}
                  </TableCell>
                  <TableCell align="left">
                    {renderCollectedAmount(obj?.invoice_collection_details)}
                  </TableCell>
                  <TableCell align="left">
                    {renderDueAmount(obj?.invoice_collection_details)}
                  </TableCell>
                  <TableCell align="right">
                    {renderActualCollectionDate(
                      obj?.invoice_collection_details
                    )}
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Box 
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "30px",
          marginBottom: "20px",
        }}
      >
        <Button className="crm-btn crm-btn-outline crm-btn-lg mr-1" onClick={() => isContactDetail()}>
          Send Reminder
        </Button>
        {UserProfileName?.includes(getUserData("userData")?.crm_profile) && (
          <Button
            className="crm-btn crm-btn-outline crm-btn-lg mr-1"
            onClick={() => handleClick(data)}
          >
            Schedule Meeting
          </Button>
        )}
        <Button className="crm-btn crm-btn-outline crm-btn-lg mr-1" onClick={""}>
          Escalate the case
        </Button>
        <Button
            className="crm-btn crm-btn-lg"
          onClick={() =>
            navigate("/authorised/generate-addendum", { state: { data } })
          }
        >
          Generate Addendum
        </Button>
      </Box>
      {isModal && (
        <Modal
          open={isModal}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography
              id="modal-modal-title"
              className={classes.labelReminder}
              sx={{ padding: "25px 20px 0 20px" }}
            >
              Send Reminder To
            </Typography>
            <Grid sx={{ py: "8px" }}>
              <Grid item md={12} xs={12}>
                <Divider />
              </Grid>
              <Grid item md={12} xs={12} sx={{ px: "50px", py: "20px" }}>
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    flexDirection: "column",
                  }}
                >
                  <Typography className={classes.label}>
                    Select Contact 
                  </Typography>
                  <div style={{ width: "100%" }}>
                    <MultipleSelectCheckBox
                      label={"Select User"}
                      getInputData={getContactData}
                      // addNewContact={addNewContact}
                      data={schoolDetail?.[0]?.contactDetails}
                      // isUpdated={isContact}
                      // contactData={[]}
                      isDisabled={false}
                      // isContactModal={isContactModal}
                      type={"userContact"}
                    />
                  </div>
                </div>
              </Grid>
              <Grid item md={12} xs={12} sx={{ py: 2 }}>
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    margin: "0 auto",
                    gap: "10px",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    className={classes.submitBtn}
                    onClick={() => sendReminder()}
                  >
                    Next
                  </Button>
                </div>
              </Grid>
            </Grid>
          </Box>
        </Modal>
      )}
    </>
  );
};
