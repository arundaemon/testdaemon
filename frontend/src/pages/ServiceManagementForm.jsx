import React, { useState, useEffect } from "react";
import Page from "../components/Page";
import { Grid, Typography, Button, Breadcrumbs } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import ReactSelect from "react-select";
import {
  addService,
  updateService,
  listPackageBundles
} from "../config/services/packageBundle";
import { getUserData } from "../helper/randomFunction/localStorage";
import { handleHsnCodeValidation, handlePaste } from "../helper/randomFunction";

const useStyles = makeStyles((theme) => ({
  cusCard: {
    padding: "18px",
    boxShadow: "0px 0px 8px #00000029",
    borderRadius: "8px",
    margin: "0.5rem 1rem",
  },
  title: {
    fontSize: "16px",
    fontWeight: "600",
    lineHeight: "16px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    marginBottom: "6px",
  },
  inputStyle: {
    fontSize: "1rem",
    padding: "8.8px",
    width: "100%",
    borderRadius: "4px",
    border: "1px solid #DEDEDE",
  },
  btnSection: {
    padding: "1rem 1rem 2rem 1rem",
    textAlign: "right",
  },
  submitBtn: {
    backgroundColor: "#f45e29",
    border: "1px solid #f45e29",
    borderRadius: "4px !important",
    color: "#ffffff !important",
    padding: "6px 16px !important",
    "&:hover": {
      color: "#f45e29 !important",
    },
  },
  rowBtn: {
    position: "absolute",
    right: "-1.7rem",
    top: "2.1rem",
    width: "1.2rem !important",
    cursor: "pointer",
    opacity: "0.3",
    "&:hover": {
      opacity: "0.6",
    },
  },
  CstmBoxGrid: {
    padding: "0 !important",
    position: "relative",
  },
  autoResizeTextarea: {
    resize: "vertical" /* Allow vertical resizing */,
    minHeight: "50px" /* Set the minimum height */,
    maxHeight: "200px" /* Set the maximum height if needed */,
    width: "100%" /* Adjust the width as desired */,
    overflow: "auto" /* Enable scrolling if the content exceeds the height */,
  },
}));

export default function ServiceManagementForm() {
  const location = useLocation();

  const item = location.state?.row;
  const { id } = useParams();
  const classes = useStyles();
  const [bundleName, setBundleName] = useState("");
  const [mrp, setMrp] = useState(null);
  const [mop, setMop] = useState(null);
  const [hsnCode, setHsnCode] = useState();
  const [bundleDes, setBundleDes] = useState(["• "]);
  const [leadSource, setLeadSource] = useState();
  const [sourceList, setSourceList] = useState([]);
  const navigate = useNavigate();
  const loginData = getUserData('loginData')
  const loggedInUser = loginData?.uuid
  const [newSource, setNewSource] = useState([]);

  useEffect(() => {
    const addLeadingCharacter = (array, characterToAdd) => {
      return array.map((element) => characterToAdd + element);
    };
    setBundleName(item?.service_name);
    setBundleDes(
      item?.service_description
        ? addLeadingCharacter(item.service_description, "• ")
        : ["• "]
    );
  }, []);

  const fetchAllSourceList = () => {
    let params = {
      uuid: loggedInUser,
      status: [1],
    };
    listPackageBundles(params)
      .then((res) => {
        // if (res?.data?.package_list_details) {
        const modifiedSourceList = res?.data?.package_list_details?.map(
          (packageDetail) => {
            const modifiedPackageDetail = {
              label: packageDetail.package_information.package_name,
              value: packageDetail.package_information.package_id,
              ...packageDetail, // Copy other properties from the original packageDetail
            };

            return modifiedPackageDetail;
          }
        );

        setSourceList(modifiedSourceList);
        // }
      })
      .catch((err) => console.error(err));
  };

  const bundleCancelHandler = () => {
    navigate("/authorised/service-management");
  };

  const bundleSubmitHandler = async (e) => {

    e.preventDefault();
    if (!bundleName) {
      toast.error("Service Name is Required!");
      return;
    }
    if (!leadSource) {
      toast.error("Package List is Required!");
      return;
    }

    if (mrp === null) {
      toast.error("MRP is Required!");
      return;
    } else if (!Number.isInteger(Number(mrp))) {
      toast.error("MRP should be a Whole Number!");
      return;
    }
    if (mop === null) {
      toast.error("MOP is Required!");
      return;
    } else if (!Number.isInteger(Number(mop))) {
      toast.error("MOP should be a Whole Number!");
      return;
    }

    if (!hsnCode) {
      toast.error("HSN Code is Required!");
      return;
    }
    if (parseInt(mop) > parseInt(mrp)) {
      toast.error("MOP cannot be greater than MRP!");
      return;
    }
    const modifiedBundleDes = bundleDes.map((element) =>
      element.startsWith("•") ? element.replace("• ", "") : element
    );

    if (id) {
      let obj = {
        uuid: loggedInUser,
        service_id: id,
        service_name: bundleName,
        service_description: modifiedBundleDes,
        service_mrp: mrp.toString(),
        service_mop: mop.toString(),
        hsn_code: hsnCode,
        package_id: newSource,
        status: 1,
      };

      try {
        const response = await updateService(obj);

        response.data.status === 1
          ? toast.success(response?.data.message)
          : toast.error(response?.data.message);
      } catch (err) {
        console.log("error in updateService: ", err);
      }
    } else {
      let obj = {
        uuid: loggedInUser,
        service_id: id,
        service_name: bundleName,
        service_description: modifiedBundleDes,
        service_mrp: mrp?.toString(),
        service_mop: mop?.toString(),
        hsn_code: hsnCode,
        package_id: newSource,
        status: 1,
      };

      try {
        const response = await addService(obj);

        response.data.status === 1
          ? toast.success(response?.data.message)
          : toast.error(response?.data.message);
      } catch (err) {
        console.log("error in addService: ", err);
        toast.error("***Error***");
      }
    }

    setBundleDes(["• "]);
    setBundleName("");
    navigate("/authorised/service-management");
  };
  const handleSelectLeadSourceName = (newSelectValue) => {
    newSelectValue.map((packageInfo) => {
      setNewSource([...newSource, packageInfo.package_information.package_id]);
    });

    setLeadSource(newSelectValue);
    //setSourceId(new)
  };

  useEffect(() => {
    fetchAllSourceList();
  }, []);

  return (
    <>
      <Page
        title="Extramarks | Service management"
        className="main-container myLeadPage datasets_container"
      >
        <div>
          <form onSubmit={(e) => bundleSubmitHandler(e)}>
            <Grid className={classes.cusCard}>
              {/* <> */}
              {/* <Grid container spacing={1} sx={{ py: "8px" }}> */}
              <Grid container spacing={4} mb={2}>
                <Grid item lg={3}>
                  <Typography className={classes.label}>
                    Service Name<span style={{ color: "red" }}>*</span>
                  </Typography>
                  <input
                    className={classes.inputStyle}
                    name="Service Name"
                    type="text"
                    placeholder="Service Name"
                    maxLength="50"
                    value={bundleName}
                    onChange={(e) => setBundleName(e.target.value)}
                  />
                </Grid>
                <Grid item lg={2}>
                  <Typography className={classes.label}>
                    MRP<span style={{ color: "red" }}>*</span>
                  </Typography>
                  <input
                    className={classes.inputStyle}
                    name="Mrp"
                    type="number"
                    placeholder="MRP"
                    maxLength="10"
                    value={mrp !== null ? mrp : ""}
                    onChange={(e) =>
                      setMrp(
                        e.target.value !== ""
                          ? parseFloat(e.target.value)
                          : null
                      )
                    }
                  />
                </Grid>
                <Grid item lg={2}>
                  <Typography className={classes.label}>
                    MOP<span style={{ color: "red" }}>*</span>
                  </Typography>
                  <input
                    className={classes.inputStyle}
                    name="Mop"
                    type="number"
                    placeholder="MOP"
                    maxLength="10"
                    value={mop !== null ? mop : ""}
                    onChange={(e) =>
                      setMop(
                        e.target.value !== ""
                          ? parseFloat(e.target.value)
                          : null
                      )
                    }
                  />
                </Grid>
                <Grid item lg={2}>
                  <Typography className={classes.label}>
                    HSN Number<span style={{ color: "red" }}>*</span>
                  </Typography>
                  <input
                    className={classes.inputStyle}
                    name="name"
                    type="number"
                    placeholder="HSN Code"
                    maxLength="10"
                    value={hsnCode}
                    onChange={(e) => setHsnCode(e.target.value)}
                    onKeyDown={handleHsnCodeValidation}
                    onPaste={handlePaste}
                  />
                </Grid>
              </Grid>

              <Grid container mb={2}>
                <Grid item xs={3}>
                  <Typography className={classes.label}>
                    Mapped Packages<span style={{ color: "red" }}>*</span>
                  </Typography>
                  <ReactSelect
                    classNamePrefix="select"
                    isMulti
                    options={sourceList}
                    value={leadSource}
                    onChange={handleSelectLeadSourceName}
                  />
                </Grid>
              </Grid>

              <Grid item xs={3}>
                <Grid>
                  <Typography className={classes.label}>Description</Typography>
                  <textarea
                    className={classes.inputStyle}
                    name="name"
                    type="text"
                    rows={7}
                    placeholder="Name"
                    maxLength="500"
                    value={bundleDes?.join("\n")}
                    onChange={(e) =>
                      setBundleDes(e?.target?.value?.split("\n"))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const updatedDescription = [...bundleDes, "• "];
                        setBundleDes(updatedDescription);
                      }
                    }}
                  />
                </Grid>
              </Grid>
              {/* </Grid> */}
              {/* </> */}
            </Grid>

            <Grid className={classes.btnSection}>
              <Button
                style={{
                  marginRight: "10px",
                }}
                className={classes.submitBtn}
                onClick={() => bundleCancelHandler()}
              >
                Cancel
              </Button>

              <Button className={classes.submitBtn} type="submit">
                Submit
              </Button>
            </Grid>
          </form>
        </div>
      </Page>
    </>
  );
}
