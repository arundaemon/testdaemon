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
import CrmFieldMasterTable from '../components/crmFieldMaster/CrmFieldMasterTable';
import CreateCrmFieldMaster from '../components/crmFieldMaster/CreateCrmFieldMaster';
import { createCrmFieldMaster, updateCrmFieldMaster, getCrmFieldMasterList} from '../config/services/crmFieldMaster';



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

export default function CrmFieldMasterManagement() {
  const classes = useStyles();
  const [crmFieldMasterList, setCrmFieldMasterList] = useState([]);
  const [deletePopup, setDeletePopup] = useState(false);
  const [deleteObj, setDeleteObj] = useState({});
  const [recordForEdit, setRecordForEdit] = useState({});
  const [crmFieldMasterModal, setCrmFieldMasterModal] = useState(false)
  const [pageNo, setPagination] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [search, setSearchValue] = useState('')
  const [sortObj, setSortObj] = useState({ sortKey: 'createdAt', sortOrder: '-1' })
  const [totalCount, setTotalCount] = useState(0)
  const [crmFieldMasterSize, setCrmFieldMasterSize] = useState(false);
  const [createdBy] = useState(JSON.parse(localStorage.getItem('userData'))?.name);
  const [createdBy_Uuid] = useState(JSON.parse(localStorage.getItem('loginData'))?.uuid);
  const [modifiedBy] = useState(JSON.parse(localStorage.getItem('userData'))?.name);
  const [modifiedBy_Uuid] = useState(JSON.parse(localStorage.getItem('loginData'))?.uuid);
  const [loader, setLoader] = useState(false)
  const divRef = useRef();

  const navigate = useNavigate();



  const showCreateCrmFieldMaster = (cancelFlag = false) => {
    (!crmFieldMasterModal || cancelFlag) && setCrmFieldMasterModal(!crmFieldMasterModal)
  }

  const handleChange = (e) => {
    let filledDetails = _.cloneDeep(recordForEdit)
    filledDetails.fieldName = e.target.value;
    setRecordForEdit(filledDetails)
  };

  function handleClick() {
    setRecordForEdit({});
    showCreateCrmFieldMaster();
  }

  const handleFieldType = (newValue) => {
    let filledDetails = _.cloneDeep(recordForEdit)
    filledDetails.fieldType = newValue;
    setRecordForEdit(filledDetails);
  };

  const handleType = (newValue) => {
    let filledDetails = _.cloneDeep(recordForEdit)
    filledDetails.type = newValue;
    setRecordForEdit(filledDetails);
  };

  // const handleFieldName = (newValue) => {
  //   let filledDetails = _.cloneDeep(recordForEdit)
  //   filledDetails.fieldName = newValue;
  //   setRecordForEdit(filledDetails);
  // };

  const handleUpdate = async (row) => {
    let filledDetails = {};
    filledDetails.fieldType = row?.fieldType && { label: `${row.fieldType}`, value: `${row.fieldType}` };
    filledDetails.fieldName = row?.fieldName;
    // filledDetails.fieldName = row?.fieldName && { label: `${row.fieldName}`, value: `${row.fieldName}` };
    filledDetails.type = row?.type && { label: `${row.type}`, value: `${row.type}` };
    filledDetails._id = row?._id;
    setRecordForEdit(filledDetails);
    showCreateCrmFieldMaster();
  }

  const validateFields = (data) => {
    let { fieldType, fieldName, type } = data;
    if (!fieldName || fieldName === '') {
        toast.error('Please select field name');
        return false;
      }
    if (!fieldType || fieldType.label === '' || fieldType.value === '') {
      toast.error('Please select field type');
      return false;
    }
    if (!type || type.label === '' || type.value === ''){
      toast.error('Please select Type');
      return false;
    }
    
    return true;
  };

  const addOrEdit = async () => {
    let params = {
      fieldType: recordForEdit?.fieldType?.value,
      fieldName: recordForEdit?.fieldName,
      type: recordForEdit?.type?.value,
    }
    if (validateFields(recordForEdit)) {
      if (recordForEdit?._id) {
        params = {
          ...params,
          _id: recordForEdit?._id,
          modifiedBy,
          modifiedBy_Uuid
        }
        updateCrmFieldMaster(params)
          .then(res => {
            if (res?.result) {
              toast.success(res?.message);
              fetchCrmFieldMasterList(true);
              setRecordForEdit({
                fieldType: { label: '', value: '' },
                fieldName: '',
                type: { label: '', value: '' }
              });
            }
            else if(res?.data?.error?.errorMessage){
              toast.error(res?.data?.error?.errorMessage)
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
        createCrmFieldMaster(params)
          .then(res => {
            if (res?.result) {
              toast.success(res?.message);
              fetchCrmFieldMasterList(true);
              setRecordForEdit({
                fieldType: { label: '', value: '' },
                fieldName: '',
                type: { label: '', value: '' }
              });
            }
            else if(res?.data?.error?.errorMessage){
              toast.error(res?.data?.error?.errorMessage)
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


  const fetchCrmFieldMasterList = async (scrollFlag = false) => {
    let params = { pageNo: (pageNo - 1), count: itemsPerPage, ...sortObj, search }
    setLoader(false)
    setCrmFieldMasterSize(false)
    getCrmFieldMasterList(params)
      .then((res) => {
        let list = res?.result
        setTotalCount(res?.totalCount)
        setCrmFieldMasterList(list);
        setLoader(true)
        if (scrollFlag) {
          divRef.current.scrollIntoView();
        }
        if (list.length > 0) {
          setCrmFieldMasterSize(true)
        }
        else {
          setCrmFieldMasterSize(false)
        }
      })
      .catch((err) => {
        console.log(err, '..error')
        setLoader(true)
        setCrmFieldMasterSize(false)
      })
  }


//   const submitDeleteCrmMaster = () => {
//     let { _id } = deleteObj
//     deleteCrmMaster({ _id })
//       .then(res => {
//         if (res?.result) {
//           handleCancelDelete()
//           fetchCrmMasterList()
//           toast.success(res?.message)
//         }
//         else if (res?.data?.statusCode === 0) {
//           let { errorMessage } = res?.data?.error
//           toast.error(errorMessage)
//         }
//         else {
//           console.error(res);
//         }
//       })
//   }


  useEffect(() => {
    fetchCrmFieldMasterList()
  }, [search, sortObj, pageNo, itemsPerPage]);

  return (
    <>
      <Page title="Extramarks | CRM Field Master Management" className="main-container compaignManagenentPage datasets_container">
        <div>
          <div>
            {crmFieldMasterModal &&
              <div className='createCampaign' >
                <CreateCrmFieldMaster addOrEdit={addOrEdit} crmFieldMasterList={crmFieldMasterList} recordForEdit={recordForEdit} handleType={handleType} handleFieldType={handleFieldType} handleChange={handleChange} showCreateCrmFieldMaster={showCreateCrmFieldMaster} />
              </div>
            }

            {!crmFieldMasterModal &&
              <div style={{ textAlign: "right" }}>
                <div className='createNew_button' onClick={handleClick}>Create New</div>
              </div>
            }
          </div>

          <div className='tableCardContainer' >
            <div ref={divRef}>

              <div className='contaienr'>
                <h4 className='heading' >Manage CRM Field Master</h4>
              </div>
              {(crmFieldMasterSize || search) &&
                <TextField className={`inputRounded search-input`} type="search"
                  placeholder="Search by field Name"
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
                (crmFieldMasterSize ?
                  <>
                    <CrmFieldMasterTable handleUpdate={handleUpdate} list={crmFieldMasterList}  pageNo={pageNo} itemsPerPage={itemsPerPage} search={search} handleSort={handleSort} sortObj={sortObj} />

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
        </div>
      </Page >
    </>
  )
}