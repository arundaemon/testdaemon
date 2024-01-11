import { useState, useEffect } from 'react';
import { makeStyles } from '@mui/styles'
import Page from "../components/Page";
import SearchIcon from "../assets/icons/icon_search.svg";
import { Container, TextField, Grid, InputAdornment, Alert, Button, Modal, Fade, Box, Typography } from "@mui/material";
import Controls from "../components/controls/Controls";
import AddIcon from "@mui/icons-material/Add";
import BannersTable from "../components/bannerManagement/BannersTable";
import { getBannersList, deleteBanner, updateBannerStatus, getAllActiveBanners } from '../config/services/banners';
import Loader from "./Loader";
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Pagination from './Pagination';



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
    minWidth: '300px',
    borderRadius: '4px',
    textAlign: 'center',
  },
  modalTitle: {
    fontSize: '18px',
  },
  outlineButton: {
    color: '#85888A',
    fontSize: '14px',
    border: '1px solid #DEDEDE',
    borderRadius: '4px',
    fontWeight: 'normal',
    marginRight: '10px',
    padding: '0.5rem 1.5rem'
  },
  containedButton: {
    color: '#fff',
    fontSize: '14px',
    border: '1px solid #F45E29',
    borderRadius: '4px',
    fontWeight: 'normal',
    padding: '0.5rem 1.5rem'
  }
}));


const BannerManagement = () => {
  const [bannerList, setBannerList] = useState([]);
  const [search, setSearchValue] = useState('')
  const [sortObj] = useState({ sortKey: 'createdAt', sortOrder: '-1' })
  const [loader, setLoading] = useState(false)
  const [pageNo, setPagination] = useState(1)
  const [itemsPerPage] = useState(10)
  const [deleteObj, setDeleteObj] = useState({})
  const [deletePopup, setDeletePopup] = useState(false)
  const [activeBanners, setActiveBanners] = useState(0)
  const [lastPage, setLastPage] = useState(false)
  const classes = useStyles();
  const navigate = useNavigate();


  const fetchBannersList = () => {
    let params = { pageNo: (pageNo - 1), count: itemsPerPage, search, ...sortObj }
    setLoading(true)
    setLastPage(false)
    getBannersList(params)
      .then((res) => {
        let data = res?.result
        setBannerList(data);
        if (data.length < itemsPerPage) setLastPage(true)
        setLoading(false)
      })
      .catch(err => console.error(err))
  }

  const deleteBannerF = params => {
    setDeleteObj({ bannerId: params?._id, bannerName: params?.bannerName })
    setDeletePopup(true)
  }

  const handleCancelDelete = () => {
    setDeletePopup(false)
    setDeleteObj({})
  }

  const handleBannerStatus = (e, bannerDetails) => {
    let { status, _id } = bannerDetails
    let newStatus = status === 0 ? 1 : 0

    updateBannerStatus({ bannerId: _id, bannerStatus: newStatus })
      .then(res => {
        if (res?.result) {
          fetchBannersList()
          getAllActiveBannerNumber()
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

  const submitDeleteMenu = () => {
    let { bannerId } = deleteObj
    deleteBanner({ bannerId })
      .then(res => {
        if (res?.result) {
          handleCancelDelete()
          fetchBannersList()
          getAllActiveBannerNumber()
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


  const handleSearch = (e) => {
    let { value } = e.target;
    setPagination(1)
    setSearchValue(value, () => setPagination(1))
  }

  const handleAddBanner = (bannerId) => {
    if (bannerId) {
      navigate('/authorised/update-banner/' + bannerId)
    }
    else {
      navigate('/authorised/banner-details')
    }
  }

  const getAllActiveBannerNumber = () => {
    getAllActiveBanners()
      .then((res) => {
        if (res?.result) {
          setActiveBanners(res?.result?.length)
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

  useEffect(() => fetchBannersList(), [search, sortObj, pageNo, itemsPerPage])
  useEffect(() => {
    getAllActiveBannerNumber()
  }, [])

  return (
    <>
      <Page title="Extramarks | Banner Management" className="main-container datasets_container">
        <Container className="table_max_width">
          <Grid container alignItems="left" justifyContent="flex-start" mb={2.5} spacing={2.5} >
            <Grid item xs={12} sm={4} md={4} lg={4} className="datasets_header">
              <TextField
                className={`inputRounded search-input`}
                type="search"
                placeholder="Search By Banner Name"
                onChange={handleSearch}
                InputLabelProps={{ style: { ...{ top: `${-7}px` } } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <img src={SearchIcon} alt="" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={8} md={8} lg={8}>
              <Grid container justifyContent="flex-end" spacing={2.5}>
                <Grid item xs={6} sm={6} md={6} lg={3} display="flex" justifyContent="flex-end">
                  <Controls.Button
                    text="New Banner"
                    variant="contained"
                    startIcon={<AddIcon />}
                    className="cm_ui_button"
                    onClick={() => handleAddBanner()}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          {loader && <Loader />}
          {bannerList?.length ? <BannersTable handleAddBanner={handleAddBanner} bannerList={bannerList}
            deleteBanner={deleteBannerF} pageNo={pageNo} itemsPerPage={itemsPerPage} handleBannerStatus={handleBannerStatus} activeBanners={activeBanners} /> :
            <Alert severity="error">No Content Available!</Alert>}
        </Container>

        <div className='center cm_pagination'>
          <Pagination pageNo={pageNo} setPagination={setPagination} lastPage={lastPage}/>
        </div>
      </Page>


      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={deletePopup}
        closeAfterTransition
      >
        <Fade in={deletePopup}>
          <Box className={classes.modalPaper + " modal-box modal-md"} id="transition-modal-title">
            <Box className="modal-header p-1" >
              <Typography variant="subtitle1" className={classes.modalTitle + " modal-header-title"} >
                {`Are you sure to delete "${deleteObj?.bannerName}" ?`}
              </Typography>
            </Box>
            {/* <Box className="modal-content text-left"> */}
            <Box className="modal-footer text-right" >
              <Button onClick={handleCancelDelete} className={" report_form_ui_btn cancel mr-2"} color="primary" variant="outlined" > Cancel </Button>
              <Button onClick={submitDeleteMenu} color="primary" autoFocus className={" report_form_ui_btn submit"} variant="contained"> Submit </Button>
            </Box>
            {/* </Box> */}
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default BannerManagement;
