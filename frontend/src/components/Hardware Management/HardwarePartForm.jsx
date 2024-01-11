import React, { useState, useEffect, useRef } from "react";
import Page from "../Page";
import {
  Grid,
  Typography,
  Button,
  Breadcrumbs,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import BredArrow from "../../assets/image/bredArrow.svg";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { addHardwarePart, updateHardwarePart } from "../../config/services/hardwareBundleAndPart";
import { toast } from "react-hot-toast";
import { getUserData } from "../../helper/randomFunction/localStorage";


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
}));

export default function HardwarePartForm() {
  const location = useLocation();
  const item = location.state?.row;
  const { id } = useParams();
  const classes = useStyles();
  const [partName, setPartName] = useState("");
  const [partDes, setPartDes] = useState(['• ']);
  const navigate = useNavigate()
  const loginData=getUserData('loginData')
  const uuid = loginData?.uuid

  useEffect(() => {
    const addLeadingCharacter = (array, characterToAdd) => {
      return array.map((element) => characterToAdd + element);
    };
    setPartName(item?.part_name);
    setPartDes(item?.part_description ? addLeadingCharacter(item.part_description, "• ") : ["• "]);
  }, []);
  
  const breadcrumbs = [
    <Link
      underline="hover"
      key="1"
      color="inherit"
      to="/authorised/hardware-part-list"
      className={classes.breadcrumbsClass}
    >
      Listing
    </Link>,
    <Typography key="3" color="text.primary" fontWeight="600" fontSize="14px">
      HardWare Part Form
    </Typography>,
  ];

  const partCancelHandler = () => {
    navigate('/authorised/hardware-part-list')

  }


  const partSubmitHandler = async(e) => {
    e.preventDefault()
    if(!partName) {
      toast.error('Part Name is required!')
      return
    }
    const newId = parseInt(id)

    const modifiedPartDes = partDes.map((element) =>
    element.startsWith("•")
      ? element.replace("• ", '')
      : element
  );

    if(id) {
      let obj = {
        part_id: newId,
        part_name: partName,
        part_description: modifiedPartDes,
        status: 1,
        uuid:uuid
      }
  
      try {
        const response = await updateHardwarePart(obj)
        response.data.status === 1? toast.success(response?.data.message) : toast.error(response?.data.message)
      }
      catch (err) {
        console.log("error in updateHardwarePart: ", err);
        toast.error("***Error***")
      }
    }
    else {
      let obj = {
        part_name: partName,
        part_description: modifiedPartDes,
        uuid:uuid
      }

      try {
        const response = await addHardwarePart(obj)
        response.data.status === 1? toast.success(response?.data.message) : toast.error(response?.data.message)

      }
      catch (err) {
        console.log("error in addHardwarePart: ", err);
        toast.error("***Error***")
      }
    }
    
    setPartDes(["• "])
    setPartName("")
    navigate('/authorised/hardware-part-list')
  }

  return (
    <>
      <Breadcrumbs
        className={`listing-breadcrumbs ${classes.breadcrumbsBar}`}
        separator={<img src={BredArrow} />}
        aria-label="breadcrumb"
      >
        {breadcrumbs}
      </Breadcrumbs>
      <Page
        title="Extramarks | Hardware Information"
        className="main-container myLeadPage datasets_container"
      >
        <div>
        <form onSubmit={(e) => partSubmitHandler(e)}>
          <Grid className={classes.cusCard}>
            <Grid container spacing={3} sx={{ pt: "8px", pb: "24px" }}>
              <Grid item xs={12}>
                <Typography className={classes.title}>Information</Typography>
              </Grid>
            </Grid>

            <>
              <Grid container spacing={3} sx={{ py: "8px" }}>
                <Grid item md={4} xs={12}>
                  <Grid>
                    <Typography className={classes.label}>Part Name<span style={{ color: 'red' }}>*</span></Typography>
                    <input
                      className={classes.inputStyle}
                      name="name"
                      type="text"
                      placeholder="Name"
                      maxLength={100}
                      value={partName}
                      onChange={(e) => setPartName(e.target.value)}
                    />
                  </Grid>
                </Grid>

                <Grid item md={12} xs={12}>
                  <Grid>
                    <Typography className={classes.label}>
                      Description
                    </Typography>
                    <textarea
                      className={classes.inputStyle}
                      name="name"
                      type="text"
                      rows={7}
                      placeholder="Name"
                      maxLength={500}
                      value={partDes?.join("\n")}
                      onChange={(e) =>
                        setPartDes(e?.target?.value?.split("\n"))
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const updatedDescription = [...partDes, "• "];
                          setPartDes(updatedDescription);
                        }
                      }}
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
              onClick={() => partCancelHandler()}
            >
              Cancel
            </Button>

            <Button
              className={classes.submitBtn}
              type="submit"
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
