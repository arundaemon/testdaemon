import React, { useEffect, useState, useCallback } from 'react'
import Page from "../Page";
import DatePicker from "react-datepicker";
import { TextField, Grid, InputAdornment, Modal, Box, Typography, Link, CircularProgress, TablePagination, Button } from "@mui/material";
import { useNavigate, useParams } from 'react-router-dom';
import SearchIcon from '../../assets/icons/icon_search.svg';
import LinearWithValueLabel from '../targetIncentiveManagement/LinearProgressWithLabel';
import LeadTable from './LeadTable';
import { downloadSample, uploadLead } from '../../config/services/lead';
import { updateCampaign } from '../../config/services/campaign'
import { getCampaignDetails } from '../../config/services/campaign';
import toast from 'react-hot-toast';
import _ from 'lodash';
import _debounce from 'lodash/debounce';
import moment from 'moment';
import CrossIcon from "../../assets/image/crossIcn.svg"
import ImportIcon from "../../assets/image/importIcon.svg"
import DownloadIcon from "../../assets/image/downloadIcon.svg"
import { makeStyles } from '@mui/styles';
import Revenue from "../../components/MyLeads/Revenue";
import Slider from "../../components/MyLeads/Slider";
import { DisplayLoader } from '../../helper/Loader';
import { getLoggedInRole } from '../../utils/utils';
import { getAllChildRoles } from '../../config/services/hrmServices';
import BatchListModal from './BatchListModal';
import { getLeadAssignList } from '../../config/services/leadassign';
import { DecryptData, EncryptData } from '../../utils/encryptDecrypt';


const useStyles = makeStyles((theme) => ({
	cusCard: {
		padding: "2px",
		boxShadow: "0px 0px 8px #00000029",
		height: "100%",
		borderRadius: "8px",
	},
	RevenueCard: {
		padding: "0px",
		overflow: "hidden",
	},
}));


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

const UpdateCampaign = () => {
	const classes = useStyles();
	const [excelFile, setExcelFile] = useState();
	const [appDisplay, setAppDisplay] = useState();
	const [checked, setChecked] = React.useState(false);
	const [uploadModal, setUploadModal] = useState(false);
	const [batchModal, setBatchModal] = useState(false);
	const [progressModal, setProgressModal] = useState(false)
	const [uploadCompleteModal, setUploadCompleteModal] = useState(false)
	const [campaignName, setCampaignName] = useState()
	const [campaignOwner, setCampaignOwner] = useState()
	const [startDate, setStartDate] = useState(null)
	const [endDate, setEndDate] = useState(null)
	const [copyEndDate, setCopyEndDate] = useState(null)
	const [leadList, setLeadList] = useState([])
	const navigate = useNavigate();
	const [dataToAdd, setDataToAdd] = useState({});
	const [recordForEdit, setRecordForEdit] = useState({});
	const [cycleTotalCount, setCycleTotalCount] = useState(0)
	const [itemsPerPage, setItemsPerPage] = useState(10)
	const [pageNo, setPagination] = useState(1)
	const [sortObj, setSortObj] = useState({ sortKey: "updatedAt", sortOrder: '-1' })
	const [search, setSearchValue] = useState('')
	const [source, setSource] = useState()
	const [subSource, setSubSource] = useState()
	const [successFile, setSuccessFile] = useState([])
	const [errorFile, setErrorFile] = useState([])
	const [errorFileLength, setErrorFileLength] = useState(0)
	const [successFileLength, setSuccessFileLength] = useState(0)
	const [fileName, setFileName] = useState('Attach file')
	const [createdBy] = useState(JSON.parse(localStorage.getItem('userData'))?.username);
	const [createdBy_Uuid] = useState(JSON.parse(localStorage.getItem('loginData'))?.uuid);
	const [modifiedBy] = useState(JSON.parse(localStorage.getItem('userData'))?.username);
	const [modifiedBy_Uuid] = useState(JSON.parse(localStorage.getItem('loginData'))?.uuid);
	const [sourceName, setSourceName] = useState('')
	const [subSourceName, setSubSourceName] = useState('')
	const [isDownloading, setIsDownloading] = useState(false)
	const [leadSize, setLeadSize] = useState(false)
	const [loader, setLoader] = useState(false)
	const [uploadError, setUploadError] = useState(false)
	const [rolesList, setRoleslist] = useState([]);
	const [value, setValue] = useState("");
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [batchList, setBatchList] = useState([]);
	const [uploadMessage, setUploadMessage] = useState('')

	const { campaignId } = useParams();

	const handleTypeChange = (e) => {
		setValue(e.target.value);
	};

	const parseSubSource = (subSourceId, subSources) => {
		let subSourceName = subSources?.find(item => item?._id === subSourceId)
		return subSourceName
	}


	const handleDownload = async () => {
		setIsDownloading(true)
		downloadSample()
			.then((response) => {
				const url = window.URL.createObjectURL(new Blob([response.data]));
				const link = document.createElement('a');
				link.href = url;
				link.setAttribute('download', 'SampleFile.xlsx');
				document.body.appendChild(link);
				link.click();
				setIsDownloading(false)
			});
	}

	const handleCampaignName = (e) => {
		setCampaignName(e.target.value)
	}

	const handleCampaignOwner = (e) => {
		setCampaignOwner(e.target.value)
	}

	const toggleUploadModal = () => {
		setUploadModal(!uploadModal);
		setFileName('Attach file')
		setExcelFile()
	};
	const toggleProgressModal = () => {
		setProgressModal(!progressModal);
	}
	const toggleUploadCompleteModal = () => {
		setUploadCompleteModal(!uploadCompleteModal);
	}
	function excelFileUpload(e) {
		const fileName = e.target.files[0].name
		const fileExtension = fileName.replace(/^.*\./, "")
		if (fileExtension === 'xls' || fileExtension === 'xlsx' || fileExtension === 'csv') {
			setExcelFile(e.target?.files?.[0]);
			setAppDisplay(URL.createObjectURL(e.target?.files?.[0]));
			setFileName(fileName)
		}
		else {
			toast.error('File format not supported')
			setAppDisplay('')
			setExcelFile('')
			return false
		}

	}

	const uploadData = (data) => {
		let formData = new FormData();
		formData.append('leads', excelFile)
		formData.append('campaignId', campaignId)
		formData.append('campaignName', campaignName)
		formData.append('sourceId', source)
		formData.append('subSourceId', subSource)
		formData.append('createdBy', createdBy)
		formData.append('createdBy_Uuid', createdBy_Uuid)
		formData.append('modifiedBy', modifiedBy)
		formData.append('modifiedBy_Uuid', modifiedBy_Uuid)
		formData.append('sourceName', sourceName)
		formData.append('subSourceName', subSourceName)

		uploadLead(formData)
			.then(res => {
				if (res?.logsSaved) {
					toast.success(res?.message)
					// setSuccessFile(res?.successFile)
					// setSuccessFileLength(res?.successFile.length)
					// setErrorFile(res?.errorFile)
					// setErrorFileLength(res?.errorFile.length)
					//fetchLeadList()
				}
				else if (res?.data?.statusCode === 0) {
					let { errorMessage } = res?.data?.error
					let wrongTemplateError = res?.data?.error?.errorMessage?.errorMessage;
					setUploadError(true)
					if (wrongTemplateError) {
						toast.error(wrongTemplateError)
					}
					else {
						toast.error(errorMessage)
					}
				}
				else {
					console.error(res);
					setUploadError(true)
				}
			})
	}

	const handleSubmit = () => {
		if (campaignName && campaignOwner && source && subSource && startDate && endDate && excelFile) {
			let filledDetails = _.cloneDeep(dataToAdd);
			filledDetails.fileName = excelFile;
			uploadData(filledDetails)
			if (!uploadError) {
				toggleProgressModal()
			}
			toggleUploadModal();
			setUploadError(false)
			fetchLeadAssignmentList()
		}
		else if (!excelFile) {
			toast.error('Please upload excel file')
		}
		else {
			toast.error('X')
		}
	}

	const handlePagination = (e, pageNumber) => {
		setPagination(pageNumber)
	}

	// const getConfigs = () => {
	//     getCampaignDetails()
	//         .then((res) => {
	//             setConfigDetails(res?.data?.[0])
	//             
	//         })
	// }

	const handleSearch = (e) => {
		let { value } = e.target
		setPagination(1)
		setSearchValue(value, () => setPagination(1))
	}

	const handleChangeRowsPerPage = (event) => {
		setLoader(!loader)
		setRowsPerPage(parseInt(event.target.value, 10));
		setPagination(1);
		setItemsPerPage(event.target.value)
	};

	const handleSort = (key) => {
		let newOrder = sortObj?.sortOrder === '-1' ? '1' : '-1'
		setSortObj({ sortKey: key, sortOrder: newOrder })
	}

	const handleChange = () => {
		setChecked(!checked);
	};

	const handleCancel = () => {
		navigate('/authorised/campaign-management')
	}

	const CampaignDetails = async () => {
		getCampaignDetails(campaignId)
			.then((res) => {
				if (res?.result) {
					let subSourceId = res?.result?.subSource
					let subSourceName = parseSubSource(subSourceId, res?.result?.source?.subSource)?.leadSubSourceName

					setRecordForEdit(res?.result)
					setCampaignName(res?.result?.campaignName)
					setCampaignOwner(res?.result?.campaignOwner)
					setSource(res?.result?.source?._id)
					setChecked(res?.result?.status)
					setStartDate(res?.result?.startDate)
					setEndDate(res?.result?.endDate)
					setCopyEndDate(res?.result?.endDate)
					setValue(res?.result?.type)
					setSubSource(subSourceId)
					setSourceName(res?.result?.source?.leadSourceName)
					setSubSourceName(subSourceName)
				}
			})
			.catch((err) => {
				console.log(err, '...error')
			})
	}

	const fetchAllChildRoles = () => {
		if (rolesList.length === 0) {
			let role_name = getLoggedInRole()
			getAllChildRoles({ role_name })
				.then(childRoles => {
					let { all_child_roles } = childRoles?.data?.response?.data ?? { childs: [] }
					setRoleslist(all_child_roles)
					localStorage.setItem('childRoles', EncryptData(all_child_roles))
				})
				.catch((err) => {
					console.log(err, 'error')
				})
		}
	}

	const fetchLeadAssignmentList = () => {
		let role_name = getLoggedInRole()
		setLoader(false)
		setLeadSize(false)
		let childRoles = DecryptData(localStorage.getItem('childRoles'))
		let childRoleNames = childRoles?.map(roleObj => roleObj?.roleName)
		childRoleNames.push(role_name)
		let queryData = { search, itemsPerPage, pageNo: (pageNo - 1), childRoleNames, ...sortObj, campaignId }
		getLeadAssignList(queryData)
			.then((res) => {
				let data = res?.result
				let totalCount = res?.totalCount
				setLeadList(data)
				setCycleTotalCount(totalCount)
				if (data?.length > 0) {
					setLeadSize(true)
				}
				else {
					setLeadSize(false)
				}
				setLoader(true)
			})
			.catch((err) => {
				console.log(err, 'error')
				setLoader(true)
				setLeadSize(false)
			})
	}

	let totalPages = Number((cycleTotalCount / itemsPerPage).toFixed(0))
	if ((totalPages * itemsPerPage) < cycleTotalCount)
		totalPages = totalPages + 1;


	const updateDetails = async (data) => {
		updateCampaign(data)
			.then(res => {
				if (res?.data) {
					toast.success(res?.message)
					navigate('/authorised/campaign-management')

				}
			})
			.catch((err) => {
				console.log(err, '...error')
			})
	}

	const handleUpdate = () => {
		if (campaignName && campaignOwner && startDate && endDate) {
			let filledDetails = _.cloneDeep(dataToAdd)
			filledDetails.campaignName = campaignName;
			filledDetails.campaignOwner = campaignOwner;
			filledDetails.status = checked
			filledDetails.startDate = moment(startDate).format('YYYY-MM-DD')
			filledDetails.endDate = moment(endDate).format('YYYY-MM-DD 23:59:59')
			filledDetails.type = value
			filledDetails._id = recordForEdit?._id
			setDataToAdd(filledDetails);
			updateDetails(filledDetails)
			navigate('/authorised/campaign-management')
		}
		else {
			toast.error('Fill all fields')
		}
	}

	const handleBatchModal = () => {
		setBatchModal(!batchModal);
	}

	const toCampaign = () => {
		navigate('/authorised/campaign-management')
		setSuccessFile([])
		setErrorFile([])
		setSuccessFileLength(0)
		setErrorFileLength(0)
		setUploadMessage('')
	}

	const closeUploadCompleteModal = () => {
		toggleUploadCompleteModal()
		setSuccessFile([])
		setErrorFile([])
		setSuccessFileLength(0)
		setErrorFileLength(0)
		setUploadMessage('')

	}

	const emptyExcelFile = () => {
		setExcelFile();
		setFileName('Select attach file')
	}

	const handleBatchTable = () => {

		navigate("/authorised/batch-table", { state: { campaignName: campaignName } })
	}

	const handleCampaignStatus = (date) => {
		date = moment.utc(date).local().format('X')
		return (date < moment().format('X'))
	}

	useEffect(() => {
		fetchLeadAssignmentList()
	}, [sortObj, pageNo, search, itemsPerPage])

	useEffect(() => {
		//getConfigs()
		let childRoles = localStorage.getItem('childRoles')
		if (childRoles) {
			setRoleslist(DecryptData(childRoles))
		} else {
			fetchAllChildRoles()
		}
	}, [])

	useEffect(() => {
		if (campaignId) {
			CampaignDetails();
		}
	}, [campaignId])

	useEffect(() => handleCampaignStatus(copyEndDate), [copyEndDate !== null])

	return (
		<Page title="Extramarks | Update Campaign Details" className="main-container compaignManagenentPage datasets_container targetIncentiveManagementContainer">
			<Grid container spacing={2} sx={{ p: "16px" }}>
				<Grid item xs={6}>
					<Grid className={`${classes.cusCard} ${classes.RevenueCard}`}>
						<Revenue />
					</Grid>
				</Grid>
				<Grid item xs={6}>
					<Grid className={`${classes.cusCard} ${classes.RevenueCard}`}>
						<Slider />
					</Grid>
				</Grid>
			</Grid>
			<div className='createCampaign' >
				<div className='baner-boxcontainer '>

					<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
						<div>
							<h4 className='heading' >Update Campaign</h4>
						</div>

						<div className='box' style={{ display: 'flex' }}>
							<div style={{ marginTop: '1px', marginRight: '30px' }}>
								<Link style={{
									cursor: 'pointer', color: "#4482FF", lineHeight: "19px", fontSize: "16px",
									fontWeight: "600",
									textDecorationColor: "#4482FF",
								}} onClick={handleBatchModal}>Check Batch</Link>
							</div>
							<div>

							</div>
							{!handleCampaignStatus(copyEndDate) &&
								<>
									<div style={{ marginTop: '10px', marginRight: '5px' }}>
										<img className='crossIcon' style={{ marginTop: '-2px', width: '13px' }} src={ImportIcon} alt="" />
									</div>
									<div>
										<Link style={{
											cursor: 'pointer', color: "#4482FF", lineHeight: "19px", fontSize: "16px",
											fontWeight: "600",
											textDecorationColor: "#4482FF",
										}} onClick={toggleUploadModal}>Import</Link>
									</div>
								</>
							}
						</div>
					</div>
					<div className='lableContainer'>
						<div className='containerCol'>
							<div className='box'>
								<label className='boxLabel'>Campaign Name</label>
								<TextField disabled className='label-text' name="campaignName" type="text" id="outlined-basic" variant="outlined" value={campaignName} onChange={handleCampaignName} />
							</div>
							<div className='box' >
								<label className='boxLabel'>Start Date</label>
								<DatePicker disabled className="dateInput" selected={new Date(startDate)} onChange={date => setStartDate(moment(date).format('YYYY-MM-DD'))} />
							</div>
							<div className='box' >
								<label className='boxLabel'>Type</label>
								<select value={value} onChange={handleTypeChange} style={{
									padding: "8px 16px",
									borderRadius: "4px", marginTop: '5px'
								}} >
									<option value="" >Select</option>
									<option value="SEMINAR">SEMINAR</option>
								</select>
							</div>
						</div>
						<div className='containerCol'>
							<div className='box'  >
								<label className='boxLabel'>Campaign Owner</label>
								<TextField disabled className='label-text' name="campaignOwner" type="text" id="outlined-basic" variant="outlined" value={campaignOwner} onChange={handleCampaignOwner} />
							</div>
							<div className='box'  >
								<label className='boxLabel'>End Date</label>
								<DatePicker className="dateInput" selected={new Date(endDate)} onChange={date => setEndDate(moment(date).format('YYYY-MM-DD'))} minDate={new Date(startDate)} />
							</div>
							<div className='box' style={{ marginTop: '70px' }}>
								<label>
									<input type="checkbox" checked={checked} onChange={handleChange} />
									Active
								</label>
							</div>
						</div>
					</div>
				</div >
				<div className='btnContainer' >
					<div onClick={handleCancel} className='cancleBtn' variant='outlined'>Cancel</div>
					<div onClick={handleUpdate} className='saveBtn' variant='contained'>Save</div>
					<div onClick={handleBatchTable} className='saveBtn' variant='contained'>Mobile View</div>
				</div>
				<div className='tableCardContainer' >

					<div>
						{(leadSize || search) &&
							<>
								<div className='contaienr'>
									<h4 className='heading'>Leads ({`${leadList?.length ? leadList?.length : "0"}`})</h4>
								</div>
								<TextField className={`inputRounded search-input`} type="search"
									placeholder="Search By Name & Mobile"
									value={search}
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
							</>
						}

						{loader && leadSize &&
							<LeadTable list={leadList} pageNo={pageNo} itemsPerPage={itemsPerPage} search={search} source={source} subSource={subSource} handleSort={handleSort} sortObj={sortObj} />
						}
						{!loader &&
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
						{loader && !leadSize &&
							<div
								style={{
									height: "15vh",
									width: "90vw",
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
									fontWeight: 600,
									fontSize: 18
								}}>
								<p>No Data Available</p>
							</div>
						}

						{loader && leadSize &&
							<div className='center cm_pagination'>
								<TablePagination
									component="div"
									page={pageNo}
									onPageChange={handlePagination}
									rowsPerPage={rowsPerPage}
									rowsPerPageOptions={[10, 50, 500, 1000]}
									onRowsPerPageChange={handleChangeRowsPerPage}
									labelDisplayedRows={({ page }) => {
										return `Page: ${page}`;
									}} />
							</div>
						}
					</div>
				</div>
			</div>
			{
				batchModal && <BatchListModal batchModal={batchModal} campaignName={campaignName} handleBatchModal={handleBatchModal} />
			}

			{
				uploadModal &&
				<Modal hideBackdrop={true}
					open={uploadModal}
					aria-labelledby="modal-modal-title"
					aria-describedby="modal-modal-description"
					className="targetModal1"


				>
					<Box sx={style} className="modalContainer" style={{ height: '200px', borderRadius: '8px' }}>
						<Typography align='right'>
							<img onClick={toggleUploadModal} className='crossIcon' src={CrossIcon} alt="" />
						</Typography>
						<Typography id="modal-modal-title" className='titlemodal' component="h1" align="center">
							Import Data
						</Typography>
						<div>
							<div>
								<h3 style={{
									fontSize: "18px",
									marginBottom: '10px',

									fontWeight: "600"
								}}>Upload file</h3>
							</div>

							<div style={{ display: 'flex' }}>

								<div style={{
									display: "flex",
									width: "400px",
									height: "38px",
									alignItems: "center",
									justifyContent: "space-between",
									border: "1px solid #dedede",
									padding: "9px 20px",
									borderRadius: "4px",
									textAlign: "left",
									transition: "all .3s"
								}}>
									{fileName.length <= 30 ?
										<label style={{ color: "#85888a", fontSize: "14px" }}>{fileName}</label> :
										<label style={{ color: "#85888a", fontSize: "14px", overflow: "hidden", textOverflow: 'ellipsis' }}>{fileName}</label>
									}

									{!excelFile ?
										<div style={{
											position: "relative",
											overflow: "hidden"
										}} onChange={(e) => excelFileUpload(e)} id="outlined-basic" >
											<label style={{

												fontSize: "14px",
												fontWeight: "500",
												color: "#4482FF",
												cursor: " pointer"
											}} for="lecture_note" >Browse Attach File</label>
											<input style={{ display: 'none' }} id="lecture_note" type="file" onChange={(e) => excelFileUpload(e)} accept=".csv,.xls,.xlsx" />
										</div>
										:
										<Button style={{ color: 'black', fontSize: '19px', marginRight: '-14px', cursor: 'default' }} onClick={emptyExcelFile}>X</Button>
									}
								</div>

								<div style={{ marginLeft: '50px', marginTop: '10px', display: 'flex' }}>

									<div style={{ display: 'flex', justifyContent: 'space-evenly', }}>
										{!isDownloading ?
											<img className='dndIcon' src={DownloadIcon} alt="" style={{ width: '20px', height: '20px', }} /> :
											<CircularProgress className='dndIcon' style={{ width: '23px', height: '23px' }} />
										}


										<Link style={{
											cursor: 'pointer', color: 'rgb(68, 130, 255)', lineHeight: '19px', fontSize: '17px', whiteSpace: 'nowrap', fontWeight: '600', textDecorationColor: 'rgb(68, 130, 255)', marginRight: '5px', marginLeft: '10px'
										}} onClick={handleDownload}>Download Sample</Link>
									</div>
								</div>
							</div>
						</div>
						{excelFile &&
							<button className='modalbtn' style={{ float: 'right', marginTop: '1px' }} onClick={() => { handleSubmit() }}>OK</button>
						}
					</Box>
				</Modal>
			}
			{
				(progressModal && !uploadError) &&
				<Modal
					hideBackdrop={true}
					open={progressModal}
					aria-labelledby="modal-modal-title"
					aria-describedby="modal-modal-description"
					className="targetModal1"

				>
					<Box sx={style} className="modalContainer" style={{ height: '190px', borderRadius: '8px' }}>
						<Typography align='right'>
							<img onClick={() => { toggleProgressModal(); toggleUploadCompleteModal() }} className='crossIcon' src={CrossIcon} alt="" />

						</Typography>
						<Typography id="modal-modal-title" className='titlemodal' component="h2" align="center">
							Import Data
						</Typography>


						<div>
							<h3 style={{
								fontSize: "18px",
								marginBottom: '10px',

								fontWeight: "600"
							}}>Upload file</h3>
						</div>
						<div style={{ display: 'flex' }}>
							<div style={{ width: '70%' }}>
								<div style={{
									display: "flex",
									width: "400px",
									height: "58px",
									alignItems: "center",
									justifyContent: "space-between",
									border: "1px solid #dedede",
									padding: "9px 20px",
									borderRadius: "4px",
									textAlign: "left",
									transition: "all .3s",
								}}>
									<LinearWithValueLabel uploadMessage={uploadMessage} />
								</div>
							</div>
							<div style={{ marginLeft: '50px', marginTop: '10px', display: 'flex' }}>

								<div style={{ display: 'flex', justifyContent: 'space-evenly', }}>
									{!isDownloading ?
										<img className='dndIcon' src={DownloadIcon} alt="" style={{ width: '20px', height: '20px', }} /> :
										<CircularProgress className='dndIcon' style={{ width: '23px', height: '23px' }} />
									}
									<Link style={{
										cursor: 'pointer', color: 'rgb(68, 130, 255)', lineHeight: '19px', fontSize: '17px', whiteSpace: 'nowrap', fontWeight: '600', textDecorationColor: 'rgb(68, 130, 255)', marginRight: '5px', marginLeft: '10px'
									}} onClick={handleDownload}>Download Sample</Link>
								</div>
							</div>
						</div>

					</Box>
				</Modal>
			}

			{
				(uploadCompleteModal && !uploadError) &&
				<Modal
					hideBackdrop={true}
					open={uploadCompleteModal}
					aria-labelledby="modal-modal-title"
					aria-describedby="modal-modal-description"
					className="targetModal1"

				>
					<Box sx={style} className="modalContainer" style={{ height: '230px', borderRadius: '8px' }}>
						<Typography align='right'>
							<img onClick={() => { closeUploadCompleteModal() }} className='crossIcon' src={CrossIcon} alt="" />

						</Typography>
						<Typography id="modal-modal-title" className='titlemodal' component="h2" align="center">
							Import Process Completed!
						</Typography>
						<Typography id="modal-modal-title" variant="h6" component="h2" align="center">
							Please come after sometime to check uploaded leads...
							{/* <PopupTable successFile={successFile} successFileLength={successFileLength} errorFile={errorFile} errorFileLength={errorFileLength} /> */}
						</Typography>
						<div style={{ float: 'right' }}>
							<button className='modalbtn' onClick={() => { toCampaign() }}>OK</button>
						</div>

					</Box>

				</Modal>
			}
		</Page >
	)
}

export default UpdateCampaign
