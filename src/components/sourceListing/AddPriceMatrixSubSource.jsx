import React, { useState, useEffect } from "react";
import Page from "../../components/Page";
import { Grid, Typography, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { addSubSource, updateSubSource } from "../../config/services/matrixSubSource";
import { toast } from "react-hot-toast";
import ReactSelect from "react-select";
import { getSourceList } from "../../config/services/matrixSource";

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
    resize: 'none'
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
  // CancelBtn: {
  //     backgroundColor: "#ffffff",
  //     border: "1px solid #f45e29",
  //     borderRadius: "4px !important",
  //     color: "#f45e29 !important",
  //     padding: "6px 16px !important",
  //     "&:hover": {
  //       color: "#f45e29 !important",
  //     },
  //   },
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

export default function AddPriceMatrixSubSource() {
  const location = useLocation();
  const item = location.state?.row;
  const { id, source_id, source_name } = useParams();
  const classes = useStyles();
  const [bundleName, setBundleName] = useState("");
  const [bundleDes, setBundleDes] = useState([]);
  const navigate = useNavigate();
  const [disableButton, setDisablebutton] = useState(false)
  const [loggedInUser] = useState(
    JSON.parse(localStorage.getItem("loginData"))?.uuid
  );
  const [sourceList, setSourceList] = useState()
  const [newSource, setNewSource] = useState({
    label: item?.source_name || "Select",
    value: source_id || "",
  });

  useEffect(() => {
    const addLeadingCharacter = (array, characterToAdd) => {
      return array.map((element) => characterToAdd + element);
    };
    setBundleName(item?.sub_source_name);

    setBundleDes(item?.sub_source_description);
  }, []);

  useEffect(async () => {
    let obj = {
      uuid: loggedInUser,
      status: [1],
    };

    try {
      const response = await getSourceList(obj);
      if (response?.data?.source_list) {
        const modifiedSourceList = response.data.source_list.map((sourceObj) => ({
          label: sourceObj?.source_name,
          value: sourceObj?.source_id,
        }));

        setSourceList(modifiedSourceList);

        // Set the initial state of newSource
        if (item?.source_name) {
          setNewSource({
            label: item.source_name,
            value: source_id || "",
          });
        } else {
          setNewSource({ label: "Select", value: "" });
        }
      }
    } catch (err) {
      console.log("error in getSourceList: ", err);
      toast.error("***Error***");
    }
  }, []);

  const bundleCancelHandler = () => {
    let toSource = location?.state?.source;
    if (toSource) {
      navigate("/authorised/source-listing");
    }
    else navigate("/authorised/sub-source-listing");
  };

  const bundleSubmitHandler = async (e) => {
    e.preventDefault();
    if (!bundleName) {
      setDisablebutton(false)
      toast.error("Sub Source Name is Required!");
      return;
    }
    if (newSource?.value === "") {
      setDisablebutton(false)
      toast.error("Please Select Source Name");
      return;
    }

    if (id) {
      // console.log(params, "id");

      let obj = {
        uuid: loggedInUser,
        source_id: newSource?.value,
        sub_source_id: parseInt(id),
        sub_source_name: bundleName,
        sub_source_description: bundleDes,
        status: 1,
      };
      try {
        const response = await updateSubSource(obj);

        response.data.status === 1
          ? toast.success(response?.data.message)
          : toast.error(response?.data.message);
      } catch (err) {
        console.log("error in updateSubSource: ", err);
        toast.error("***Error***");
      }
    } else {
      let obj = {
        sub_source_name: bundleName,
        sub_source_description: bundleDes,
        source_id: newSource?.value
      };

      try {
        const response = await addSubSource(obj);

        response.data.status === 1
          ? toast.success(response?.data.message)
          : toast.error(response?.data.message);
      } catch (err) {
        console.log("error in addSource: ", err);
        toast.error("***Error***");
      }
    }

    setBundleDes([]);
    setBundleName("");
    setDisablebutton(false)
    // navigate("/authorised/sub-source-listing");
    let toSource = location?.state?.source;
    if (toSource) {
      navigate("/authorised/source-listing");
    }
    else navigate("/authorised/sub-source-listing");
  };

  const handleSourceSelection = (selectedOption) => {
    setNewSource(selectedOption);
  };
  return (
    <>
      <Page
        title="Extramarks | SubSource Information"
        className="main-container myLeadPage datasets_container"
      >
        <div>
          <form onSubmit={(e) => bundleSubmitHandler(e)}>
            <Grid className={classes.cusCard}>
              <>
                <Grid container spacing={3} sx={{ py: "8px" }}>
                  <Grid item xs={12} sm={6} md={6} lg={3} >
                    <Typography className={classes.label}>
                      Select Source<span style={{ color: 'red' }}>*</span>
                    </Typography>
                    <ReactSelect
                      classNamePrefix="select"
                      options={sourceList} // Pass the sourceList array as options
                      value={newSource}
                      onChange={(selectedOption) => handleSourceSelection(selectedOption)}
                    />
                  </Grid>
                  <Grid item md={4} xs={12}>
                    <Grid>
                      <Typography className={classes.label}>
                        Sub-Source Name<span style={{ color: 'red' }}>*</span>
                      </Typography>
                      <input
                        className={classes.inputStyle}
                        name="name"
                        type="text"
                        autoComplete="off"
                        placeholder="Sub-Source Name"
                        maxLength="100"
                        value={bundleName}
                        onChange={(e) => setBundleName(e.target.value)}
                      />
                    </Grid>
                  </Grid>

                  <Grid item md={12} xs={12}>
                    <Grid>
                      <Typography className={classes.label}>
                        Sub-Source Description
                      </Typography>
                      <textarea
                        className={classes.inputStyle}
                        name="name"
                        type="text"
                        rows={7}
                        placeholder="Sub-Source Description"
                        maxLength="500"
                        value={bundleDes?.join("\n")}
                        onChange={(e) =>
                          setBundleDes(e?.target?.value?.split("\n"))
                        }
                      // onKeyDown={(e) => {
                      //   if (e.key === "Enter") {
                      //     e.preventDefault();
                      //     const updatedDescription = [...bundleDes, "• "];
                      //     setBundleDes(updatedDescription);
                      //   }
                      // }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </>
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

              <Button
                className={classes.submitBtn}
                onClick={(e) => {
                  if (!disableButton) {
                    setDisablebutton(true)
                    bundleSubmitHandler(e);
                  }
                }}
                disabled={disableButton}
              >
                Submit
              </Button>
            </Grid>
          </form>
        </div>
      </Page>
    </>
  );
}
