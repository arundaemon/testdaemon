import React, { useState, useEffect } from 'react'
import Page from '../components/Page';
import { Container, Breadcrumbs, TextField, Link, Stack, Button, NavigateNextIcon, Alert, Pagination, Grid, InputAdornment, Modal, Fade, Box, Typography } from "@mui/material";
//import Condiontaldropdown from './Condiontaldropdown';
import { makeStyles } from '@mui/styles'
import BannerComp from './BannerComp.jsx';
import Controls from "../components/controls/Controls";
import _ from 'lodash';
import { saveBanner, getBannerDetails, updateBanner } from '../config/services/banners';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import Select from 'react-select';
import BreadcrumbArrow from '../assets/image/bredArrow.svg';


const usestyles = makeStyles({
  img: {
    top: "45px",
    left: "223px",
    width: "334px",
    height: "150px",
    opacity: "1",
  }
})

export default function BannerDetails(props) {
  const classes = usestyles();
  const [appImage, setAppImage] = useState();
  const [appBannerImageName, setAppBannerImageName] = useState('')
  const [appBannerPdfName, setAppBannerPdfName] = useState('')
  const [webImage, setWebImage] = useState();
  const [webBannerImageName, setWebBannerImageName] = useState('')
  const [webBannePdfName, setWebBannerPdfName] = useState('')
  const [appDisplay, setAppDisplay] = useState();
  const [webDisplay, setWebDisplay] = useState();
  const [webBannerPdfRedirect, setWebBannerPdfRedirect] = useState('');
  const [appBannerPdfRedirect, setAppBannerPdfRedirect] = useState('');
  const [status, setStatus] = useState({});
  const [startdate, setStartDate] = useState(new Date());
  const [enddate, setEndDate] = useState(new Date());
  const [savingLoader, setSavingLoader] = useState(false);
  const [createdBy] = useState(JSON.parse(localStorage.getItem('userData'))?.name);
  const [createdBy_Uuid] = useState(JSON.parse(localStorage.getItem('userData'))?.uuid);
  const [modifiedBy] = useState(JSON.parse(localStorage.getItem('userData'))?.name);
  const [modifiedBy_Uuid] = useState(JSON.parse(localStorage.getItem('userData'))?.uuid);
  const [allFields, setAllFields] = useState({ createdBy, modifiedBy, createdAt: new Date(), updatedAt: new Date() });
  const CHARACTER_LIMIT = 20;

  const { id } = useParams();

  const navigate = useNavigate();

  const Genres = [
    { value: "PDF", redirectToType: "file", label: "Upload PDF" },
    { value: "URL", redirectToType: "text", label: "URL" },
  ];

  const cancelSubmit = () => {
    navigate('/authorised/banner-management')
  }

  const fetchBannerDetails = async () => {
    if (!id)
      return

    getBannerDetails({ bannerId: id })
      .then((res) => {
        if (res?.result) {
          let { result } = res

          result.webBannerDetails = result.webBanner
          result.appBannerDetails = result.appBanner


          let appBanner = result?.appBanner?.bannerUrl
          let appBannerPDF = result?.appBanner?.redirectUrl
          let appBannerImageName = appBanner?.substring(appBanner?.lastIndexOf('/') + 1)
          let appBannerPDFName = appBannerPDF?.substring(appBannerPDF.lastIndexOf('/') + 1)
          let webBanner = result?.webBanner?.bannerUrl
          let webBannerImageName = webBanner?.substring(webBanner?.lastIndexOf('/') + 1)
          let WebBannerPdf = result?.webBanner?.redirectUrl
          let WebBannerPdfName = WebBannerPdf?.substring(WebBannerPdf?.lastIndexOf('/') + 1)
          setAppBannerImageName(appBannerImageName)
          setAppBannerPdfName(appBannerPDFName)
          setWebBannerImageName(webBannerImageName)
          setWebBannerPdfName(WebBannerPdfName)

          let FindWebBannerRedirectType = Genres.find(obj => obj?.redirectToType === result?.webBannerDetails?.redirectToType)
          let FindAppBannerRedirectType = Genres.find(obj => obj?.redirectToType === result?.appBannerDetails?.redirectToType)


          if (FindWebBannerRedirectType) {
            result.webBannerDetails = { ...result.webBannerDetails, ...FindWebBannerRedirectType }
          }

          if (FindAppBannerRedirectType) {
            result.appBannerDetails = { ...result.appBannerDetails, ...FindAppBannerRedirectType }
          }

          setAllFields(res?.result)
        }
      })
      .catch((err) => {
        console.log(err);
      })
  }

  useEffect(() => fetchBannerDetails(), []);

  function handleNavigation(path) {
    navigate(path)
  }

  function handleChange(e) {
    let { value, name } = e?.target
    let tempState = _.cloneDeep(allFields)
    tempState[name] = value;
    setAllFields(tempState);
  }

  function onAppImage(e) {
    setAppImage(e.target.files[0]);
    setAppBannerImageName(e.target.files[0]?.name)
    setAppDisplay(URL.createObjectURL(e.target.files[0]));

  }

  function onWebImage(e) {
    setWebImage(e.target.files[0]);
    setWebBannerImageName(e.target.files[0]?.name)
    setWebDisplay(URL.createObjectURL(e.target.files[0]));
  }


  const handleSelect = (selectedOption, type) => {
    let tempState = _.cloneDeep(allFields)
    tempState[type] = { ...tempState[type], ...selectedOption, };
    setAllFields(tempState)
  };


  const handleUpload = (fileSelected, type) => {
    let tempState = _.cloneDeep(allFields)

    switch (allFields[type]?.redirectToType) {
      case 'text':
        let { value } = fileSelected?.target
        tempState[type].redirectUrl = value
        setAllFields(tempState)
        break
      case 'file':
        if (type === 'webBannerDetails') {
          setWebBannerPdfRedirect(fileSelected?.target?.files[0])
          setWebBannerPdfName(fileSelected?.target?.files[0]?.name)
        }
        else if (type === 'appBannerDetails') {
          setAppBannerPdfRedirect(fileSelected?.target?.files[0])
          setAppBannerPdfName(fileSelected?.target?.files[0]?.name)
        }

        break
    }
  }

  const handleSelectStatus = (status) => {
    let tempState = _.cloneDeep(allFields)
    tempState['status'] = status?.value;
    setAllFields(tempState)
  };


  function handlePriorityChange(e) {
    // console.log("e inside priority change",e)
    let { value } = e
    let tempState = _.cloneDeep(allFields)
    tempState['priority'] = value;
    setAllFields(tempState);
  }


  function handleCreatedbyChange(e) {
    let { value, name } = e?.target
    let tempState = _.cloneDeep(allFields)
    tempState[name] = value;
    setAllFields(tempState);
  }

  function handleModifybyChange(e) {

    let { value, name } = e?.target
    let tempState = _.cloneDeep(allFields)
    tempState[name] = value;
    setAllFields(tempState);
  }

  function handleStartDate(startdate, name) {
    let tempState = _.cloneDeep(allFields)
    tempState[name] = startdate;
    tempState['endDate'] = null
    setAllFields(tempState);
  }


  function handleEndDate(enddate, name) {
    let tempState = _.cloneDeep(allFields)
    tempState[name] = enddate;
    setAllFields(tempState);
  }

  const submitBannerDetails = async () => {
    let formData = new FormData();    //formdata object
    if (id) {
      formData.append('bannerId', id)
      // formData.append('status', allFields?.status)
    }

    formData.append('bannerName', allFields?.bannerName)
    formData.append('webBanner', webImage)
    formData.append('appBanner', appImage)
    formData.append('priority', allFields?.priority)
    formData.append('startDate', allFields?.startDate)
    formData.append('endDate', allFields?.endDate)
    formData.append('appBannerDetails', JSON.stringify(allFields?.appBannerDetails))
    formData.append('webBannerDetails', JSON.stringify(allFields?.webBannerDetails))
    formData.append('webBannerPdf', webBannerPdfRedirect)
    formData.append('appBannerPdf', appBannerPdfRedirect)
    formData.append('createdBy', createdBy ?? null)
    formData.append('createdBy_Uuid', createdBy_Uuid ?? null)
    formData.append('modifiedBy', modifiedBy ?? null)
    formData.append('modifiedBy_Uuid', modifiedBy_Uuid ?? null)
    formData.append('status', allFields?.status)
    setSavingLoader(true)

    if (id) {
      return updateBanner(formData)
        .then(res => {
          setSavingLoader(false)
          if (res?.result) {
            navigate('/authorised/banner-management')
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
    saveBanner(formData)
      .then(res => {
        setSavingLoader(false)
        if (res?.result) {
          navigate('/authorised/banner-management')
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

  const emptyAppBannerImageName = () => {
    setAppBannerImageName('')
  }
  const emptyWebBannerImageName = () => {
    setWebBannerImageName('')
  }

  const emptyAppBannerPdfName = () => {
    setAppBannerPdfName('')
  }

  const emptyWebBannerPdfName = () => {
    setWebBannerPdfName('')
  }

  return (
    <Page title="Extramarks | Banner Details" className="main-container datasets_container">
      <Stack spacing={2}>
        <Breadcrumbs separator={<img src={BreadcrumbArrow} alt="Arrow" />} aria-label="breadcrumb" style={{ marginLeft: "20px", cursor: 'pointer' }}>
          <Link underline="hover" key="1" color="inherit" onClick={() => handleNavigation('/authorised/banner-management')}>
            Manage Banner
          </Link>,

          <Typography key="2" color="text.primary">
            {id ? "Update" : "Create"}
          </Typography>
        </Breadcrumbs>
      </Stack>
      <div className='baner-container'>
        <h2>{id ? "Update" : "Create"} Banner</h2>
        {/* <p>Loremispum Loremispum Loremispum</p> */}
        <Container className="table_max_width">
          <Grid
            container
            alignItems="left"
            justifyContent="flex-start"
            spacing={1}
          >
          </Grid>
        </Container>

        <h3>Banner Name</h3>
        <TextField className='baner-name' name="bannerName" type="text" value={allFields?.bannerName} onChange={handleChange} id="outlined-basic" variant="outlined" inputProps={{ maxLength: CHARACTER_LIMIT }} />
        <h3>App Banner</h3>

        <Grid container spacing={2}>
          <Grid item xs={4} sm={4} md={4} lg={5}>
            {appBannerImageName ?

              <div style={{ display: 'flex' }}>
                <div style={{ width: '100%' }}>
                  < TextField value={appBannerImageName} className='chosefile' disabled InputProps={{ sx: { height: 38, borderRadius: '4px' } }} />
                </div>
                <div>
                  <Button style={{ color: 'black', fontSize: '19px', cursor: 'default' }} onClick={emptyAppBannerImageName}>X</Button>
                </div>
              </div>
              :
              <TextField className='chosefile'
                inputProps={{ accept: '.png,.jpg' }}
                InputProps={{ sx: { height: 38, borderRadius: '4px', width: '100%' } }} type="file" onChange={(e) => onAppImage(e)} id="outlined-basic" variant="outlined" />}
          </Grid>

          <Grid item xs={4} sm={4} md={2} lg={2}>
            <h4 className='redirectTo'>Redirect to</h4>
            <Select
              className='redirect-select'
              InputProps={{ sx: { height: '38px', borderRadius: '4px' } }}
              classNamePrefix="select"
              options={Genres}
              onChange={(val) => handleSelect(val, 'appBannerDetails')}
              value={allFields['appBannerDetails']}
            />
          </Grid>
          <Grid item xs={7} sm={7} md={7} lg={5}>
            {(appBannerPdfName && allFields['appBannerDetails']?.redirectToType !== 'text') ?

              <div style={{ display: 'flex' }}>
                <div style={{ width: '100%' }}>
                  < TextField value={appBannerPdfName} className='chosefile' disabled InputProps={{ sx: { height: 38, borderRadius: '4px' } }} />
                </div>
                <div>
                  <Button style={{ color: 'black', fontSize: '19px', cursor: 'default' }} onClick={emptyAppBannerPdfName}>X</Button>
                </div>
              </div>
              :
              <TextField className="upload_txt_field"
                sx={{ width: "100%" }}
                InputProps={{ sx: { height: 38, borderRadius: '4px' } }}
                inputProps={{ accept: "application/pdf" }}
                type={allFields['appBannerDetails']?.redirectToType}
                value={allFields['appBannerDetails']?.redirectToType === 'text' ? allFields['appBannerDetails']?.redirectUrl : null}
                onChange={(val) => handleUpload(val, 'appBannerDetails')} id="outlined-basic" variant="outlined" />
            }
            {allFields['appBannerDetails']?.redirectUrl ?
              <a target='_blank' className='pdf-url' href={allFields['appBannerDetails']?.redirectUrl}>Redirection Link </a> : null}
          </Grid>
        </Grid>


        {appBannerImageName &&
          <Grid item xs={4} sm={4} md={4} lg={4}>
            <img src={appDisplay ?? allFields?.appBannerDetails?.bannerUrl} width="334" height="150px" className='baner-image' />
          </Grid>
        }



        <h3>Web Banner</h3>
        <Grid container spacing={2}>
          <Grid item xs={4} sm={4} md={4} lg={5}>
            {webBannerImageName ?
              <div style={{ display: 'flex' }}>
                <div style={{ width: '100%' }}>
                  < TextField value={webBannerImageName} className='chosefile' disabled InputProps={{ sx: { height: 38, borderRadius: '4px', width: '100%' } }} />
                </div>
                <div>
                  <Button style={{ color: 'black', fontSize: '19px', cursor: 'default' }} onClick={emptyWebBannerImageName}>X</Button>
                </div>
              </div>
              :
              <TextField sx={{ width: "100%" }}
                inputProps={{ accept: '.png,.jpg*' }}
                InputProps={{ sx: { height: 38, borderRadius: '4px' } }}
                type="file" onChange={(e) => onWebImage(e)} id="outlined-basic" variant="outlined" />}
          </Grid>
          <Grid item xs={4} sm={4} md={4} lg={2}>
            <h4 className='redirectTo'>Redirect to</h4>
            <Select className='redirect-select'
              InputProps={{ sx: { height: '38px', borderRadius: '4px' } }}
              classNamePrefix="select"
              options={Genres}
              onChange={(val) => handleSelect(val, 'webBannerDetails')}
              value={allFields['webBannerDetails']}
            />
          </Grid>
          <Grid item xs={5} sm={5} md={5} lg={5}>
            {(webBannePdfName && allFields['webBannerDetails']?.redirectToType !== 'text') ?
              <div style={{ display: 'flex' }}>
                <div style={{ width: '100%' }}>
                  < TextField value={webBannePdfName} className='chosefile' disabled InputProps={{ sx: { height: 38, borderRadius: '4px', width: '100%' } }} />
                </div>
                <div>
                  <Button style={{ color: 'black', fontSize: '19px', cursor: 'default' }} onClick={emptyWebBannerPdfName}>X</Button>
                </div>
              </div>
              :
              <TextField className="upload_txt_field"
                sx={{ width: "100%" }}
                InputProps={{ sx: { height: 38, borderRadius: '4px' } }}
                inputProps={{ accept: "application/pdf" }}
                type={allFields['webBannerDetails']?.redirectToType}
                value={allFields['webBannerDetails']?.redirectToType === 'text' ? allFields['webBannerDetails']?.redirectUrl : null}
                onChange={(val) => handleUpload(val, 'webBannerDetails')} id="outlined-basic" variant="outlined" />
            }
            {allFields['webBannerDetails']?.redirectUrl ?
              <a target='_blank' className='pdf-url' href={allFields['webBannerDetails']?.redirectUrl}>Redirection Link </a> : null}
          </Grid>
        </Grid>



        {webBannerImageName &&
          <Grid item xs={4} sm={4} md={4} lg={4}>
            <img src={webDisplay ?? allFields?.webBannerDetails?.bannerUrl} width="334" height="150px" className='baner-image' />
          </Grid>
        }

        <BannerComp
          allFields={allFields}
          status={status}
          handlePriorityChange={handlePriorityChange}
          handleCreatedbyChange={handleCreatedbyChange}
          handleModifybyChange={handleModifybyChange}
          handleSelectStatus={handleSelectStatus}
          startdate={startdate}
          enddate={enddate}
          handleStartDate={handleStartDate}
          handleEndDate={handleEndDate}
          id={id}
        />
      </div>
      <Grid>
        <Grid container justifyContent="flex-end">
          <Grid >
            <Controls.Button
              text="Cancel"
              variant="contained"
              className="cm_ui_button baner"
              onClick={cancelSubmit}
            />
          </Grid>

          <Grid>
            <Controls.Button
              text={savingLoader ? "uploading..." : "Upload"}
              disabled={savingLoader}
              variant="contained"
              className="cm_ui_button baner"
              onClick={submitBannerDetails}
            />
          </Grid>
        </Grid>
      </Grid>

    </Page>
  )
}


