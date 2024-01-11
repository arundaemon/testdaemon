import React, { useEffect, useState } from "react";
import Page from "../Page";
import {
  Grid,
  Typography,
  Button,
  Switch,
  Alert
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import Select from "react-select";
import HardwarePartVarientFormTable from "./HardwarePartVarientFormTable";
import _, { isNaN } from 'lodash';
import { toast } from "react-hot-toast";
import { listAllPackages, listProductUom } from "../../config/services/hardwareManagement";
import { listHardwareBundle } from "../../config/services/hardwareBundleAndPart";
import { handleHsnCodeValidation, handleNumberInputFieldWithDecimal, handleNumberKeyDown, handlePaste } from "../../helper/randomFunction";
import { listPackageBundles, masterDataList } from "../../config/services/packageBundle";
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

export default function HardwareBundleFormInformation({ getBundleInfo, updateInformation }) {
  const classes = useStyles();
  const [bundleName, setBundleName] = useState(null);
  const [bundleList, setBundleList] = useState([])
  const [packageList, setPackageList] = useState([])
  const [bundleVariant, setBundleVariant] = useState("");
  const [hnsCode, setHnsCode] = useState("");
  const [mop, setMop] = useState("");
  const [mrp, setMrp] = useState("");
  const [description, setDescription] = useState(['• ']);
  const [visibilityState, setVisibilityState] = useState(false);
  const [packageName, setPackageName] = useState("");
  const [studentNumber, setStudentNumber] = useState("");
  const [teacherNumber, setTeacherNumber] = useState("");
  const [recommended, setRecommended] = useState([]);
  const [finalRecommended, setFinalRecommended] = useState([]);
  const [cgst, setCgst] = useState();
  const [sgst, setSgst] = useState();
  const [igst, setIgst] = useState();
  const [productUom, setProductUom] = useState(null);
  const [productUomList, setProductUomList] = useState([])
  // const [loggedInUser] = useState(JSON.parse(localStorage.getItem("loginData"))?.uuid);
  const loginData = getUserData('loginData')
  const loggedInUser = loginData?.uuid
  const [cgstError, setCgstError] = useState(false);
  const [modeList, setModeList] = useState([])
  const [modeName, setModeName] = useState(null)
  const updateData = updateInformation
  let edit = false;


  const getBundleList = () => {
    let params = {
      status: [1],
      uuid: loggedInUser
    }
    listHardwareBundle(params)
      .then((res) => {
        setBundleList(res?.data?.bundle_list)
      })
      .catch(
        err => console.error(err)
      )
  }


  const getPackageList = () => {
    let params = {
      status: [1],
      uuid: loggedInUser
    }
    listPackageBundles(params)
      .then((res) => {
        let list = res?.data?.package_list_details
        let dataArray = list?.map(obj => ({ label: obj?.package_information?.package_name, value: obj?.package_information?.package_id, }))
        setPackageList(dataArray)
      }).catch(err => console.error(err))

  }

  const getProductUom = () => {
    let params = {
      status: [1],
      uuid: loggedInUser
    }
    listProductUom(params)
      .then((res) => {
        setProductUomList(res?.data?.uom_details)
      })
      .catch(
        err => console.error(err)
      )
  }

  const getModeList = () => {
    let params = {
      status: [1, 2, 3],
      master_data_type: "escplus_modes",
      uuid: loggedInUser
    }
    masterDataList(params)
      .then((res) => {
        let list = res?.data?.master_data_list
        setModeList(list)
      }).catch(err => console.error(err))

  }



  const getProductUomOptions = () => {
    let options = []
    options = productUomList?.map(item => {
      return {
        label: `${item?.uom_code}-${item?.uom_name}`,
        value: item?.uom_id

      };
    });
    return options
  }


  const getBundleOptions = () => {
    let options = []

    options = bundleList?.map(item => {
      return {
        label: item?.bundle_name,
        value: item?.bundle_id
      };
    });
    return options
  }


  const getModeOptions = () => {
    let options = []

    options = modeList?.map(item => {
      return {
        label: item?.name,
        value: item?.id
      };
    });
    return options
  }


  const handleSelectBundleName = (selectedOption) => {
    setBundleName(selectedOption);
  };

  const handleSelectPackageName = (selectedOption) => {
    setPackageName(selectedOption);
  };

  const handleSelectModeofESC = (selectedOption) => {
    setModeName(selectedOption)
  }


  const handleSelectProductUom = (selectedOption) => {
    setProductUom(selectedOption);
  };

  const checkForDuplicate = (value) => {
    let flag = true;
    recommended.forEach((item) => {
      if (value?.package_id == item?.package_id && value?.package_name == item?.package_name && value?.student_count == item?.student_count && value?.teacher_count == item?.teacher_count && value?.escplus_mode
        == item?.escplus_mode && value?.escplus_mode_id == item?.escplus_mode_id) {
        flag = false;
      }
    })
    return flag;
  }

  const FormValidation = (formdata) => {
    let { package_id, student_count, teacher_count } = formdata

    if (!package_id && !student_count && !teacher_count) {
      return false
    }
    else if (student_count || teacher_count) {
      if (!package_id) {
        toast.error('Package Name is Mandatory !')
        return false
      }
      else return true
    }
    else {
      return true
    }
  }

  const addRecommended = () => {
    let newObj = {
      package_id: packageName?.value,
      package_name: packageName?.label,
      student_count: isNaN(parseInt(studentNumber)) ? 0 : parseInt(studentNumber),
      teacher_count: isNaN(parseInt(teacherNumber)) ? 0 : parseInt(teacherNumber),
      escplus_mode_id: modeName?.value,
      escplus_mode: modeName?.label,
    };
    edit = false
    if (checkForDuplicate(newObj)) {
      if (FormValidation(newObj)) {
        let cloneRecommended = _.cloneDeep(recommended);
        cloneRecommended.push(newObj);
        setRecommended(cloneRecommended);
        setFinalRecommended(cloneRecommended);
        setStudentNumber("")
        setTeacherNumber("")
        setPackageName({})
        setModeName(null)
      }
    }
    else {
      toast.error("This Condition already exists")
    }

  };


  const saveRecommended = () => {
    if (recommended.length === 0) {
      let newObj = {
        package_id: parseInt(packageName?.value),
        package_name: packageName?.label,
        student_count: isNaN(parseInt(studentNumber)) ? 0 : parseInt(studentNumber),
        teacher_count: isNaN(parseInt(teacherNumber)) ? 0 : parseInt(teacherNumber),
        escplus_mode_id: modeName?.value,
        escplus_mode: modeName?.label,
      };
      edit = false
      if (FormValidation(newObj)) {
        let cloneRecommended = _.cloneDeep(recommended);
        cloneRecommended.push(newObj);
        setRecommended(cloneRecommended);
        setFinalRecommended(cloneRecommended);
        setStudentNumber("")
        setTeacherNumber("")
        setPackageName({})
        setModeName(null)
      }
    }
    else {
      let cloneRecommended = _.cloneDeep(recommended);
      setRecommended(cloneRecommended);
    }
  };


  useEffect(() => {

    const modifiedBundleDes = description.map((element) =>
      element.startsWith("•")
        ? element.replace("• ", '')
        : element
    );

    let paramsObj = {
      bundle_id: bundleName?.value,
      bundle_variant_name: bundleVariant,
      bundle_hsn_code: hnsCode,
      bundle_variant_mrp: mrp,
      bundle_variant_mop: mop,
      visibility: visibilityState === true ? 1 : 0,
      bundle_variant_cgst_rate: parseFloat(cgst),
      bundle_variant_sgst_rate: parseFloat(sgst),
      bundle_variant_igst_rate: parseFloat(igst),
      bundle_variant_uom_id: productUom?.value,
      bundle_variant_description: modifiedBundleDes,
      recommended_for: finalRecommended,
      status: 1
    }
    getBundleInfo(paramsObj)
  }, [bundleName, bundleVariant, hnsCode, mrp, mop, visibilityState, description, recommended, cgst, sgst, igst, productUom])


  useEffect(() => {
    if (updateData) {
      let data = updateData
      const addLeadingCharacter = (array, characterToAdd) => {
        return array.map((element) => characterToAdd + element);
      };
      setBundleVariant(data?.bundle_variant_name)
      // setVisibilityState(data?.visibility)
      setVisibilityState(data?.visibility === 1 ? true : false)
      setHnsCode(data?.bundle_variant_hsn_code)
      setMop(data?.bundle_variant_mop)
      setMrp(data?.bundle_variant_mrp)
      setRecommended(data?.recommended_for)
      setFinalRecommended(data?.recommended_for)
      setDescription(data?.bundle_variant_description ? addLeadingCharacter(data?.bundle_variant_description, "• ") : ["• "]);

      const filteredArray = getBundleOptions()?.filter(obj => obj.label === updateData?.bundle_name);
      if (filteredArray?.length) {
        let data = filteredArray?.[0]
        setBundleName(data);
      }
      let productUomObj = {
        label: `${data?.bundle_variant_uom_code}-${data?.bundle_variant_uom_name}`,
        value: data?.bundle_variant_uom_id
      }
      setProductUom(productUomObj)
      setCgst(data?.bundle_variant_cgst_rate)
      setSgst(data?.bundle_variant_sgst_rate)
      setIgst(parseFloat(data?.bundle_variant_cgst_rate) * 2)


    }
  }, [updateData, bundleList, packageList]);

  useEffect(() => {
    getBundleList()
    getPackageList()
    getProductUom()
    getModeList()
  }, []);


  const handleDeleteRow = (rowData) => {
    const arrayAfterDelete = recommended?.filter((element) => {
      return element?.package_id !== rowData?.package_id || element?.student_count !== rowData?.student_count || element?.teacher_count !== rowData?.teacher_count;
    });
    setRecommended(arrayAfterDelete)
    setFinalRecommended(arrayAfterDelete);
    setStudentNumber("")
    setTeacherNumber("")
    setPackageName({})
    setModeName({})
  }

  const handleEditRow = (rowData) => {
    let data = rowData
    const newObj = {
      label: data?.package_name,
      value: data?.package_id
    }
    if (edit === false) {
      const arrayAfterDelete = finalRecommended?.filter((element) => {
        return element?.package_id !== rowData?.package_id || element?.student_count !== rowData?.student_count || element?.teacher_count !== rowData?.teacher_count;
      });
      setRecommended(arrayAfterDelete)
    }
    else {
      const arrayAfterDelete = recommended?.filter((element) => {
        return element?.package_id !== rowData?.package_id || element?.student_count !== rowData?.student_count || element?.teacher_count !== rowData?.teacher_count;
      });
      setRecommended(arrayAfterDelete)
    }
    setStudentNumber(data?.student_count)
    setTeacherNumber(data?.teacher_count)
    setPackageName(newObj)
    const ModeObj = {
      label: data?.escplus_mode,
      value: data?.escplus_mode_id 
    }
    setModeName(ModeObj)

  }

  const handleOnTaxChange = (e) => {
    const input = e?.target?.value;
    if (input.includes("e")) {
      e.preventDefault();
    }
    const final_value = handleDecimalsOnValue(input)
    const igst = (parseFloat(final_value) * 2);

    if (final_value >= 0 && final_value <= 15) {
      setCgst(final_value);
      setSgst(final_value)
      setIgst(igst)
      setCgstError(false);
    }
    else {
      setCgstError(true);
    }
  }

  const handleDecimalsOnValue = (value) => {
    const regex = /([0-9]*[\.|\,]{0,1}[0-9]{0,2})/s;
    return value.match(regex)[0];
  }
  return (
    <Page
      title="Extramarks | Hardware Information"
      className="main-container myLeadPage datasets_container"
    >
      <div>
        <Grid className={classes.cusCard}>
          <Grid container spacing={3} sx={{ pt: "8px", pb: "24px" }}>
            <Grid item md={6} xs={9}>
              <Typography className={classes.title}>Information</Typography>
            </Grid>
            <Grid
              item
              md={6}
              xs={3}
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <span style={{ marginRight: "10px", marginLeft: "10px" }}>
                Visibility
              </span>
              <Switch
                checked={visibilityState}
                onChange={(e) => setVisibilityState(e?.target?.checked)}
              />
            </Grid>
          </Grid>

          <>
            <Grid container spacing={3} sx={{ py: "8px" }}>
              <Grid item md={4} xs={12}>
                <Grid>
                  <Typography className={classes.label}>Bundle Name<span style={{ color: 'red' }}>*</span></Typography>
                  <Select
                    name="Part Name"
                    options={getBundleOptions()}
                    value={bundleName}
                    onChange={handleSelectBundleName}
                  />
                </Grid>
              </Grid>
              <Grid item md={4} xs={12}>
                <Grid>
                  <Typography className={classes.label}>
                    Bundle Variant<span style={{ color: 'red' }}>*</span>
                  </Typography>
                  <input
                    className={classes.inputStyle}
                    name="Bundle Variant"
                    type="text"
                    placeholder="Bundle Variant"
                    maxLength="100"
                    value={bundleVariant}
                    onChange={(e) => setBundleVariant(e.target.value)}
                  />
                </Grid>
              </Grid>
              <Grid item md={4} xs={12}>
                <Grid>
                  <Typography className={classes.label}>HSN Code<span style={{ color: 'red' }}>*</span></Typography>
                  <input
                    className={classes.inputStyle}
                    name="HNS Code"
                    type="number"
                    placeholder="HNS Code"
                    maxLength="100"
                    value={hnsCode}
                    onChange={(e) => setHnsCode(e.target.value)}
                    onKeyDown={handleHsnCodeValidation}
                    onPaste={handlePaste}
                  />
                </Grid>
              </Grid>

              <Grid item md={4} xs={12}>
                <Grid>
                  <Typography className={classes.label}>MRP<span style={{ color: 'red' }}>*</span></Typography>
                  <input
                    className={classes.inputStyle}
                    name="MRP"
                    type="text"
                    maxLength="100"
                    placeholder="MRP"
                    onKeyDown={handleNumberInputFieldWithDecimal}
                    value={mrp}
                    onChange={(e) => setMrp(e.target.value)}
                  />
                </Grid>
              </Grid>



              <Grid item md={4} xs={12}>
                <Grid>
                  <Typography className={classes.label}>MOP<span style={{ color: 'red' }}>*</span></Typography>
                  <input
                    className={classes.inputStyle}
                    name="MOP"
                    type="text"
                    maxLength="100"
                    placeholder="MOP"
                    onKeyDown={handleNumberInputFieldWithDecimal}
                    value={mop}
                    onChange={(e) => setMop(e.target.value)}
                  />
                </Grid>
              </Grid>


              <Grid item md={4} xs={12}>
                <Grid>
                  <Typography className={classes.label}>Product UOM<span style={{ color: 'red' }}>*</span></Typography>
                  <Select
                    name="Product UOM"
                    options={getProductUomOptions()}
                    value={productUom}
                    onChange={handleSelectProductUom}
                  />
                </Grid>
              </Grid>


              <Grid item md={4} xs={12}>
                <Grid>
                  <Typography className={classes.label}>CGST Rate %<span style={{ color: 'red' }}>*</span></Typography>
                  <input
                    className={classes.inputStyle}
                    name="CGST Rate"
                    type="number"
                    placeholder="CGST Rate"
                    value={cgst}
                    onChange={handleOnTaxChange}
                    onKeyDown={handleNumberInputFieldWithDecimal}
                    onPaste={handlePaste}

                  />
                  {cgstError && (
                    <Alert severity="error">
                      CGST Rate must be a number between 0 and 15.
                    </Alert>
                  )}

                </Grid>
              </Grid>


              <Grid item md={4} xs={12}>
                <Grid>
                  <Typography className={classes.label}>SGST Rate %<span style={{ color: 'red' }}>*</span></Typography>
                  <input
                    className={classes.inputStyle}
                    style={{ background: "#ebebeb" }}
                    name="SGST Rate"
                    type="number"
                    placeholder="SGST Rate"
                    value={sgst}
                    onKeyDown={handleNumberKeyDown}
                    onPaste={handlePaste}
                    disabled={true}
                  />
                </Grid>
              </Grid>

              <Grid item md={4} xs={12}>
                <Grid>
                  <Typography className={classes.label}>IGST Rate %<span style={{ color: 'red' }}>*</span></Typography>
                  <input
                    className={classes.inputStyle}
                    style={{ background: "#ebebeb" }}
                    name="IGST Rate"
                    type="number"
                    placeholder="IGST Rate"
                    maxLength="100"
                    disabled={true}
                    value={igst}
                  />
                </Grid>
              </Grid>


              <Grid item md={12} xs={12}>
                <Grid>
                  <Typography className={classes.label}>Description</Typography>
                  <textarea
                    className={classes.inputStyle}
                    name="Description"
                    type="text"
                    placeholder="Description"
                    maxLength="500"
                    rows={5}
                    value={description?.join('\n')}
                    onChange={(e) => setDescription(e?.target?.value?.split('\n'))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const updatedDescription = [...description, "• "];
                        setDescription(updatedDescription);
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </>

          <Grid container spacing={3} sx={{ pt: "8px", pb: "24px" }}>
            <Grid item xs={12}>
              <Typography className={classes.title}>Recommended</Typography>
            </Grid>
          </Grid>

          <>
            <Grid container spacing={3} sx={{ py: "8px" }}>
              <Grid item md={4} xs={12}>
                <Grid>
                  <Typography className={classes.label}>
                    Package Name
                  </Typography>
                  <Select
                    name="Part Name"
                    options={packageList}
                    value={packageName}
                    placeholder={packageName ? packageName : 'Select...'}
                    onChange={handleSelectPackageName}
                  />
                </Grid>
              </Grid>
              <Grid item md={4} xs={12}>
                <Grid>
                  <Typography className={classes.label}>
                    No. of Students
                  </Typography>
                  <input
                    className={classes.inputStyle}
                    name="No. of Students"
                    type="text"
                    placeholder="No. of Students"
                    onKeyDown={handleNumberKeyDown}
                    value={studentNumber}
                    onChange={(e) => setStudentNumber(e.target.value)}
                  />
                </Grid>
              </Grid>
              <Grid item md={4} xs={12}>
                <Grid>
                  <Typography className={classes.label}>
                    No. of Teachers
                  </Typography>
                  <input
                    className={classes.inputStyle}
                    name="No. of Teachers"
                    type="text"
                    placeholder="No. of Teachers"
                    onKeyDown={handleNumberKeyDown}
                    value={teacherNumber}
                    onChange={(e) => setTeacherNumber(e.target.value)}
                  />
                </Grid>
              </Grid>

              <Grid item md={4} xs={12}>
                <Grid>
                  <Typography className={classes.label}>
                    Mode Of ESC
                  </Typography>
                  <Select
                    name="Part Name"
                    options={getModeOptions()}
                    value={modeName}
                    placeholder={modeName ? modeName : 'Select...'}
                    onChange={handleSelectModeofESC}
                  />
                </Grid>
              </Grid>




            </Grid>
          </>
          <Grid className={classes.btnSection}>
            <Button
              style={{
                marginRight: "10px",
              }}
              className={classes.submitBtn}
              onClick={addRecommended}
              disabled={recommended?.length === 0 ? true : false}
            >
              Add More
            </Button>

            <Button
              className={classes.submitBtn}
              onClick={saveRecommended}
              disabled={recommended?.length > 0 ? true : false}

            >
              Save
            </Button>
          </Grid>

          <HardwarePartVarientFormTable recommended={recommended} handleDeleteRow={handleDeleteRow} handleEditRow={handleEditRow} />
        </Grid>
      </div>


    </Page>
  );
}
