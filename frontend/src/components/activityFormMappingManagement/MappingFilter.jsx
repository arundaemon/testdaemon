import React, { useEffect, useState } from 'react'
import { makeStyles } from '@mui/styles';
import { Box, Menu } from "@mui/material";
import Select from 'react-select';
import _ from 'lodash';
import { toast } from 'react-hot-toast';
import CancelButton from "../../assets/icons/icon-cancel.svg";

const useStyles = makeStyles((theme) => ({
  column: {
    display: "flex",
    flexDirection: "column",
    flex: "1",
    marginRight: "20px"
  },
  boxLabel: {
    fontSize: "15px",
    marginLeft: '28px'
  },
  select: {
    width: "100%",
    padding: "8px",
    fontSize: "14px",
    marginBottom: "12px",
    marginLeft: '15px'
  },
  saveBtn: {
    fontSize: '14px',
    fontWeight: '600',
    background: 'white',
    padding: "9px 18px",
    color: " #F54E29",
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '10px',
    marginBottom: '10px',
    border: '1px solid #F54E29',
    width: 'max-content',
  },
  crossIcon: {
    position: "absolute",
    top: "20px",
    right: "20px",
    cursor: "pointer",
    fontSize: '22px'
  },
  removeFilterBtn: {
    fontSize: '12px',
    cursor: 'pointer',
    color: '#85888A',
    marginTop: '12px',
    marginRight: '10px'
  },
  filterMainContainer: {
    '& .MuiPaper-root.MuiPaper-elevation.MuiPaper-root': {
      overflow: 'hidden'
    }
  },
  filterContainer: {
    width: '350px',
    height: '400px',
    overflow: 'auto'
  },
  headerHedding: {
    fontSize: '20px',
    fontWeight: '600',

  },
  dropdownItemHeader: {
    [theme.breakpoints.down('sm')]: {
      paddingRight: '30px',
      paddingLeft: '20px'
    },
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: " 10px",
    borderBottom: '1px solid #DEDEDE'
  }
}
))

const MappingFilter = ({ filterAnchor,productList, setFilterAnchor, dropDownResponse, stageList, statusList, activityList, filterRecords, setFilterRecords, applyFilter, setApplyFilter, setPagination }) => {
  const classes = useStyles()
  const [customerResponseList, setCustomerResponseList] = useState([])
  const [subjectList, setSubjectList] = useState([]);
  const [selectedObject, setSelectedObject] = useState({})

  const handleDropDownOptions = (data) => {
    for (let item of data) {
      // if (item?.key === 'Products') {
      //   let dataArray = item?.value.map(obj => ({ label: obj, value: obj }))
      //   setProductList(dataArray)
      // }
      if (item?.key === 'Customer Response') {
        let dataArray = item?.value.map(obj => ({ label: obj, value: obj }))
        setCustomerResponseList(dataArray)
      }
      if (item?.key === 'Subject') {
        let dataArray = item?.value.map(obj => ({ label: obj, value: obj }))
        setSubjectList(dataArray)
      }
    }
  }

  const handleSelectStage = (newSelectValue) => {
    let filledDetails = _.cloneDeep(selectedObject)
    filledDetails.stageName = newSelectValue;
    setSelectedObject(filledDetails)
  }

  const handleSelectProduct = (newSelectValue) => {
    let filledDetails = _.cloneDeep(selectedObject)
    filledDetails.product = newSelectValue;
    setSelectedObject(filledDetails)
  }

  const handleSelectSubject = (newSelectValue) => {
    let filledDetails = _.cloneDeep(selectedObject)
    filledDetails.subject = newSelectValue;
    setSelectedObject(filledDetails)
  }

  const handleSelectCustomerResponse = (newSelectValue) => {
    let filledDetails = _.cloneDeep(selectedObject)
    filledDetails.customerResponse = newSelectValue;
    setSelectedObject(filledDetails)
  }

  const handleSelectStatus = (newSelectValue) => {
    let filledDetails = _.cloneDeep(selectedObject)
    filledDetails.status = newSelectValue;
    setSelectedObject(filledDetails)
  }

  const handleSelectActivity = (newSelectValue) => {
    let filledDetails = _.cloneDeep(selectedObject)
    filledDetails.activity = newSelectValue;
    setSelectedObject(filledDetails)
  }

  const handleSelectFutureActivity = (newSelectValue) => {
    let filledDetails = _.cloneDeep(selectedObject)
    filledDetails.futureActivityName = newSelectValue;
    setSelectedObject(filledDetails)
  }

  const handleApplyFilter = () => {
    if (Object?.keys(selectedObject)?.length === 0) {
      toast.dismiss()
      toast.error('Select Atleast one value')
      return
    }
    setApplyFilter(!applyFilter)
    setFilterRecords(selectedObject)
    setFilterAnchor(null)
    setPagination(1)
  }

  const removeAllFilters = () => {
    setSelectedObject({})
    setFilterRecords({})
    setApplyFilter(!applyFilter)
    setFilterAnchor(null)
    setPagination(1)
  }

  useEffect(() => {
    handleDropDownOptions(dropDownResponse)
  }, [dropDownResponse?.length > 0])

  return (
    <Menu
      anchorEl={filterAnchor}
      open={Boolean(filterAnchor)}
      onClose={() => setFilterAnchor(null)}
      className={classes.filterMainContainer}
    >
      <Box className={classes.filterContainer}>
        <Box className="filters-dropdown-item dasboard-filters-view-dropdown">
          <Box className={classes.dropdownItemHeader} display="flex" justifyContent="space-between">
            <div className={classes.headerHedding} > Filters </div>
            <img onClick={() => setFilterAnchor(null)} src={CancelButton} className="" style={{ width: '16px' }} />
          </Box>
        </Box>
        <div style={{ display: 'flex', marginTop: '10px' }}>
          <div style={{ flex: 1, marginRight: '20px' }}>
            <div className={classes.column}>
              <label className={classes.boxLabel}>Product</label>
              <Select
                className={classes.select}
                options={productList}
                onChange={handleSelectProduct}
                value={selectedObject?.product}
                isClearable={true}
              />
              <label className={classes.boxLabel}>Pre Stage</label>
              <Select
                className={classes.select}
                options={stageList}
                onChange={handleSelectStage}
                value={selectedObject?.stageName}
                isClearable={true}
              />
              <label className={classes.boxLabel}>Pre Status</label>
              <Select
                className={classes.select}
                options={statusList}
                onChange={handleSelectStatus}
                value={selectedObject?.status}
                isClearable={true}
              />
              <label className={classes.boxLabel}>Customer Response</label>
              <Select
                className={classes.select}
                options={customerResponseList}
                onChange={handleSelectCustomerResponse}
                value={selectedObject?.customerResponse}
                isClearable={true}
              />
              <label className={classes.boxLabel}>Subject</label>
              <Select
                className={classes.select}
                options={subjectList}
                onChange={handleSelectSubject}
                value={selectedObject?.subject}
                isClearable={true}
              />
              <label className={classes.boxLabel}>Activity</label>
              <Select
                className={classes.select}
                options={activityList}
                onChange={handleSelectActivity}
                value={selectedObject?.activity}
                isClearable={true}
              />
              <label className={classes.boxLabel}>Future Activity</label>
              <Select
                className={classes.select}
                options={activityList}
                onChange={handleSelectFutureActivity}
                value={selectedObject?.futureActivityName}
                isClearable={true}
              />
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', float: 'right' }}>
          <div className={classes.saveBtn} onClick={handleApplyFilter} variant='outlined'> Apply</div>
          {(Object?.keys(filterRecords).length > 0) ?
            <div className={classes.removeFilterBtn} onClick={removeAllFilters}> Remove All </div>
            : null}
        </div>
      </Box>
    </Menu>
  )
}
export default MappingFilter