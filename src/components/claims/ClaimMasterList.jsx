import React, { useEffect, useState } from 'react'
import { Container, TextField, Button, Alert, Grid, InputAdornment, Box, Tabs, Tab } from "@mui/material";
import SearchIcon from '../../assets/icons/icon_search.svg';
import Page from "../../components/Page";
import { getClaimMasterList, deleteClaimMaster } from '../../config/services/claimMaster';
import ClaimMasterTable from './ClaimMasterTable';
import Pagination from '../../pages/Pagination';
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast';
import { DisplayLoader } from '../../helper/Loader';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
  noData: {
    height: "50vh",
    width: "90vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: 600,
    fontSize: 25
  },
  loader: {
    height: "50vh",
    width: "90vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  addClaimBtn: {
    fontWeight: "600",
    fontSize: "16px",
    lineHeight: "22px",
    cursor: "pointer",
    borderRadius: "4px",
    color: "white",
    border: "1px solid #F45E29",
    padding: "12px 24px",
    background: "#F45E29",
    marginLeft: "95px",
    marginBottom: '10px',
    width: "max-content"
  },
  header: {
    fontSize: '28px',
    fontWeight: '600',
    marginTop: '-35px'
  },
  buttonDiv: {
    display: 'grid',
    marginBottom: '10px'
  }
}))

const ClaimMasterList = () => {
  const [pageNo, setPagination] = useState(1);
  const [search, setSearchValue] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [claimList, setClaimList] = useState([])
  const [lastPage, setLastPage] = useState(false)
  const [rowId, setRowId] = useState(-1)
  const [deleteFlag, setDeleteFlag] = useState(false)
  const [loader, setLoader] = useState(false)
  const [sortObj, setSortObj] = useState({ sortKey: 'updatedAt', sortOrder: '-1' })
  const [loginUserProfile] = useState(JSON.parse(localStorage.getItem('userData'))?.crm_profile);
  const navigate = useNavigate();
  const classes = useStyles()


  const claimListFunction = () => {
    let params = { pageNo: (pageNo - 1), count: itemsPerPage, search, ...sortObj }
    setLastPage(false)
    setLoader(false)
    getClaimMasterList(params)
      .then((res) => {
        if (res?.result) {
          let data = res?.result
          setClaimList(data)
          setLoader(true)
          if (data?.length < itemsPerPage) {
            setLastPage(true)
          }
        }
      })
      .catch((err) => {
        console.error(err, '..error')
        setLoader(true)
      })
  }

  const handleSort = (key) => {
    let newOrder = sortObj?.sortOrder === '-1' ? '1' : '-1'
    setSortObj({ sortKey: key, sortOrder: newOrder })
  }

  const deleteRow = (rowId) => {
    let params = { _id: rowId }
    setLoader(false)
    deleteClaimMaster(params)
      .then((res => {
        toast.success(res?.message)
        setDeleteFlag(!deleteFlag)
        setLoader(true)
      }))
      .catch((err) => {
        console.error(err, 'this is error')
        setLoader(true)
      })
  }

  const handleRowId = (id) => {
    setRowId(id)
  }

  const handleAddClaim = () => {
    navigate('/authorised/create-claim')
  }

  const handleSearch = (e) => {
    let { value } = e.target
    setPagination(1)
    setSearchValue(value, () => setPagination(1))
  }

  useEffect(() => {
    claimListFunction()
  }, [search, pageNo, deleteFlag, sortObj])

  return (
    <Page title="Extramarks | Claim Master" className="main-container ApprovalRequestPage_Page datasets_container">
      <Grid display='flex' justifyContent='space-between' alignItems='center' className="datasets_header" >
        <p className={classes.header}>Claim Master</p>
        <div className={classes.buttonDiv}>
          <div className={classes.addClaimBtn} onClick={handleAddClaim}>Add Claim</div>
          <TextField className={`inputRounded search-input width-auto`} type="search"
            placeholder="Search By Type of Expense"
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
        </div>
      </Grid>
      {loader ?
        (claimList?.length > 0 ?
          <>
            <Container className='table_max_width'>
              <ClaimMasterTable list={claimList} pageNo={pageNo} itemsPerPage={itemsPerPage} handleRowId={handleRowId} deleteRow={deleteRow} />
            </Container>
            <div className='center cm_pagination'>
              <Pagination pageNo={pageNo} setPagination={setPagination} lastPage={lastPage} />
            </div>
          </>
          :
          <>
            <div className={classes.noData}>
              <p>No Data Available</p>
            </div>
            <div className='center cm_pagination'>
              <Pagination pageNo={pageNo} setPagination={setPagination} lastPage={lastPage} />
            </div>
          </>
        )
        :
        <div className={classes.loader}>
          {DisplayLoader()}
        </div>
      }
    </Page>
  );
}

export default ClaimMasterList