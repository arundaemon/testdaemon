import React, { useEffect, useState } from "react";
import Page from "../Page";
import {
  Grid,
  Typography,
  Button,
  Switch,
  Breadcrumbs,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Paper,
  Box,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import Select from "react-select";
import BredArrow from "../../assets/image/bredArrow.svg";
import { Link, useLocation, useParams } from "react-router-dom";
import _ from "lodash";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {
  createQuotationMapper,
  productFields,
  productsList,
  updateQuotationMapper,
} from "../../config/services/quotationMapping";
import { getUserData } from "../../helper/randomFunction/localStorage";
import { getAllProductList } from "../../config/services/packageBundle";


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
  fieldsTitle: {
    fontSize: "18px",
    fontWeight: "650",
    marginBottom: "10px",
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
    marginTop: "10px",
    borderRadius: "4px !important",
    color: "#ffffff !important",
    padding: "5px 24px !important",
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

export default function QuotationMappingForm() {
  const classes = useStyles();
  const [productList, setProductList] = useState([]);
  const [productName, setProductName] = useState();
  const [quotationLabel, setQuotationLabel] = useState();
  const [hotsList, setHotsList] = useState([]);
  const [calculatedList, setCalculatedList] = useState([]);
  const [hotsOptions, setHotsOptions] = useState([]);
  const [calculatedOptions, setCalculatedOptions] = useState([]);
  const [selectedOtherOptions, setSelectedOtherOptions] = useState([]);
  const [showFields, setShowFields] = useState(false);
  const [visibilityState, setVisibilityState] = useState(true);
  const [flag, setFlag] = useState(false)
  const loginData = getUserData('loginData')
  const uuid = loginData?.uuid
  const location = useLocation();
  const item = location.state?.row;
  const { id } = useParams();
  const navigate = useNavigate();
  const otherOptions = {
    "Add Hardware": false,
    "Add Services": false,
    "Add Software": false,
    "PO Required": false,
  };
  let quotationLabelOptions = [
    { label: "DEMO", value: "DEMO" },
    { label: "ACTUAL", value: "ACTUAL" },
  ];

  const breadcrumbs = [
    <Link
      underline="hover"
      key="1"
      color="inherit"
      to="/authorised/quotation-mapping-list"
      className={classes.breadcrumbsClass}
    >
      Listing
    </Link>,
    <Typography key="3" color="text.primary" fontWeight="600" fontSize="14px">
      Quotation Mapping Form
    </Typography>,
  ];

  const getProductList = () => {
    let params = {
      status: [1],
      uuid:uuid,
      master_data_type: 'package_products'

    };
    getAllProductList(params)
    .then(res => {
      if(res?.data?.master_data_list) {
        res?.data?.master_data_list?.map(list => {
          list.label = list.name
          list.value = list.product_key
        })
        setProductList(res?.data?.master_data_list)
      }
      else{
        console.log('Error: ', res)
      }
    }).catch((err) => console.error(err));
  }

  const handleApplyClick = () => {
    setHotsOptions([]);
    setCalculatedOptions([]);
    setCalculatedList([])
    if (productName?.label && quotationLabel) {
      setShowFields(true);
      productFields(productName?.value)
        .then((res) => {
          const updatedRes = res?.result?.map((item) => ({
            ...item,
            fieldApplicableFor: ''
          }));
          setHotsList(updatedRes);
        })
        .catch((err) => console.error(err));
    }
  };
  const getProductOptions = () => {
    let options = [];
    options = productList?.map((item) => {
      return {
        label: item?.label,
        value: item?.product_key,
        groupCode:item?.group_key,
        groupName: item?.group_name
      };
    });
    return options;
  };

  const handleSelectProductList = (selectedOption) => {
    setProductName(selectedOption);
  };
  const handleQuotationLabel = (selectedOption) => {
    setQuotationLabel(selectedOption);
  };

  const handleOptionChange = (event, setState, selectedOption) => {
    const value = selectedOption.value;
    const isPresent = calculatedOptions?.some((option) => option.value === value)

    if(setState === setHotsOptions && isPresent) {
      toast.error("Please uncheck this field in 'Calculated Fields'")
      return
    }

    setState((prevSelected) => {
      if (event.target.checked) {
        const updatedOption = { ...selectedOption, id: prevSelected.length }; // Add index or ID
        return [...prevSelected, updatedOption];
      } else {
        return prevSelected?.filter((option) => option?.value !== value);
      }
    });
  };

  
  const handleDragEnd = (result, targetState) => {
    if (!result.destination) return;
  
    const reorderedOptions = Array.from(targetState);
    const [reorderedItem] = reorderedOptions.splice(result.source.index, 1);
    reorderedOptions.splice(result.destination.index, 0, reorderedItem);
  
    if (targetState === hotsOptions) {
      setHotsOptions(reorderedOptions);
    } else if (targetState === calculatedOptions) {
      setCalculatedOptions(reorderedOptions);
    }
  };
  
  
  const handleOtherOptionChange = (event) => {
    const { value, checked } = event.target;
    setSelectedOtherOptions((prevSelected) => ({
      ...prevSelected,
      [value]: checked,
    }));
  };

  const handleSubmit = async () => {
    const transformedOptions = Object.keys(selectedOtherOptions).reduce(
      (acc, key) => {
        const transformedKey = key.toLowerCase().replace(/\s+/g, "_");
        acc[transformedKey] = selectedOtherOptions[key];
        return acc;
      },
      {}
    );

    const hotsSelectedOptions = hotsOptions?.map(({ id, ...rest }) => rest);
    const calSelectedOptions = calculatedOptions?.map(({ id, ...rest }) => rest);

    const userDataJSON = localStorage.getItem("userData");
    const loginDataJSON = localStorage.getItem("loginData");
    const userData = JSON.parse(userDataJSON);
    const loginData = JSON.parse(loginDataJSON);
    // const productDetails = {
    //   productCode: productName?.value,
    //   productId: productName?.value,
    // }
    const obj = {
      productName: productName?.label,
      productCode: productName?.value,
      groupCode: productName?.groupCode,
      groupName: productName?.groupName,
      // productDetails:productDetails,
      quotationFor: quotationLabel?.label,
      dependentFields: hotsSelectedOptions,
      calculatedFields: calSelectedOptions,
      isHardware: transformedOptions?.add_hardware ? true : false,
      isSoftware: transformedOptions?.add_software ? true : false,
      isServices: transformedOptions?.add_services ? true : false,
      isPoRequired: transformedOptions?.po_required ? true : false,
      createdByName: userData?.name,
      modifiedByName: userData?.name,
      createdByRoleName: userData?.role,
      createdByProfileName: userData?.crm_profile,
      createdByEmpCode: userData?.employee_code,
      createdByUuid: loginData?.uuid,
      modifiedByRoleName: userData?.role,
      modifiedByProfileName: userData?.crm_profile,
      modifiedByEmpCode: userData?.employee_code,
      modifiedByUuid: loginData?.uuid,
      status: visibilityState ? 1 : 0,
    };
    try {
      let response;

      if (id) {
        obj._id = item?._id;
        response = await updateQuotationMapper(obj);
      } else {
        response = await createQuotationMapper(obj);
      }

      if (response?.data?.statusCode === 0) {
        toast.error("**Error**");
      } else {
        toast.success("Success!");
        navigate("/authorised/quotation-mapping-list");
      }
    } catch (e) {
      console.log("Error : ", e);
    }
  };

  const handleCancel = () => {
    navigate("/authorised/quotation-mapping-list");
  };

  // useEffect(() => {
  //   getProductList();
  // }, []);

  useEffect(() => {
    getProductList();

    if (item) {
      const productObj = {
        label:item?.productName,
        value:item?.productCode,
        groupCode:item?.groupCode,
        groupName:item?.groupName
      }
      const hotsOptionsWithId = item?.dependentFields?.map((option, index) => ({...option,id: index}));
      const calOptionsWithId = item?.calculatedFields?.map((option, index) => ({...option,id: index}));
      setProductName(productObj);
      setQuotationLabel({ label: item?.quotationFor });
      setHotsOptions(hotsOptionsWithId);
      setCalculatedOptions(calOptionsWithId);
      setCalculatedList(hotsOptionsWithId)

      productFields(item?.productCode)
        .then((res) => {
          console.log(res)
          setHotsList(res?.result);
          setShowFields(true);
        })
        .catch((err) => console.error(err));

      const otherOptionsStatus = {
        "Add Hardware": item?.isHardware ? true : false,
        "Add Services": item?.isServices ? true : false,
        "Add Software": item?.isSoftware ? true : false,
        "PO Required": item?.isPoRequired ? true : false,
      };
      setSelectedOtherOptions(otherOptionsStatus);
      setVisibilityState(item?.status);
    }
  }, []);

  useEffect(() => {
    setCalculatedList(hotsOptions)
  }, [hotsOptions])


  const getItemStyle = (isDragging, draggableStyle) => ({
        userSelect: 'none',
        padding: '10px 20px',
        margin: '10px 0px',
        fontSize: '14px',
        background: 'white',
        border: isDragging ? '2px solid #F45E29' : '1px solid #E6E6E6',
        borderRadius: '4px',

        ...draggableStyle
    });

  const handleUnitDuration = (e, hotsOption) => {
    const value = e.target.value
    hotsOption.fieldApplicableFor = value
    setFlag(!flag)
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
        title="Extramarks | QuotationMapper"
        className="main-container myLeadPage datasets_container"
      >
        <div>
          <Grid className={classes.cusCard}>
            <Grid container spacing={3} sx={{ pt: "8px", pb: "24px" }}>
              <Grid item md={6} xs={9}>
                <Typography className={classes.title}>
                  Create Quotation Mapping
                </Typography>
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
                    <Typography className={classes.label}>
                      Product Selection
                    </Typography>
                    <Select
                      name="Product Name"
                      options={getProductOptions()}
                      value={productName}
                      onChange={handleSelectProductList}
                    />
                  </Grid>
                </Grid>

                <Grid item md={4} xs={12}>
                  <Grid>
                    <Typography className={classes.label}>
                      Quotation For
                    </Typography>
                    <Select
                      name="Product Name"
                      options={quotationLabelOptions}
                      value={quotationLabel}
                      onChange={handleQuotationLabel}
                    />
                  </Grid>
                </Grid>

                <Grid
                  item
                  md={4}
                  xs={12}
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <Grid className={classes.btnSection}>
                    <Button
                      className={classes.submitBtn}
                      onClick={handleApplyClick}
                    >
                      Apply
                    </Button>
                  </Grid>
                </Grid>

                {showFields && (
                  <>
                    <Grid item md={12} xs={12}>
                      <FormGroup
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          flexWrap: "wrap",
                        }}
                      >
                        {Object.entries(otherOptions).map(([key, value]) => (
                          <FormControlLabel
                            key={key}
                            control={
                              <Checkbox
                                value={key}
                                checked={selectedOtherOptions[key]}
                                onChange={handleOtherOptionChange}
                                style={{ maxWidth: "100%" }}
                              />
                            }
                            label={key}
                          />
                        ))}
                      </FormGroup>
                    </Grid>
                    <>
                      <Grid item md={6} xs={12}>
                        <Typography className={classes.fieldsTitle} style={{marginLeft: '20px'}}>
                          Hots Fields
                        </Typography>
                        <Box
                          style={{
                            maxHeight: "380px",
                            overflowY: "auto",
                            marginLeft: '20px'
                          }}
                        >
                          <FormGroup style={{
                              maxHeight: "500px",
                              overflow: "auto",
                          }}
                          >
                            {hotsList?.map((option) => (
                              <FormControlLabel
                                key={option.value}
                                control={
                                  <Checkbox
                                    value={option.value}
                                    checked={hotsOptions?.some(
                                      (selectedOption) =>
                                        selectedOption.value === option.value
                                    )}
                                    onChange={(e) =>
                                      handleOptionChange(
                                        e,
                                        setHotsOptions,
                                        option
                                      )
                                    }
                                  />
                                }
                                label={option.label}
                              />
                            ))}
                          </FormGroup>
                        </Box>
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <Typography
                          className={classes.fieldsTitle}
                          style={{ marginLeft: "20px" }}
                        >
                          Selected Options
                        </Typography>

                        <DragDropContext onDragEnd={(result)=> handleDragEnd(result, hotsOptions)}>
                          <Droppable droppableId="hots-options">
                            {(provided) => (
                              <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                style={{
                                  maxHeight: "380px",
                                  overflow: "auto",
                                  margin: "0px 20px"
                                }}
                              >
                                {hotsOptions?.map((hotsOption, index) => (
                                  <Draggable
                                    key={hotsOption?.id}
                                    draggableId={hotsOption?.id?.toString()}
                                    index={index}
                                  >
                                    {(provided, snapshot) => (
                                        <div
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                          style={{...getItemStyle(
                                            snapshot.isDragging,
                                            provided.draggableProps.style
                                            ), display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                          }}
                                        >
                                          <span>{hotsOption.label}</span>
                                          <select style={{border: 'none', background: '#fff'}}  onChange={(e)=> handleUnitDuration(e, hotsOption)} value={hotsOption.fieldApplicableFor}>
                                            <option value="" disabled selected>
                                              Field Applicable For
                                            </option>
                                            <option value="productItemQuantity">Quantity</option>
                                            <option value="productItemDuration">Duration</option>
                                          </select>
                                          
                                        </div>
                                    )}
                                  </Draggable>
                                ))}
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        </DragDropContext>

                      </Grid>
                    </>
                    <>
                      <Grid item md={6} xs={12}>
                        <Typography className={classes.fieldsTitle} style={{marginLeft: '20px'}}>
                          Calculated Fields
                        </Typography>
                        <Box
                          style={{
                            maxHeight: "380px",
                            overflowY: "auto",
                            marginLeft: '20px'
                          }}
                        >
                          <FormGroup style={{
                            maxHeight: "500px",
                            overflow: "auto",
                          }}
                          >
                            {calculatedList?.map((option) => (
                              <FormControlLabel
                                key={option.value}
                                control={
                                  <Checkbox
                                    value={option.value}
                                    checked={calculatedOptions?.some(
                                      (selectedOption) =>
                                        selectedOption.value === option.value
                                    )}
                                    onChange={(e) =>
                                      handleOptionChange(
                                        e,
                                        setCalculatedOptions,
                                        option
                                      )
                                    }
                                  />
                                }
                                label={option.label}
                              />
                            ))}
                          </FormGroup>
                        </Box>
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <Typography
                          className={classes.fieldsTitle}
                          style={{ marginLeft: "20px" }}
                        >
                          Selected Options
                        </Typography>
                        <DragDropContext onDragEnd={(result)=> handleDragEnd(result, calculatedOptions)}>
                          <Droppable droppableId="cal-options">
                            {(provided) => (
                              <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                style={{
                                  maxHeight: "380px",
                                  overflow: "auto",
                                  margin: "0px 20px"
                                }}
                              >
                                {calculatedOptions.map((calculatedOption, index) => (
                                  <Draggable
                                    key={calculatedOption?.id}
                                    draggableId={calculatedOption?.id?.toString()}
                                    index={index}
                                  >
                                    {(provided, snapshot) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        style={getItemStyle(
                                          snapshot.isDragging,
                                          provided.draggableProps.style
                                          )}
                                      >
                                        {calculatedOption.label}
                                      </div>
                                    )}
                                  </Draggable>
                                ))}
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        </DragDropContext>
                      </Grid>
                    </>
                  </>
                )}
              </Grid>
            </>
          </Grid>

          <Grid className={classes.btnSection}>
            <Button
              style={{
                marginRight: "10px",
              }}
              className={classes.submitBtn}
              onClick={handleCancel}
            >
              Cancel
            </Button>

            <Button className={classes.submitBtn} onClick={handleSubmit}>
              Submit
            </Button>
          </Grid>
        </div>
      </Page>
    </>
  );
}
