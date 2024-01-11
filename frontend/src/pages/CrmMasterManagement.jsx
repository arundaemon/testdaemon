import { useState, useEffect } from 'react';
import { Container, TextField, Button, Pagination, Grid, Fade, Box, InputAdornment, Typography, Divider, Card, Link, Breadcrumbs, Modal } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import Page from "../components/Page";
import SearchIcon from '../assets/icons/icon_search.svg';
import _ from 'lodash';
import { makeStyles } from '@mui/styles';
import Revenue from "../components/MyLeads/Revenue";
import Slider from "../components/MyLeads/Slider";
import toast from 'react-hot-toast';
import { useRef } from 'react';
import { DisplayLoader } from '../helper/Loader';
import { deleteCrmMaster, getCrmMasterList, updateCrmMaster } from '../config/services/crmMaster';
import CrmMasterTable from '../components/crmMaster/CrmMasterTable';
import CreateCrmMaster from '../components/crmMaster/CreateCrmMaster';
import { createCrmMaster } from '../config/services/crmMaster';
import { getAllCrmFieldMasterList } from '../config/services/crmFieldMaster';



const style = {

  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  bgcolor: 'background.paper',
  border: '2px solid #fff',
  boxShadow: '0px 0px 4px #0000001A',
  p: 4,
  borderRadius: '4px',
};
const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'auto'
  },
  modalPaper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #fff',
    boxShadow: '0px 0px 4px #0000001A',
    minWidth: '200px',
    borderRadius: '4px',
    textAlign: 'center',
    padding: "20px"
  },
  modalTitle: {
    fontSize: '18px',
    textAlign: "left"

  }
}))

export default function CrmMasterManagement() {
  const classes = useStyles();
  const [crmFieldMasterList, setCrmFieldMasterList] = useState([]);
  const [deletePopup, setDeletePopup] = useState(false);
  const [deleteObj, setDeleteObj] = useState({});
  const [recordForEdit, setRecordForEdit] = useState({});
  const [crmMasterModal, setCrmMasterModal] = useState(false)
  const [pageNo, setPagination] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [search, setSearchValue] = useState('')
  const [sortObj, setSortObj] = useState({ sortKey: 'createdAt', sortOrder: '-1' })
  const [totalCount, setTotalCount] = useState(0)
  const [crmMasterList, setCrmMasterList] = useState([])
  const [crmMasterSize, setCrmMasterSize] = useState(false);
  const [createdBy] = useState(JSON.parse(localStorage.getItem('userData'))?.name);
  const [createdBy_Uuid] = useState(JSON.parse(localStorage.getItem('loginData'))?.uuid);
  const [modifiedBy] = useState(JSON.parse(localStorage.getItem('userData'))?.name);
  const [modifiedBy_Uuid] = useState(JSON.parse(localStorage.getItem('loginData'))?.uuid);
  const [loader, setLoader] = useState(false)
  const divRef = useRef();

  const navigate = useNavigate();



  const showCreateCrmMaster = (cancelFlag = false) => {
    (!crmMasterModal || cancelFlag) && setCrmMasterModal(!crmMasterModal)
  }

  function handleClick() {
    setRecordForEdit({});
    showCreateCrmMaster();
  }

  const handleChange = (e) => {
    let filledDetails = _.cloneDeep(recordForEdit)
    filledDetails.value = e.target.value;
    setRecordForEdit(filledDetails)
  };

  const handleType = (newValue) => {
    let filledDetails = _.cloneDeep(recordForEdit)
    filledDetails.type = newValue;
    setRecordForEdit(filledDetails);
  };

  const fetchAllCrmFieldMaster = async () => {
    let params = { listFlag: true };
    getAllCrmFieldMasterList(params)
      .then((res) => {

        if (res?.result) {
          res?.result?.map(obj => {
            obj.label = obj?.fieldName
            obj.value = obj.fieldName
            return obj
          })
          setCrmFieldMasterList(res?.result)
        }
      })
      .catch(err => console.error(err))
  }

  const deleteCrmMasterObject = params => {
    setDeleteObj({ _id: params?._id, })
    setDeletePopup(true)
  }

  const handleCancelDelete = () => {
    setDeletePopup(false)
    setDeleteObj({})
  }

  const handleUpdate = async (row) => {
    let filledDetails = {};
    filledDetails.type = row?.type && { label: `${row.type}`, value: `${row.type}` };
    filledDetails.value = row?.value;
    filledDetails._id = row?._id;
    setRecordForEdit(filledDetails);
    showCreateCrmMaster();
  }

  const validateFields = (data) => {
    let { type, fieldType } = data;
    if (!type || type.label === '' || type.value === '') {
      toast.error('Please select type');
      return false;
    }
    return true;
  };

  const addOrEdit = async () => {
    let params = {
      type: recordForEdit?.type?.value,
      typeId: recordForEdit?.type?._id,
      value: recordForEdit?.value,
      fieldType: recordForEdit?.type?.fieldType,
    }
    if (validateFields(recordForEdit)) {
      if (recordForEdit?._id) {
        params = {
          ...params,
          _id: recordForEdit?._id,
          modifiedBy,
          modifiedBy_Uuid
        }
        updateCrmMaster(params)
          .then(res => {
            if (res?.result) {
              toast.success(res?.message);
              fetchCrmMasterList();
              setRecordForEdit({
                type: { label: '', value: '' },
                value: ''
              });
            }
          })
          .catch(err => {
            console.log(err, ':: error inside catch update');
          })
      }
      else {
        params = {
          ...params,
          createdBy,
          createdBy_Uuid,
          modifiedBy,
          modifiedBy_Uuid
        }
        createCrmMaster(params)
          .then(res => {
            if (res?.result) {
              toast.success(res?.message);
              fetchCrmMasterList();
              setRecordForEdit({
                type: { label: '', value: '' },
                value: ''
              });
            }
          })
          .catch(err => {
            console.log(err, ':: error inside catch');
          })
      }

    }
  }

  const handleSearch = (e) => {
    let { value } = e.target
    setPagination(1)
    setSearchValue(value, () => setPagination(1))
  }
  const handlePagination = (e, pageNumber) => {
    setPagination(pageNumber)
  }
  const handleSort = (key) => {
    let newOrder = sortObj?.sortOrder === '-1' ? '1' : '-1'
    setSortObj({ sortKey: key, sortOrder: newOrder })
  }

  let totalPages = Number((totalCount / itemsPerPage).toFixed(0))
  if ((totalPages * itemsPerPage) < totalCount)
    totalPages = totalPages + 1;


  const fetchCrmMasterList = async (scrollFlag = false) => {
    let params = { pageNo: (pageNo - 1), count: itemsPerPage, ...sortObj, search }
    setLoader(false)
    setCrmMasterSize(false)
    getCrmMasterList(params)
      .then((res) => {
        let list = res?.result
        setTotalCount(res?.totalCount)
        setCrmMasterList(list);
        setLoader(true)
        if (scrollFlag) {
          divRef.current.scrollIntoView();
        }
        if (list.length > 0) {
          setCrmMasterSize(true)
        }
        else {
          setCrmMasterSize(false)
        }
      })
      .catch((err) => {
        console.log(err, '..error')
        setLoader(true)
        setCrmMasterSize(false)
      })
  }

  const submitDeleteCrmMaster = () => {
    let { _id } = deleteObj
    deleteCrmMaster({ _id })
      .then(res => {
        if (res?.result) {
          handleCancelDelete()
          fetchCrmMasterList()
          toast.success(res?.message)
        }
        else if (res?.data?.statusCode === 0) {
          let { errorMessage } = res?.data?.error
          toast.error(errorMessage)
        }
        else {
          console.error(res);
        }
      })
  }

  useEffect(() => {
    fetchAllCrmFieldMaster();
  }, []);

  useEffect(() => {
    fetchCrmMasterList()
  }, [search, sortObj, pageNo, itemsPerPage]);

  return (
    <>
      <Page title="Extramarks | CRM Master Management" className="main-container compaignManagenentPage datasets_container">
        <div>
          <div>
            {crmMasterModal &&
              <div className='createCampaign' >
                <CreateCrmMaster addOrEdit={addOrEdit} crmFieldMasterList={crmFieldMasterList} recordForEdit={recordForEdit} handleChange={handleChange} handleType={handleType} fetchCampaignList={fetchCrmMasterList} showCreateCrmMaster={showCreateCrmMaster} />
              </div>
            }

            {!crmMasterModal &&
              <div style={{ textAlign: "right" }}>
                <div className='createNew_button' onClick={handleClick}>Create New</div>
              </div>
            }
          </div>

          <div className='tableCardContainer' >
            <div ref={divRef}>

              <div className='contaienr'>
                <h4 className='heading' >Manage CRM Master</h4>
              </div>
              {(crmMasterSize || search) &&
                <TextField className={`inputRounded search-input`} type="search"
                  placeholder="Search by type"
                  onChange={handleSearch}
                  InputLabelProps={{ style: { ...({ top: `${-7}px` }) } }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <img src={SearchIcon} alt="" />
                      </InputAdornment>
                    ),
                  }}
                />
              }

              {loader ?
                (crmMasterSize ?
                  <>
                    <CrmMasterTable handleUpdate={handleUpdate} list={crmMasterList} deleteCrmMasterObject={deleteCrmMasterObject} pageNo={pageNo} itemsPerPage={itemsPerPage} search={search} handleSort={handleSort} sortObj={sortObj} />

                    <div className='center cm_pagination'>
                      <Pagination count={totalPages} variant="outlined" color="primary" onChange={handlePagination} page={pageNo} />
                    </div>
                  </>
                  :
                  <div
                    style={{
                      height: "50vh",
                      width: "90vw",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontWeight: 600,
                      fontSize: 18
                    }}>
                    <p>No Data Available</p>
                  </div>
                ) :
                <div
                  style={{
                    height: "50vh",
                    width: "90vw",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}>
                  {DisplayLoader()}
                </div>
              }
            </div>
          </div>
          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={deletePopup}
            closeAfterTransition
          >
            <Fade in={deletePopup}>
              <Box className={classes.modalPaper + " modal-box modal-md"} id="transition-modal-title">
                <div >
                  <Typography variant="subtitle1" className={classes.modalTitle} >
                    {`Are you sure to delete ?`}
                  </Typography>
                </div>
                {/* <Box className="modal-content text-left"> */}
                <Box style={{ marginBottom: 0, marginRight: 0 }} className="modal-footer text-right" >
                  <Button onClick={handleCancelDelete} className={" report_form_ui_btn cancel mr-2"} color="primary" variant="outlined" > Cancel </Button>
                  <Button onClick={submitDeleteCrmMaster} color="primary" autoFocus className={" report_form_ui_btn submit"} variant="contained"> Submit </Button>
                </Box>
                {/* </Box> */}
              </Box>
            </Fade>
          </Modal>
        </div>
      </Page >
    </>
  )
}