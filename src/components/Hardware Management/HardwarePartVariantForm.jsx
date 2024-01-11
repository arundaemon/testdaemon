import {
  Alert,
  Breadcrumbs,
  Button,
  Grid,
  Switch,
  Typography
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import _ from 'lodash';
import React, { useEffect, useState } from "react";
import toast from 'react-hot-toast';
import { Link, useLocation, useNavigate } from "react-router-dom";
import Select from "react-select";
import BredArrow from "../../assets/image/bredArrow.svg";
import { createHardwarePartVariant, listProductUom } from "../../config/services/hardwareManagement";
import { listHardwareParts } from "../../config/services/hardwareBundleAndPart";
import { listPackageBundles } from "../../config/services/packageBundle";
import { handleAlphaNumericPaste, handleAlphaNumericText, handleHsnCodeValidation, handleNumberInputFieldWithDecimal, handleNumberKeyDown, handlePaste, itemCodeValidation } from "../../helper/randomFunction";
import Page from "../Page";
import HardwarePartVarientFormTable from "./HardwarePartVarientFormTable";
import { getUserData } from "../../helper/randomFunction/localStorage";

const useStyles = makeStyles((theme) => ({
  cusCard: {
    padding: "18px",
    boxShadow: "0px 0px 8px #00000029",
    borderRadius: "8px",
    margin: "0.5rem 1rem",
  },
  title: {
    fontSize: "20px",
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
    padding: "10px 24px !important",
    "&:hover": {
      color: "#f45e29 !important",
    },
  },
  subBtn: {
    backgroundColor: "#f45e29",
    border: "1px solid #f45e29",
    borderRadius: "4px !important",
    color: "#ffffff !important",
    padding: "5px 14px !important",
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
}));

export default function HardwarePartVariantForm() {
  const classes = useStyles();
  const navigate = useNavigate();
  const [partName, setPartName] = useState(null);
  const [partList, setPartList] = useState([])
  const [packageList, setPackageList] = useState([])
  const [partVariant, setPartVariant] = useState("");
  const [hnsCode, setHnsCode] = useState();
  const [mop, setMop] = useState();
  const [mrp, setMrp] = useState();
  const [description, setDescription] = useState(["• "]);
  const [visibilityState, setVisibilityState] = useState(false);
  const [packageName, setPackageName] = useState(null);
  const [studentNumber, setStudentNumber] = useState("");
  const [teacherNumber, setTeacherNumber] = useState("");
  const [recommended, setRecommended] = useState([]);
  const [finalRecommended, setFinalRecommended] = useState([]);
  const [isUpdate, setisUpdate] = useState(false)
  const [cgst, setCgst] = useState();
  const [sgst, setSgst] = useState();
  const [igst, setIgst] = useState();
  const [productUom, setProductUom] = useState(null);
  const [productUomList, setProductUomList] = useState([])
  // const [loggedInUser] = useState(JSON.parse(localStorage.getItem("loginData"))?.uuid);
  const [cgstError, setCgstError] = useState(false);
  const [itemCodeAlert, setItemCodeAlert] = useState(false);
  const [itemCode, setItemCode] = useState("");
  const loginData = getUserData('loginData')
  const loggedInUser = loginData?.uuid



  const location = useLocation()
  const updateData = location.state?.rowData;
  let edit = false

  const breadcrumbs = [
    <Link
      underline="hover"
      key="1"
      color="inherit"
      to="/authorised/hardware-part-variant-list"
      className={classes.breadcrumbsClass}
    >
      Listing
    </Link>,
    <Typography key="3" color="text.primary" fontWeight="600" fontSize="14px">
      Hardware Part Variant Form
    </Typography>,
  ];




  const getPartList = () => {
    let params = {
      status: [1],
      uuid: loggedInUser
    }
    listHardwareParts(params)
      .then((res) => {
        setPartList(res?.data?.part_list)
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


  const getPartOptions = () => {
    let options = []
    options = partList?.map(item => {
      return {
        label: item?.part_name,
        value: item?.part_id
      };
    });
    return options
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



  const handleSelectPartName = (selectedOption) => {
    setPartName(selectedOption);
  };

  const handleSelectProductUom = (selectedOption) => {
    setProductUom(selectedOption);
  };

  const handleSelectPackageName = (selectedOption) => {
    setPackageName(selectedOption);
  };

  const checkForDuplicate = (value) => {
    let flag = true;
    recommended.forEach((item) => {
      if (value?.package_id == item?.package_id && value?.package_name == item?.package_name && value?.student_count == item?.student_count && value?.teacher_count == item?.teacher_count) {
        flag = false;
      }
    })
    return flag;
  }


  const RecommendedFormValidation = (formdata) => {
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
    };
    edit = false
    if (checkForDuplicate(newObj)) {
      if (RecommendedFormValidation(newObj)) {
        let cloneRecommended = _.cloneDeep(recommended);
        cloneRecommended.push(newObj);
        setRecommended(cloneRecommended);
        setFinalRecommended(cloneRecommended);
        setStudentNumber("")
        setTeacherNumber("")
        setPackageName({})
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
      };
      edit = false
      if (RecommendedFormValidation(newObj)) {
        let cloneRecommended = _.cloneDeep(recommended);
        cloneRecommended.push(newObj);
        setRecommended(cloneRecommended);
        setFinalRecommended(cloneRecommended);
        setStudentNumber("")
        setTeacherNumber("")
        setPackageName({})
      }
    }
    else {
      let cloneRecommended = _.cloneDeep(recommended);
      setRecommended(cloneRecommended);
    }


  };

  const FormValidation = (formdata) => {
    let { part_id, part_variant_name, part_variant_hsn_code, part_variant_mrp, part_variant_mop,item_code,
      part_variant_cgst_rate, part_variant_sgst_rate, part_variant_uom_id } = formdata

    if (!part_id) {
      toast.error('Part Name is Mandatory !')
      return false
    }
    else if (!part_variant_name) {
      toast.error('Part Variant is Mandatory !')
      return false
    }
    else if (!part_variant_hsn_code) {
      toast.error('HSN code is Mandatory !')
      return false
    }
    else if (!part_variant_mrp) {
      toast.error('MRP is Mandatory !')
      return false
    }
    else if (!part_variant_mop) {
      toast.error('MOP is Mandatory !')
      return false
    }
    else if (parseFloat(mrp) < parseFloat(mop)) {
      toast.error('MRP should be greater than MOP !')
      return false
    }
    else if (!part_variant_uom_id) {
      toast.error('Product UOM is Mandatory !')
      return false
    }
    else if (!item_code) {
      toast.error('Product UOM is Mandatory !')
      return false
    }
    else if (!part_variant_cgst_rate) {
      toast.error('CGST is Mandatory !')
      return false
    }
    else if (!part_variant_sgst_rate) {
      toast.error('SGST is Mandatory !')
      return false
    }
    else {
      return true
    }

  }


  const handleSubmit = (e) => {
    e.preventDefault();

    const modifiedPartDes = description.map((element) =>
      element.startsWith("•")
        ? element.replace("• ", '')
        : element
    );
    if (isUpdate) {
      var variantId = updateData?.variant_id
    }
    let paramsObj = {
      part_id: partName?.value.toString(),
      part_variant_name: partVariant,
      part_variant_hsn_code: hnsCode,
      item_code:itemCode,
      part_variant_mrp: mrp,
      part_variant_mop: mop,
      part_variant_cgst_rate: parseFloat(cgst),
      part_variant_sgst_rate: parseFloat(sgst),
      part_variant_igst_rate: parseFloat(igst),
      part_variant_uom_id: productUom?.value,
      part_variant_hw_group_id: 1,
      part_variant_visibility: visibilityState === true ? 1 : 0,
      part_variant_description: modifiedPartDes,
      recommended_for: finalRecommended,
      variant_id: variantId,
      status: 1,
      uuid: loggedInUser
    }
    if (FormValidation(paramsObj)) {
      createHardwarePartVariant(paramsObj)
        .then(res => {
          if (res?.data?.status === 1) {
            toast.success(res?.data?.message)
            navigate('/authorised/hardware-part-variant-list');
          }
          else if (res?.data?.status === 0) {
            let { errorMessage } = res?.data?.message
            toast.error(errorMessage)
          }
          else {
            console.error(res);
          }
        })
    }

  }

  const handleCancelButton = () => {
    navigate('/authorised/hardware-part-variant-list');
  };


  useEffect(() => {
    if (updateData) {
      let data = updateData
      const addLeadingCharacter = (array, characterToAdd) => {
        return array.map((element) => characterToAdd + element);
      };
      setPartVariant(data?.part_variant_name)
      setVisibilityState(data?.part_variant_visibility)
      setHnsCode(data?.part_variant_hsn_code)
      setItemCode(data?.item_code)
      setMop(data?.part_variant_mop)
      setMrp(data?.part_variant_mrp)
      setRecommended(data?.recommended_for)
      setFinalRecommended(data?.recommended_for)
      setDescription(data?.part_variant_description ? addLeadingCharacter(data?.part_variant_description, "• ") : ["• "]);
      setisUpdate(true)

      const filteredArray = getPartOptions()?.filter(obj => obj.label === updateData?.part_name);
      if (filteredArray?.length) {
        let data = filteredArray?.[0]
        setPartName(data);
      }

      let productUomObj = {
        label: `${data?.part_variant_uom_code}-${data?.part_variant_uom_name}`,
        value: data?.part_variant_uom_id
      }
      setProductUom(productUomObj)
      setCgst(data?.part_variant_cgst_rate)
      setSgst(data?.part_variant_sgst_rate)
      setIgst(parseFloat(data?.part_variant_cgst_rate) * 2)


    }
  }, [updateData, partList, packageList]);


  useEffect(() => {
    getPartList()
    getPackageList()
    getProductUom()
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
    edit = true
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

  const handleItemCodeChange = (e) => {
    let value = e?.target?.value
    value = value.toUpperCase();
    setItemCode(value)
    if (value.length > 30) {
      setItemCodeAlert(true)
    }
    else {
      setItemCodeAlert(false)
    }
  }

  const handleDecimalsOnValue = (value) => {
    const regex = /([0-9]*[\.|\,]{0,1}[0-9]{0,2})/s;
    return value.match(regex)[0];
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
        {/* <div>{shw_loader ? <LinearProgress /> : ""}</div> */}
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
                // onChange={(e) => console.log(e.target.checked)}
                />
              </Grid>
            </Grid>

            <>
              <Grid container spacing={3} sx={{ py: "8px" }}>
                <Grid item md={4} xs={12}>
                  <Grid>
                    <Typography className={classes.label}>Part Name<span style={{ color: 'red' }}>*</span></Typography>
                    <Select
                      name="Part Name"
                      options={getPartOptions()}
                      value={partName}
                      onChange={handleSelectPartName}
                    />
                  </Grid>
                </Grid>
                <Grid item md={4} xs={12}>
                  <Grid>
                    <Typography className={classes.label}>
                      Part Variant<span style={{ color: 'red' }}>*</span>
                    </Typography>
                    <input
                      className={classes.inputStyle}
                      name="Part Variant"
                      maxLength="100"
                      type="text"
                      placeholder="Part Variant"
                      value={partVariant}
                      onChange={(e) => setPartVariant(e?.target?.value)}
                    />
                  </Grid>
                </Grid>
                <Grid item md={4} xs={12}>
                  <Grid>
                    <Typography className={classes.label}>HSN Code<span style={{ color: 'red' }}>*</span></Typography>
                    <input
                      className={classes.inputStyle}
                      name="HSN Code"
                      type="number"
                      placeholder="HSN Code"
                      maxLength="100"
                      value={hnsCode}
                      onChange={(e) => setHnsCode(e?.target?.value)}
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
                      type="number"
                      placeholder="MRP"
                      maxLength="100"
                      value={mrp}
                      onChange={(e) => setMrp(e?.target?.value)}
                      onKeyDown={handleNumberKeyDown}
                      onPaste={handlePaste}
                    />
                  </Grid>
                </Grid>


                <Grid item md={4} xs={12}>
                  <Grid>
                    <Typography className={classes.label}>MOP<span style={{ color: 'red' }}>*</span></Typography>
                    <input
                      className={classes.inputStyle}
                      name="MOP"
                      type="number"
                      placeholder="MOP"
                      maxLength="100"
                      value={mop}
                      onChange={(e) => setMop(e?.target?.value)}
                      onKeyDown={handleNumberKeyDown}
                      onPaste={handlePaste}
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
                    <Typography className={classes.label}>Item Code<span style={{ color: 'red' }}>*</span></Typography>
                    <input
                      className={classes.inputStyle}
                      name="CGST Rate"
                      type="text"
                      placeholder="Item Code"
                      value={itemCode}
                      onChange={handleItemCodeChange}
                      onKeyDown={itemCodeValidation}
                      onPaste={handleAlphaNumericPaste}

                    />
                    {itemCodeAlert && (
                      <Alert severity="error">
                        Item Code must be between 2 to 30 characters of length.
                      </Alert>
                    )}

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
                    <Typography className={classes.label}>
                      Description
                    </Typography>
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
            <hr
              style={{
                color: "#DEDEDE",
                margin: "10px 10px 20px 10px",
              }}
            />
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
                      placeholder={packageName ? packageName : "Select..."}
                      value={packageName}
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
                      type="number"
                      placeholder="No. of Students"
                      value={studentNumber}
                      onChange={(e) => setStudentNumber(e?.target?.value)}
                      onKeyDown={handleNumberKeyDown}
                      onPaste={handlePaste}
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
                      type="number"
                      placeholder="No. of Teachers"
                      value={teacherNumber}
                      onChange={(e) => setTeacherNumber(e?.target?.value)}
                      onKeyDown={handleNumberKeyDown}
                      onPaste={handlePaste}
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
                className={classes.subBtn}
                onClick={addRecommended}
                disabled={recommended?.length === 0 ? true : false}
              >
                <span style={{}}>Add More</span>
              </Button>

              <Button
                className={classes.subBtn}
                onClick={saveRecommended}
                disabled={recommended?.length > 0 ? true : false}
              >
                Save
              </Button>
            </Grid>

            <HardwarePartVarientFormTable recommended={recommended} handleDeleteRow={handleDeleteRow} handleEditRow={handleEditRow} />
          </Grid>

          <Grid className={classes.btnSection}>
            <Button
              style={{
                marginRight: "10px",
              }}
              className={classes.submitBtn}
              onClick={handleCancelButton}
            >
              Cancel
            </Button>

            <Button
              className={classes.submitBtn}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Grid>
        </div>

      </Page>
    </>
  );
}
