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
  TextField,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import Select from "react-select";
import BredArrow from "../../assets/image/bredArrow.svg";
import { Link, useLocation, useParams } from "react-router-dom";
import _ from "lodash";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import DisplayFields from "./DisplayFields";
import { getMeasuresList } from "../../config/services/reportEngineApis";
import { createApprovalMatrix, updateApprovalMatrix } from "../../config/services/approvalMatrix";
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
import { getRolesList } from "../../config/services/hrmServices";
import { productsList } from "../../config/services/quotationMapping";
import { getAllProductList } from "../../config/services/packageBundle";
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

export default function AddApprovalMatrix(){
  const classes = useStyles();
  const navigate = useNavigate()
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedRule, setSelectedRule] = useState('');
  const [selectedApprovalType, setSelectedApprovalType] = useState('');
  const [showFields, setShowFields] = useState(false); 
  const [currentRole] = useState(JSON.parse(localStorage.getItem('userData'))?.crm_role);
  const [fieldsList, setFieldsList] = useState([]);
  const [displayFields, setDisplayFields] = useState([]);
  const location = useLocation();
  const item = location.state?.row;
  const { id } = useParams();
  const [rowDropdownList, setRowDropdownList]= useState([])
  const [products, setProducts] = useState([])
  const loginData = getUserData('loginData')
  const uuid = loginData?.uuid
  

  const rules = [
    { value: 'flat hierarchy', label: 'Flat Hierarchy' },
    { value: 'role based', label: 'Role Based' },
    { value: 'percentage', label: 'Percentage' },
  ];

  const approvalTypes = [
    { index: 1, value: 'quotation-actual', label: 'Quotation Actual' },
    { index: 2, value: 'quotation-demo', label: 'Quotation Demo' },
    { index: 3, value: 'po', label: 'PO' },
    { index: 4, value: 'implementation-site-survey', label: 'Implementation Site Survey' },
    { index: 5, value: 'invoice-collection-schedule-create', label: 'Invoice & Collection Schedule (Create)' },
    { index: 6, value: 'invoice-collection-schedule-raiseNPS', label: 'Invoice & Collection Schedule (Raise NPS)' },
    { index: 7, value: 'collection-payment', label: 'Collection Payment' }, 
    { index: 8, value: 'collection-mapping', label: 'Collection Mapping' },
    { index: 9, value: 'generate-addendum', label: 'Generate Addendum' },
    { index: 10, value: 'cancellation-pause', label: 'Cancellation/Pause' },
    { index: 11, value: 'termination', label: 'Termination' },
];

  const initialRow = {
    profileName: {},
    min: '',
    max: '',
    actions: {
      "Approve": false,
      "Reject": false,
      "Reassign": false,
      "Adjust": false,
    },
  };


  const dataset = [
    { _id: "6527d4aec654ba0012810e9d", dataSetName: "Quotations", id: "6527d4aec654ba0012810e9d" },
    { _id: "6527d4aec654ba0012810e9d", dataSetName: "Quotations", id: "6527d4aec654ba0012810e9d" },
    { _id: "65292e2ccbc7d60012f6d9be", dataSetName: "Purchaseorders", id: "65292e2ccbc7d60012f6d9be" },
    { _id: "6538c1355368ef00529c1716", dataSetName: "Implementationsitesurveys", id: "6538c1355368ef00529c1716" },    
    { _id: "655b38250b5ae700128254f4", dataSetName: "InvoiceSchedule", id: "655b38250b5ae700128254f4" },    
    { _id: "655b38410b5ae70012825555", dataSetName: "InvoiceCollectionPaymentDetails", id: "655b38410b5ae70012825555" },    
    { _id: "655b382e0b5ae70012825516", dataSetName: "CollectionPayment", id: "655b382e0b5ae70012825516" },    
    { _id: "655b38380b5ae70012825535", dataSetName: "CollectionPaymentDetails", id: "655b38380b5ae70012825535" },    
    { _id: "655b38040b5ae70012825492", dataSetName: "AddendumDetails", id: "655b38040b5ae70012825492" },    
    { _id: "655b38100b5ae700128254b3", dataSetName: "AddendumCollectionDetails", id: "655b38100b5ae700128254b3" },    
    { _id: "655b37e80b5ae70012825471", dataSetName: "EscalationCase", id: "655b37e80b5ae70012825471" },    

  ];

  const [rows, setRows] = useState([initialRow]);
  const userDataJSON = localStorage.getItem("userData");
  const userData = JSON.parse(userDataJSON);



 const fetchRowDropdownList = (actionType) => {
  let params = { action: actionType };

  getRolesList(params)
    .then(res => {
      if (res?.data?.response?.data) {
        const modifiedData = res.data.response.data.map(item => {
          return {
            label: actionType === 'role' ? item.role_name : item.profile_name,
            value: actionType === 'role' ? item.role_name : item.profile_name,
          };
        });

        setRowDropdownList(modifiedData);
      } else {
        console.error(res);
      }
    });
}


  const fetchProductsList = () => {
    let params = {
      status: [1],
      uuid:uuid,
      master_data_type: 'package_products'

    };
    getAllProductList(params)
    .then(res => {
      let dataArray = res.data.master_data_list
      if(dataArray) {
        dataArray?.map(list => {
          // console.log(list, '-------list')
          list.label = list.group_name
          list.value = list.group_key
        })
        const filteredProducts = dataArray.filter((obj, index, self) => {
          return (
            index ===
            self.findIndex((o) => o.value === obj.value && o.label === obj.label)
          );
        });
        filteredProducts.push({
          id: 2001,
          label: "Addendum",
          value: "addendum",
        })
        setProducts(filteredProducts)
      }
      else{
        console.error(res)
      }
    })
  }

  const updateFieldsList = (newFieldsList) => {
    setFieldsList(newFieldsList);
  };
  const updateDisplayFields = (newDisplayFields) => {
    setDisplayFields(newDisplayFields);
  };

  const handleSelectProduct = (event) => {
    setSelectedProduct(event);
  };

  const handleSelectRule = (event) => {
    setSelectedRule(event);
  };

  const handleSelectApprovalType = (event) => {
    setSelectedApprovalType(event);
  };

  const handleCancel = () => {
    navigate('/authorised/list-approvals')
  }

  const handleSelectProfile = (index, value) => {
    const updatedRows = [...rows];
    updatedRows[index].profileName = value;
    setRows(updatedRows);
  };

  const handleMinMax = (index, value, type) => {
    const updatedRows = [...rows];
    if(type === 'min')
    updatedRows[index].min = value;
    else 
    updatedRows[index].max = value;
    setRows(updatedRows);
  };

  const handleCheckboxChange = (index, actionKey) => {
    const updatedRows = [...rows];
    updatedRows[index].actions[actionKey] = !updatedRows[index].actions[actionKey];
    setRows(updatedRows);
  };

  const addDeleteRow = (type, index) => {
    if (type === 'add') {
      const updatedRows = [...rows];
      updatedRows.splice(index, 0, { ...initialRow });
      setRows(updatedRows);
    } else if (type === 'delete' && index >= 0 && index < rows.length) {
      const updatedRows = [...rows];
      updatedRows.splice(index, 1);
      setRows(updatedRows);
    }
  };

  const fetchMeasures = () => {
    if(selectedApprovalType){
      getMeasuresList({ dataSetId: dataset[selectedApprovalType.index-1]?._id, uuid: currentRole })
      .then(resp => {
          if (resp?.result) {
              let data = resp?.result
              let filteredData = data
              setFieldsList(filteredData)
          }
          else
              console.error(resp )
      })
    }
  }

  const handleApplyClick = () => {
    if (selectedRule && selectedProduct && selectedApprovalType) {
        setShowFields(true);
        setDisplayFields([])
        fetchMeasures()

        if(selectedRule.label === 'Role Based')
        fetchRowDropdownList('role')
        else
        fetchRowDropdownList('profile')

        setRows([initialRow])

    }
  };

  const transformRowForSubmit = (row) => {
    const { actions, profileName, ...rest } = row;
    return {
      ...rest,
      isApprove: actions["Approve"],
      isReject: actions["Reject"],
      isReassign: actions["Reassign"],
      isAdjust: actions["Adjust"],
      profileName: profileName?.label
    };
  }

  useEffect(() => {
    if(item){
      const productSelected = products.find(product => product.label === item.approvalGroupName);
      setSelectedProduct(productSelected)
      fetchMeasures()

      const transformRow = item.approvalLevels?.map(item => {
          const { profileName, min, max, isApprove, isReject, isReassign, isAdjust } = item;
          const profileType = rowDropdownList?.find(obj => obj.label === item.profileName);

          const actions = {
              "Approve": isApprove,
              "Reject": isReject,
              "Reassign": isReassign,
              "Adjust": isAdjust,
          };
          return {  profileName: profileType, min, max, actions };
      });
      setRows(transformRow)
    }
  }, [products, selectedApprovalType, rowDropdownList]);

  useEffect(() => {
    fetchProductsList()

    if (item) {
      if(item.approvalRuleType === 'Role Based')
        fetchRowDropdownList('role')
      else 
        fetchRowDropdownList('profile')

      const productSelected = products.find(product => product.value === item.approvalGroupName);
      const approvalSelected = approvalTypes.find(approvalType => approvalType.label === item.approvalType);
      const ruleSelected = rules.find(rule => rule.label === item.approvalRuleType);

      setSelectedApprovalType(approvalSelected)
      setSelectedProduct(productSelected)
      setSelectedRule(ruleSelected)
      setShowFields(true);
      setDisplayFields(item.displayFields)
    }
  }, []);

  const validate = (obj) => {
   const {displayFields, approvalLevels} = obj
   const level = approvalLevels[0]
   if(displayFields.length===0){
     toast.error("Please select a display field!")
     return false
   }  
   if(!level.profileName || (level.isAdjust === false && level.isApprove === false && level.isReassign === false && level.isReject === false)){
      toast.error("Please fill atleast one level details!")
      return false
   }
   return true
  }

const handleSubmit = async() => {
    const transformedArray = rows.map(transformRowForSubmit);
    const obj={
      approvalType:selectedApprovalType?.label,
      approvalGroupCode:selectedProduct?.value,
      approvalGroupName:selectedProduct?.label,
      approvalRuleType:selectedRule?.label,
      approvalLevels:transformedArray,
      displayFields:displayFields,
      modifiedBy: userData?.name,
      createdBy: userData?.name
    }
  
    const validation = validate(obj)
    if(!validation) return 

    if(id){
      obj._id = item?._id
    }

    try{
      let result 
      if(!id)
        result=await createApprovalMatrix(obj)
      else 
        result=await updateApprovalMatrix(obj)

      if(result?.data?.status===400)
        toast.error(result?.data?.error?.errorMessage)
      else {
        toast.success(result?.message)
        navigate('/authorised/list-approvals')
      }

    }catch(e){
    console.log('Error: ', e);
    toast.error("**Error**")
    }
}

  const breadcrumbs = [
    <Link
      underline="hover"
      key="1"
      color="inherit"
      to="/authorised/list-approvals"
      className={classes.breadcrumbsClass}
    >
      Listing
    </Link>,
    <Typography key="3" color="text.primary" fontWeight="600" fontSize="14px">
      Approval Matrix Form
    </Typography>,
  ];
  
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
        title="Extramarks | Approval"
        className="main-container myLeadPage datasets_container"
      >
        <div>
          <Grid className={classes.cusCard}>
            <Grid container spacing={3} sx={{ pt: "8px", pb: "24px" }}>
              <Grid item md={12} xs={12}>
                <Typography className={classes.title}>
                  Add Approval Matrix
                </Typography>
              </Grid>
            </Grid>

            <>
              <Grid container spacing={3} sx={{ py: "8px" }}>
                <Grid item md={3} xs={12}>
                  <Grid>
                    <Typography className={classes.label}>
                      Approval Type
                    </Typography>
                    <Select
                      name="Approval type"
                      options={approvalTypes}
                      value={selectedApprovalType}
                      onChange={handleSelectApprovalType}
                    />
                  </Grid>
                </Grid>

                <Grid item md={3} xs={12}>
                  <Grid>
                    <Typography className={classes.label}>
                      Group Selection
                    </Typography>
                    <Select
                      name="Product Selection"
                      options={products}
                      value={selectedProduct}
                      onChange={handleSelectProduct}
                    />
                  </Grid>
                </Grid>

                <Grid item md={3} xs={12}>
                  <Grid>
                    <Typography className={classes.label}>
                      Rule
                    </Typography>
                    <Select
                      name="Rule"
                      options={rules}
                      value={selectedRule}
                      onChange={handleSelectRule}
                    />
                  </Grid>
                </Grid>

                <Grid item md={3} xs={12} style={{
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
                        <Grid container spacing={2} alignItems="center" style={{marginBottom: '10px'}}>
                            <Grid item md={1} xs={2}>
                            </Grid>
                            <Grid item md={2} xs={3}>
                              <Typography style={{ fontWeight: 'bold' }}>{selectedRule.label === 'Role Based'? "Role" : "Profile"}</Typography>
                            </Grid>
                            {selectedRule.label==='Percentage' && (<>
                            <Grid item md={1} xs={2}>
                              <Typography style={{ fontWeight: 'bold' }}>Min</Typography>
                            </Grid>
                            <Grid item md={1} xs={2}>
                                <Typography style={{ fontWeight: 'bold' }}>Max</Typography>
                            </Grid></>)}
                            <Grid item md={1} xs={3}>
                              <Typography style={{marginLeft: '20px', fontWeight: 'bold'}}>Actions</Typography>
                            </Grid>
                        </Grid>
                    {rows?.map((row, index) => (
                      <Grid container spacing={2} alignItems="center" key={index} style={{marginBottom: '10px'}}>
                          <Grid item md={1} xs={3}>
                            <p style={{textAlign:'center'}}>L{index+1}</p>
                          </Grid>
                          <Grid item md={2} xs={9}>
                              <Select
                                name="Profile"
                                options={rowDropdownList}
                                value={row.profileName}
                                onChange={(event) => handleSelectProfile(index, event)}
                              />
                          </Grid>
                          {selectedRule.label==='Percentage' && (<>
                          <Grid item md={1} xs={6}>
                            <TextField
                              value={row.min}
                              fullWidth
                              type='number'
                              size='small'
                              onChange={(event) => handleMinMax(index, event.target.value, 'min')} />
                          </Grid>
                          <Grid item md={1} xs={6}>
                              <TextField
                                value={row.max}
                                fullWidth
                                type='number'
                                size='small'
                                onChange={(event) => handleMinMax(index, event.target.value, 'max')} />
                            </Grid></>)}
                          <>
                          {Object.entries(row.actions).map(([key]) => (
                            <Grid item md={1} xs={6} key={key}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={row.actions[key]}
                                    onChange={() => handleCheckboxChange(index, key)}
                                  />
                                }
                                label={key}
                                style={{
                                    marginLeft: '10px'
                                  }}
                              />
                            </Grid>
                          ))}
                          </>
                          
                          <Grid item md={2} xs={12}>
                            <Button onClick={(e) => addDeleteRow('add', index+1)} ><AddCircleRoundedIcon color="action" fontSize="large"/></Button>
                            {(index!==0) &&
                              <Button onClick={(e) => addDeleteRow('delete', index)} style={{marginLeft: '5px'}}><HighlightOffRoundedIcon color='primary' fontSize="large"/></Button>                            
                              }
                          </Grid>
                      </Grid>
                    ))}
                    
                  </Grid>
                  </>
                )}

              </Grid>
            </>
          <DisplayFields item={item} showFields={showFields} fieldsList={fieldsList} updateFieldsList={updateFieldsList} updateDisplayFields={updateDisplayFields} displayFields={displayFields}/>
          </Grid>



          <Grid className={classes.btnSection}>
            <Button style={{   marginRight: "10px", }} className={classes.submitBtn}
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
