import { useState } from 'react';
import { Container, TextField, Button, Grid, Card, Pagination, InputAdornment, Link, Modal, Box, Typography, CircularProgress, LinearProgress } from "@mui/material";
import Page from "../components/Page";
import _ from 'lodash';
import React from 'react'
import { getLogsList } from '../config/services/targetincentivelog';
import { downloadSample, uploadTargetIncentive } from '../config/services/targetincentive';
import LinearProgressWithLabel from '../components/targetIncentiveManagement/LinearProgressWithLabel';
import PopupTable from '../components/targetIncentiveManagement/PopupTable';
import toast from 'react-hot-toast';
import { useEffect } from 'react';
import SearchIcon from '../assets/icons/icon_search.svg';
import CrossIcon from "../assets/image/crossIcn.svg"
import LeadTable from '../components/targetIncentiveManagement/LeadTable';
import ReactSelect from 'react-select'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 450,
    bgcolor: 'background.paper',
    boxShadow: 0,
    borderRadius: 1,
    p: 4,
};
const TargetIncentiveManagement = () => {
    const [excelFile, setExcelFile] = useState('');
    const [value, setValue] = React.useState("ROLE");
    const [pageModal, setPageModal] = useState(false);
    const [uploadCompleteModal, setUploadCompleteModal] = useState(false);
    const [showTable, setShowTable] = useState(true)
    const [targetIncentiveList, setTargetIncentiveList] = useState([])
    const [pageNo, setPagination] = useState(1)
    const [cycleTotalCount, setCycleTotalCount] = useState(0)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [search, setSearchValue] = useState('')
    const [sortObj, setSortObj] = useState({ sortKey: 'createdAt', sortOrder: '-1' })
    const [dataToAdd, setDataToAdd] = React.useState({});
    const [createdBy] = useState(JSON.parse(localStorage.getItem('userData'))?.name);
    const [createdBy_Uuid] = useState(JSON.parse(localStorage.getItem('loginData'))?.uuid);
    const [errorFileLength, setErrorFileLength] = useState(0)
    const [successFileLength, setSuccessFileLength] = useState(0)
    const [successFile, setSuccessFile] = useState('')
    const [errorFile, setErrorFile] = useState('')
    const [fileName, setFileName] = useState('Select attach file')
    const [loader, setLoader] = useState(false)
    const [uploadMessage, setUploadMessage] = useState('')

    const options = [
        { value: 'ROLE', label: 'Role' },
        { value: 'PROFILE', label: 'Profile' }]


    const handleChange = (e) => {
        setValue(e.target.value);
    };

    const handlePagination = (e, pageNumber) => {
        setPagination(pageNumber)
    }

    let totalPages = Number((cycleTotalCount / itemsPerPage).toFixed(0))
    if ((totalPages * itemsPerPage) < cycleTotalCount)
        totalPages = totalPages + 1;

    function onFileUpload(e) {
        const fileName = e.target.files[0].name
        const fileExtension = fileName.replace(/^.*\./, "")

        if (fileExtension === 'xls' || fileExtension === 'xlsx' || fileExtension === 'csv') {
            setExcelFile(e.target?.files?.[0]);
            setFileName(fileName)
        }
        else {
            toast.error('File format not supported')
            setExcelFile('')
            return false
        }

    }
    const handleSearch = (e) => {
        let { value } = e.target
        setPagination(1)
        setSearchValue(value, () => setPagination(1))
    }

    const togglePageModal = () => {
        setPageModal(!pageModal);
        setShowTable(false)
    };

    const toggleUploadCompleteModal = () => {
        setUploadCompleteModal(!uploadCompleteModal);
        setShowTable(false)
    };

    const show = () => {
        setShowTable(true)
    }

    const fetchTargetList = async () => {
        let params = { pageNo: (pageNo - 1), count: itemsPerPage, ...sortObj, search }
        getLogsList(params)
            .then((res) => {
                setCycleTotalCount(res?.totalCount)
                setTargetIncentiveList(res?.result)
            })
            .catch((err) => {
                console.log(err, '..error')
            })
    }

    const handleSort = (key) => {
        let newOrder = sortObj?.sortOrder === '-1' ? '1' : '-1'
        setSortObj({ sortKey: key, sortOrder: newOrder })
    }

    const handleDownload = async () => {
        setLoader(true)
        downloadSample()
            .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'Sample.csv');
                document.body.appendChild(link);
                link.click();
                setLoader(false)
            });
    }

    const uploadData = (data) => {
        let formData = new FormData();
        formData.append('type', value)
        formData.append('targetIncentive', excelFile)
        formData.append('createdBy', createdBy)
        formData.append('createdBy_Uuid', createdBy_Uuid)
        setUploadMessage('')
        setSuccessFile('')
        setErrorFile('')
        setErrorFileLength(0)
        setSuccessFileLength(0)
        uploadTargetIncentive(formData)
            .then(res => {
                if (res?.result) {
                    setUploadMessage(res?.message)
                    fetchTargetList()
                    setErrorFileLength(res.logsSaved.errorFile.length)
                    setErrorFile(res.logsSaved.errorFile)
                    setSuccessFileLength(res.logsSaved.successFile.length)
                    setSuccessFile(res.logsSaved.successFile)
                }
                else if (res?.data.statusCode === 0) {
                    let { errorMessage } = res?.data?.error
                    toast.error(errorMessage)
                    setTimeout(() => {
                        setPageModal(false)
                        showTable(true)
                    }, 2000)


                }
                else {
                    console.error(res);
                    setTimeout(() => {
                        setPageModal(false)
                        showTable(true)
                    }, 2000)
                }
            })
    }

    const handleSubmit = () => {
        let filledDetails = _.cloneDeep(dataToAdd);
        filledDetails.type = value;
        filledDetails.fileName = excelFile;
        togglePageModal();
        uploadData(filledDetails)
        setFileName('Select attach file')
        setExcelFile()
    }

    const emptyExcelFile = () => {
        setExcelFile();
        setFileName('Select attach file')
    }

    const handlePageInfoModal = () => {
        togglePageModal();
        toggleUploadCompleteModal()
    }

    useEffect(() =>
        fetchTargetList(), [search, sortObj, pageNo, itemsPerPage]
    );

    return (
        <>
            <div className='targetIncentiveManagementContainer'>
                <Page title="Extramarks | Target/Incentive" className="main-container datasets_container">
                    <div className='card'>
                        <h2 className='heading'>Manage Target / Incentive</h2>
                        <p className='subHead'>Upload target file</p>
                        <h3 className='subheading'>Type: Role</h3>
                        <div className='dropDownContainer'>

                            {value && <>
                                <h3 className='subheading'>Upload a file</h3>
                                <div className="uploaderFile">
                                    <label className={fileName?.length <= 26 ? "placeholder" : "bigFileName"}>{fileName}</label>

                                    {!excelFile ?
                                        <div className="uploaderFile-btn" onChange={(e) => onFileUpload(e)} id="outlined-basic" >
                                            <label className='browse' for="lecture_note" >Browse</label>
                                            <input style={{ display: 'none' }} id="lecture_note" type="file" accept=".csv,.xls,.xlsx" />
                                        </div>
                                        :
                                        <Button style={{ color: 'black', fontSize: '19px', marginRight: '-14px', cursor: 'default' }} onClick={emptyExcelFile}>X</Button>
                                    }

                                </div>
                                <span className='noteHead' >Note:Excel must be in XLsx,Xls,CSV format</span>
                                <div style={{ display: 'flex' }}>
                                    <div>
                                        <Link className='box-col-pointer' onClick={handleDownload}>Download Sample</Link>
                                    </div>
                                    <div>
                                        {loader && <CircularProgress className='dndIcon' style={{ width: '20px', height: '20px', marginTop: '3px', marginLeft: '4px' }} />}
                                    </div>
                                </div>

                            </>
                            }

                            {pageModal &&
                                <Modal
                                    hideBackdrop={true}
                                    open={pageModal}
                                    aria-labelledby="modal-modal-title"
                                    aria-describedby="modal-modal-description"
                                    className="targetModal1"

                                >
                                    <Box sx={style} className="modalContainer">
                                        <img onClick={() => { togglePageModal(); show() }} className='crossIcon' src={CrossIcon} alt="" />

                                        <Typography id="modal-modal-title" className='titlemodal' component="h2" align="center">
                                            Page Information
                                        </Typography>
                                        <Typography id="modal-modal-description" className='modalsubhead' sx={{ mt: 2 }}>
                                            Loading Using Bulk Data
                                        </Typography>
                                        <Typography id="modal-modal-description" >
                                            <LinearProgressWithLabel uploadMessage={uploadMessage} />
                                        </Typography>
                                        {uploadMessage ?
                                            <>
                                                <Typography className='modalLightHead'>
                                                    Processed {successFileLength + errorFileLength} records. There are {successFileLength} success and {errorFileLength} errors
                                                </Typography>

                                                <button className='modalbtn' onClick={() => { handlePageInfoModal() }}>OK</button>
                                            </> :
                                            <button className='modalbtn' style={{ cursor: 'not-allowed', marginTop: '15px' }}>OK</button>

                                        }

                                    </Box>
                                </Modal>
                            }

                            {uploadCompleteModal &&
                                <Modal hideBackdrop={true}
                                    open={uploadCompleteModal}
                                    aria-labelledby="modal-modal-title"
                                    aria-describedby="modal-modal-description"
                                    className="targetModal1"
                                >
                                    <Box sx={style} className="modalContainer">
                                        <img onClick={() => { toggleUploadCompleteModal(); show() }} className='crossIcon' src={CrossIcon} alt="" />

                                        <Typography id="modal-modal-title" variant="h6" component="h2" align="center">
                                            Import process completed
                                        </Typography>
                                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                            <PopupTable successFile={successFile} successFileLength={successFileLength} errorFile={errorFile} errorFileLength={errorFileLength} />
                                        </Typography>
                                    </Box>
                                </Modal>
                            }
                            <br></br>
                        </div>
                    </div>

                    {value && excelFile && !pageModal && !uploadCompleteModal &&
                        <div className='submitBtnContainer'>
                            <div className='btn' onClick={handleSubmit} >Submit</div>
                        </div>
                    }
                    <div className='card' style={{ marginTop: 30 }}>
                        {showTable &&
                            <div >
                                <div className='my_leads_card3_div'>
                                    <div>
                                        <div style={{ fontSize: 18, fontWeight: "600" }}>File Logs</div>
                                    </div>
                                </div>
                                <TextField className={`inputRounded search-input`} type="search"
                                    placeholder="Search By File Name"
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

                                <LeadTable list={targetIncentiveList} value={value} pageNo={pageNo} itemsPerPage={itemsPerPage} search={search} sortObj={sortObj} handleSort={handleSort} />
                                <div className='center cm_pagination'>
                                    <Pagination count={totalPages} variant="outlined" color="primary" onChange={handlePagination} page={pageNo} />
                                </div>
                            </div>
                        }
                    </div>
                </Page>
            </div >
        </>
    )
}
export default TargetIncentiveManagement