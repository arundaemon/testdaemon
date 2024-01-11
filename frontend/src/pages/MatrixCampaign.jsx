
import React, { useState, useEffect } from "react";
import Page from "../components/Page";
import { Grid, Typography, Button, Breadcrumbs } from "@mui/material";
import { makeStyles } from "@mui/styles";
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import BredArrow from "../assets/image/bredArrow.svg";
import {
  addCampaign,
  updateCampaign
} from "../config/services/packageBundle";
import { toast } from "react-hot-toast";
import { getUserData } from "../helper/randomFunction/localStorage";

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

export default function MatrixCampaign() {
  const location = useLocation();
  const item = location.state?.row;
  const { id } = useParams();
  const classes = useStyles();
  const [bundleName, setBundleName] = useState("");
  const [bundleDes, setBundleDes] = useState([]);
  const [disableButton, setDisablebutton] = useState(false)
  const loginData = getUserData('loginData')
  const uuid = loginData?.uuid
  const navigate = useNavigate();

  useEffect(() => {
    const addLeadingCharacter = (array, characterToAdd) => {
      return array.map((element) => characterToAdd + element);
    };
    setBundleName(item?.campaign_name);
    setBundleDes(item?.campaign_description);
  }, []);



  const bundleCancelHandler = () => {
    navigate("/authorised/matrix-campaign-list");
  };

  const bundleSubmitHandler = async (e) => {
    e.preventDefault();
    if (!bundleName) {
      setDisablebutton(false)
      toast.error('Campaign Name is Required!')
      return
    }

    if (id) {
      let obj = {
        campaign_id: parseInt(id),
        campaign_name: bundleName,
        campaign_description: bundleDes,
        status: 1,
        uuid:uuid
      };
      try {
        const response = await updateCampaign(obj);
        if (response.data.status === 1) {
          toast.success(response?.data.message)
          setBundleDes([]);
          setBundleName("");
          navigate("/authorised/matrix-campaign-list");
        }
        else {
          toast.dismiss()
          toast.error(response?.data.message)
        }
      }
      catch (err) {
        console.log("error in updateCampaign: ", err);
        toast.error("***Error***");
      }

    }
    else {
      let obj = {
        campaign_name: bundleName,
        campaign_description: bundleDes,
        uuid:uuid
      };

      try {
        const response = await addCampaign(obj);

        if (response.data.status === 1) {
          toast.success(response?.data.message)
          setBundleDes([]);
          setBundleName("");
          navigate("/authorised/matrix-campaign-list");
        }
        else {
          toast.dismiss()
          toast.error(response?.data.message)
        }
      }
      catch (err) {
        console.log("error in addCampaign: ", err);
        toast.error("***Error***");
      }
    }
    setDisablebutton(false)
  };

  return (
    <>

      <Page
        title="Extramarks | Campaign Information"
        className="main-container myLeadPage datasets_container"
      >
        <div>
          <form onSubmit={(e) => bundleSubmitHandler(e)}>
            <Grid className={classes.cusCard}>


              <>
                <Grid container spacing={3} sx={{ py: "8px" }}>
                  <Grid item md={4} xs={12}>
                    <Grid>
                      <Typography className={classes.label}>
                        Campaign Name<span style={{ color: 'red' }}>*</span>
                      </Typography>
                      <input
                        className={classes.inputStyle}
                        name="name"
                        type="text"
                        placeholder="Name"
                        maxLength="200"
                        value={bundleName}
                        onChange={(e) => setBundleName(e.target.value.replace(/[^a-zA-Z0-9\s]|(?:\s)\s/g, ''))}
                      />
                    </Grid>
                  </Grid>

                  <Grid item md={12} xs={12}>
                    <Grid>
                      <Typography className={classes.label}>
                        Campaign Description
                      </Typography>
                      <textarea
                        className={classes.inputStyle}
                        name="name"
                        type="text"
                        rows={7}
                        placeholder="Campaign Description"
                        maxLength="500"
                        value={bundleDes?.join("\n")}
                        onChange={(e) =>
                          setBundleDes(e?.target?.value?.split("\n"))
                        }
                      // onKeyDown={(e) => {
                      //   if (e.key === "Enter") {
                      //     e.preventDefault();
                      //     const updatedDescription = [...bundleDes];
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
