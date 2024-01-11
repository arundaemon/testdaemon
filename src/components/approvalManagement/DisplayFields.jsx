
import { Grid, Button, Typography, Select, MenuItem, InputLabel, FormControl, Checkbox, TextField, ListItemText, OutlinedInput, Radio} from '@mui/material';
import { makeStyles } from '@mui/styles'
import { Link, useNavigate } from 'react-router-dom'
import _ from 'lodash';
import { useState, useEffect } from 'react';
import DeleteIcon from "../../assets/icons/icon_trash.svg";


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

export default function DisplayFields({item, showFields, fieldsList, updateFieldsList, displayFields, updateDisplayFields}) {
    const classes = useStyles();
    const navigate = useNavigate()
    const [selectFieldType, setSelectFieldType] = useState([])

    const [params, setParams] = useState([]);
    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
      PaperProps: {
        style: {
          maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
          width: 250,
        },
      },
    };

      const initialRow = {
        fieldName: '',
        isCheck: false,
        url: '',
        params: '',
      };

  const handleFieldSelect = (event) => {
    const value = event.target?.value
    setSelectFieldType(value)
  };

  const handleFieldApplyClick = () => {
    if (selectFieldType) {
        const newRows = selectFieldType.map((eachField) => ({
          ...initialRow,
          fieldName: eachField,
      }));
      const val=selectFieldType
      updateDisplayFields([...displayFields, ...newRows]);
      setParams(val)
      setSelectFieldType([])
    }
  };

  useEffect(() => {
      if(displayFields){
        const filteredFieldsList = fieldsList.filter((field) => !params?.includes(field.name));
        updateFieldsList(filteredFieldsList);
      }
  }, [displayFields]);

  useEffect(() => {
    if(item){
      const createParam = displayFields.map(item => item.fieldName);
      setParams(createParam)
    }
  }, [displayFields]);

  const handleDeleteRow = (index) => {
    const updatedRows = [...displayFields];
    updatedRows.splice(index, 1);
    updateDisplayFields(updatedRows);
  };

  const handleRadioChange = (newValue, index) => {
    const updatedRows = [...displayFields];
    updatedRows[index].isCheck = newValue;
    updateDisplayFields(updatedRows);
  };

  const handleUrlParam = (index, value, type) => {
    const updatedRows = [...displayFields];
    if(type === 'params')
    updatedRows[index].params = value;
    else 
    updatedRows[index].url = value;
    updateDisplayFields(updatedRows);
  };


    return (
        <>
        {showFields && ( 
        <>
        <hr style={{border: '1px solid #ccc', margin: '30px'}}/>
        
        <Typography style={{marginLeft: '75px', fontWeight: 'bold' }}>Select Fields to Display</Typography>
        <Grid container sx={{ py: "8px" }}>
            <Grid item md={3} xs={12} style={{display: 'flex', alignItems: 'center', justifyContent:'center'}}>
                <Grid>
                <FormControl sx={{ m: 1, minWidth: 300 }} size="small">
                    <InputLabel id="demo-simple-select-label">Select Field</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        multiple
                        value={selectFieldType}
                        onChange={handleFieldSelect}
                        renderValue={(selected) => selected.join(', ')}
                        MenuProps={MenuProps}
                        style={{ width: '300px' }}
                        label="Select Field"
                    >
                       
                        {fieldsList.map((option) => (
                          <MenuItem key={option._id} value={option.name}>
                                <Checkbox checked={selectFieldType?.indexOf(option.name) > -1} />
                                <ListItemText primary={option.name} />
                        </MenuItem>
                        ))}
                       
                    </Select>
                </FormControl>
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
                onClick={handleFieldApplyClick}
                >
                Apply
                </Button>
            </Grid>
            </Grid>
        </Grid>

        <div>
            {displayFields.length>0 && (<Grid container spacing={3} alignItems="center" style={{margin: '0px 10px 10px 0px'}}>
                <Grid item md={1} xs={2}>
                    <Typography style={{textAlign:'center', fontWeight: 'bold' }}>S.No.</Typography>
                </Grid>
                <Grid item md={2} xs={5}>
                    <Typography style={{textAlign:'center', fontWeight: 'bold' }}>Field</Typography>
                </Grid> 
                <Grid item md={1} xs={5} style={{display:'flex', justifyContent: 'center'}}>
                    <Typography style={{textAlign:'center', fontWeight: 'bold' }}>Hyperlink</Typography>
                </Grid>
                <Grid item md={3} xs={5}>
                    <Typography style={{textAlign:'center', fontWeight: 'bold' }}>URL</Typography>
                </Grid>
                <Grid item md={2} xs={4}>
                    <Typography style={{textAlign:'center', fontWeight: 'bold' }}>Params</Typography>
                    
                </Grid>
                <Grid item md={1} xs={2}>
                    <Typography style={{fontWeight: 'bold' }}>Action</Typography>
                </Grid>
            </Grid>)}
        {displayFields.map((row, index) => (
            <Grid container spacing={3} key={index}  alignItems="center" style={{margin: '0px'}}>
                <Grid item md={1} xs={1}>
                    <Typography style={{textAlign:'center'}}>{index + 1}</Typography>
                </Grid>
                <Grid item md={2} xs={5}>
                    <Typography style={{textAlign:'center'}}>{row.fieldName}</Typography>
                </Grid> 
                <Grid item md={1} xs={5} style={{ display: 'flex', justifyContent: 'center' , alignItems:'center'}}>
                    <Radio
                      checked={row.isCheck === true}
                      onChange={() => handleRadioChange(true, index)}
                    />
                    <span style={{marginRight:'10px'}}>Yes</span>
                    <Radio
                      checked={row.isCheck === false}
                      onChange={() => handleRadioChange(false, index)}
                    />
                    <span style={{marginRight:'10px'}}>No</span>
                </Grid>

                <Grid item md={3} xs={5}>
                    <TextField
                    disabled={!row.isCheck}
                    // label="URL"
                    value={row.url}
                    fullWidth
                    size='small'
                    onChange={(event) => handleUrlParam(index, event.target.value, 'url')} 
                    />
                </Grid>
                <Grid item md={2} xs={4}>
                        <Select 
                         disabled={!row.isCheck}
                         size='small' 
                         value={row.params} 
                         onChange={(event) => handleUrlParam(index, event.target.value, 'params')} 
                         fullWidth
                         >
                          {params?.map((param) => (
                          <MenuItem key={param} value={param}>
                                  <ListItemText primary={param} />
                          </MenuItem>
                          ))}
                         </Select>
                </Grid>
                <Grid item md={1} xs={1}>
                    <Button className='form_icon'onClick={() => handleDeleteRow(index)} ><img src={DeleteIcon} alt='' /></Button>
                </Grid>
            </Grid>
        ))}
        </div>                  
        </>
        )}
        </>
    )
}





