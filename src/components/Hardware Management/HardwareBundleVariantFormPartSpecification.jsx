import React, { useEffect, useState } from 'react'
import Page from "../Page";
import {
    Grid,
    Typography,
    Radio,
    RadioGroup,
    FormControlLabel,
    Button,
    Modal,
    Box,
    LinearProgress,
    Switch,
  } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Select from 'react-select';
import HardwarePartVarientFormTable from './HardwarePartVarientFormTable';
import PartSpecificationTable from './PartSpecificationTable';
import _ from 'lodash';
import { toast } from 'react-hot-toast';
import { listHardwarePartVariants} from '../../config/services/hardwareManagement';
import { listHardwareParts } from '../../config/services/hardwareBundleAndPart';
import { getUserData } from '../../helper/randomFunction/localStorage';


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


export default function HardwareBundleFormPartSpecification({getPartSpecification, updateSpecification}) {
    const classes = useStyles();
    const [partName, setPartName] = useState(null)
    const [partList, setPartList] = useState([])
    const [variantList, setVariantList] = useState([])
    const [partVariant, setPartVariant] = useState(null)
    const [specification, setSpecification ] = useState([])
    const [finalSpecification, setFinalSpecification ] = useState([])
    const [variantOptions, setVariantOptions] = useState([])
    const updateData = updateSpecification
    const loginData = getUserData('loginData')
    const uuid=loginData?.uuid
    let edit = false


  const getPartList = () => {
    let params = {
      status:[1],
      uuid:uuid
    }
    listHardwareParts(params)
      .then((res) => {
        setPartList(res?.data?.part_list)
      })
      .catch(
        err => console.error(err)
      )
  }


  const getPartVariant = () => {
    let params = {
      status:[1],
      uuid:uuid

    }
    listHardwarePartVariants(params)
      .then((res) => {
        setVariantList(res?.data?.part_variants)
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


  const getPartVariantOptions = (value) => {
    let variantOptions = []
    const filteredVariants = variantList?.filter(item => item?.part_id === value);
    variantOptions = filteredVariants?.map(item => {
      return {
        label: item?.part_variant_name,
        value: item?.variant_id
      };
    });
    return variantOptions
  }



    useEffect(() => {
      if (partName) {
       const options = getPartVariantOptions(partName?.value);
        setVariantOptions(options);
      }
    }, [partName]);



    const handleSelectPartName = (selectedOption) => {
      setPartName(selectedOption)
    };
  
    const handleSelectVariantName = (selectedOption) => {
      setPartVariant(selectedOption);
    };
  
    const checkForDuplicate = (value) => {
      let flag = true;
      specification.forEach((item) => {
        if (value?.part_id == item?.part_id && value?.part_name == item?.part_name && value?.variant_id == item?.variant_id && value?.part_variant == item?.part_variant) {
          flag = false;
        }
      })
      return flag;
    }

    const FormValidation = (formdata) => {
      let { part_id, variant_id } = formdata
  
      if (!part_id && isNaN(part_id)) {
        toast.error('Part Name is Mandatory !')
        return false
      }
      else if (!variant_id) {
        toast.error('Part Variant is Mandatory !')
        return false
      }
      else 
      {
        return true
      }
    }

    const addSpecification = () => {
      let newObj = {
        part_id: partName?.value,
        part_name: partName?.label,
        variant_id: partVariant?.value,
        variant_name: partVariant?.label,

      };
      edit = false
      if (checkForDuplicate(newObj)) {
        if (FormValidation(newObj)){
          let cloneSpecification = _.cloneDeep(specification);
          cloneSpecification.push(newObj);
          setSpecification(cloneSpecification);
          setFinalSpecification(cloneSpecification)
          setPartName({})
          setPartVariant({})
        }
      }
      else {
        toast.error("This Condition already exists")
      }
  
    };


    const saveSpecification = () => {
      if (specification.length === 0) {
        let newObj = {
          part_id: parseInt(partName?.value),
          part_name: partName?.label,
          variant_id: partVariant?.value,
          variant_name: partVariant?.label,
        };
      edit = false
        if (FormValidation(newObj)){
          let cloneSpecification = _.cloneDeep(specification);
          cloneSpecification.push(newObj);
          setFinalSpecification(cloneSpecification)
          setSpecification(cloneSpecification);
          setPartName({})
          setPartVariant({})
        }
      }
      else {
        let cloneSpecification = _.cloneDeep(specification);
        setSpecification(cloneSpecification);
      }
    };
  

    useEffect(() => {
      let paramsObj = {
        part_specification: finalSpecification,
      }
      getPartSpecification(paramsObj)
    }, [partName, partName, partVariant, partVariant, specification])


    useEffect(() => {
      if (updateData) {
        let data = updateData
        setSpecification(data?.part_specification)
        setFinalSpecification(data?.part_specification)
      }
    }, [updateData]);

    useEffect(() => {
      getPartList()
      getPartVariant()
    }, []);


    const handleDeleteRow = (rowData) => {
      const arrayAfterDelete = specification?.filter((element) => {
        return element?.part_name !== rowData?.part_name || element?.variant_name !== rowData?.variant_name ;
      });
      setSpecification(arrayAfterDelete)
      setFinalSpecification(arrayAfterDelete)
      setPartName({})
      setPartVariant({})

    }
  
    const handleEditRow = (rowData) => {
      let data = rowData
      const partNameObj = {
        label: data?.part_name,
        value: data?.part_id
      }
      const partVariantObj = {
        label: data?.variant_name,
        value: data?.variant_id
      }
      if(edit === false) {
        const arrayAfterDelete = finalSpecification?.filter((element) => {
          return element?.part_name !== rowData?.part_name || element?.part_variant !== rowData?.part_variant ;
        });
        setSpecification(arrayAfterDelete)
      }
      else {
        const arrayAfterDelete = specification?.filter((element) => {
          return element?.part_name !== rowData?.part_name || element?.part_variant !== rowData?.part_variant ;
        });
        setSpecification(arrayAfterDelete)
      }

      setPartName(partNameObj)
      setPartVariant(partVariantObj)
  
    }

  return (
    <Page
    title="Extramarks | Hardware Information"
    className="main-container myLeadPage datasets_container"
  >
    {/* <div>{shw_loader ? <LinearProgress /> : ""}</div> */}
    <div>
      <Grid className={classes.cusCard}>
        <Grid container spacing={3} sx={{ pt: "8px", pb: "24px" }} >
          <Grid item xs={12}>
            <Typography className={classes.title}>
              Information
            </Typography>
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
                          placeholder={partName ? partName : "Select..."}
                          value={partName}
                          onChange={handleSelectPartName}
                        />
                    </Grid>      
                </Grid>

                <Grid item md={4} xs={12}>
                    <Grid>
                        <Typography className={classes.label}>Part Variant<span style={{ color: 'red' }}>*</span></Typography>
                        <Select
                          name="Variant Name"
                          options={variantOptions}
                          placeholder={partVariant ? partVariant : "Select..."}
                          value={partVariant}
                          onChange={handleSelectVariantName}
                        />
                    </Grid>      
                </Grid>
                     
        

            </Grid>
        </>


          <Grid className={classes.btnSection}>

              <Button
                  style={{
                      marginRight: '10px',
                  }}
                  className={classes.submitBtn}
                  onClick={addSpecification}
                  disabled={finalSpecification?.length === 0 ? true : false}              
              >
                  Add More
              </Button>

              <Button
                  className={classes.submitBtn}
                  onClick={saveSpecification}
                  disabled={finalSpecification?.length > 0 ? true : false}   
              >
                  Save
              </Button>
          </Grid>


          <PartSpecificationTable specification={specification} handleDeleteRow={handleDeleteRow} handleEditRow={handleEditRow} />
      </Grid>
    
      
    </div>


  </Page>
  )
}
