import { useEffect, useState } from 'react'
import {
	Divider, Paper, Menu, MenuItem, MenuList, ListItemText, InputLabel, Box, IconButton, Stack, Typography, Button, TextField
} from "@mui/material";
import CancelButton from "../../assets/icons/icon-cancel.svg";
import { makeStyles } from '@mui/styles';
import { border, color, width } from '@mui/system';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import toast from 'react-hot-toast';


const useStyles = makeStyles((theme) => ({
	filterMainContainer: {
		'& .MuiPaper-root.MuiPaper-elevation.MuiPaper-root': {
			overflow: 'hidden'
		},
		'&::before': {
			zIndex: -1
		}
	},
	filterContainer: {
		width: '375px',
		[theme.breakpoints.down('sm')]: {
			width: '90vw'
		}
	},
	headerHedding: {
		fontSize: '20px',
		fontWeight: '600',

	},
	dropdownItemHeader: {
		[theme.breakpoints.down('sm')]: {
			paddingRight: '15px',
			paddingLeft: '15px'
		},
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: " 10px 15px",
		borderBottom: '1px solid #DEDEDE'
	},
	listItemContainer: {
		maxHeight: '250px',
		overflow: 'auto',
		paddingBottom: '0',

	},
	filterBox: {
		border: '1px solid #dedede',
		padding: '10px',
		width: '100%',
		borderRadius: '4px'
	},
	noFilterBox: {
		border: '1px solid #dedede',
		padding: '10px 15px',
		width: '100%',
		marginBottom: '-18px'
	},
	menuButtonsContainer: {
		display: "flex",
		justifyContent: "space-between",
		flexDirection: 'column',
		marginBottom: '20px',
		paddingLeft: '15px',
		paddingTop: '10px',
		marginTop: '10px',
		borderTop: '1px solid #dedede',

	},
	addFilterBtn: {
		fontSize: '12px',
		textDecoration: 'underline',
		color: '#F45E29',
		cursor: 'pointer',
		marginRight: '20px',
	},
	removeFilterBtn: {
		fontSize: '12px',
		cursor: 'pointer',
		color: '#85888A',
	},
	saveBtn: {
		fontSize: '14px',
		fontWeight: '600',
		background: '#F45E29',
		padding: "9px 18px",
		borderRadius: '4px',
		color: "white",
		cursor: 'pointer',
		marginRight: '10px',
		border: '1px solid #F54E29',
	},
	cancelBtn: {
		fontSize: '14px',
		fontWeight: '600',
		border: '1px solid #F54E29',
		padding: "9px 18px",
		cursor: 'pointer',
		borderRadius: '4px',
		color: "#F45E29",
	}

}))
const InvoiceFilter = (props) => {
	const classes = useStyles()
    const [schoolCode, setSchoolCode] = useState(null)
    const [poCode, setPoCode] = useState(null)
    const [impCode, setImpCode] = useState(null)
    const [productType, setProductType] = useState(null)
    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)
	let { filterAnchor, setFilterAnchor, handleApplyFilter, isClear=false } = props



    const handleClickApplyFilter = (e) => {
        let payload = {
            po_code: poCode??null,
            school_code: schoolCode??null,
            implementation_id: impCode??null,
			product_group_key: productType??null
        }
		if((startDate && !endDate)||(!startDate && endDate)) {
			toast.error("Please select date rannge!")
			return
		}else if(startDate && endDate){
			payload['billing_date'] = {
				date_from: startDate,
				date_to: endDate
			}
		}
        handleApplyFilter(payload)
    }

    const handleFieldCancel = (type) => {
    type(null)
    }

    const handleRemoveAllFilter = () => {
        setPoCode(null)
        setSchoolCode(null)
        setImpCode(null)
        setStartDate(null)
        setEndDate(null)
        setProductType(null)
    }

	useEffect(()=>{
		if(isClear) handleRemoveAllFilter()
	},[isClear])
	return (
		<>
			<Menu
				anchorEl={filterAnchor}
				open={Boolean(filterAnchor)}
				onClose={() => setFilterAnchor(null)}
				className={classes.filterMainContainer}
			>
				<div className={classes.filterContainer}>
					<Box className="filters-dropdown-item dasboard-filters-view-dropdown">
						<Box className={classes.dropdownItemHeader} display="flex" justifyContent="space-between">
							<div className={classes.headerHedding} > Filters </div>
							<img onClick={() => setFilterAnchor(null)} src={CancelButton} className="" style={{ width: '16px' }} />
						</Box>
					</Box>

					<LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Box sx={{ padding: 2, overflowY: 'auto', maxHeight: '300px' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 , justifyContent: "space-between"}}>
                            <TextField hiddenLabel id="standard-basic-1" label="School Code" variant="outlined" size="small" sx={{ mb: 1 ,  width: '250px'}} value={schoolCode??''} onChange={(e)=> setSchoolCode(e.target.value)}/>
                            <HighlightOffIcon fontSize='medium' style={{ color: '#f45e29' }} onClick={()=>handleFieldCancel(setSchoolCode)}/>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 , justifyContent: "space-between"}}>
                            <TextField hiddenLabel id="standard-basic-1" label="Purchase Order Id" variant="outlined" size="small" sx={{ mb: 1 ,  width: '250px'}} value={poCode??''} onChange={(e)=> setPoCode(e.target.value)}/>
                            <HighlightOffIcon fontSize='medium' style={{ color: '#f45e29' }} onClick={()=>handleFieldCancel(setPoCode)}/>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 , justifyContent: "space-between"}}>
                            <TextField hiddenLabel id="standard-basic-1"  label="Implementation Id" variant="outlined" size="small" sx={{ mb: 1 ,  width: '250px'}} value={impCode??''} onChange={(e)=> setImpCode(e.target.value)}/>
                            <HighlightOffIcon fontSize='medium' style={{ color: '#f45e29' }} onClick={()=>handleFieldCancel(setImpCode)}/>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 , justifyContent: "space-between"}}>
                            <TextField hiddenLabel id="standard-basic-1" label="Product Type" variant="outlined" size="small" sx={{ mb: 2 ,  width: '250px'}} value={productType??''} onChange={(e)=> setProductType(e.target.value)}/>
                            <HighlightOffIcon fontSize='medium' style={{ color: '#f45e29' }} onClick={()=>handleFieldCancel(setProductType)}/>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 , justifyContent: "space-between"}}>
                            {/* <TextField hiddenLabel id="standard-basic-1" label="Start Date" variant="standard" size="small" sx={{ mb: 2 ,  width: '250px'}} value={startDate??''} onChange={(e)=> setStartDate(e.target.value)}/> */}
                            <DatePicker
                            label="Start Date"
                            value={startDate}
							size="small"
                            onChange={(value) => {
								setStartDate(value)
                            }}
                            renderInput={(params) => (
                              <TextField {...params} sx={{ outline: 'none', mb: 1, width: '250px' }} />
                            )}
                          />
							<HighlightOffIcon fontSize='medium' style={{ color: '#f45e29' }} onClick={()=>handleFieldCancel(setStartDate)}/>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: "space-between"}}>
                            <DatePicker
                            label="End Date"
                            value={endDate}
							size="small"
                            onChange={(value) => {
								setEndDate(value)
                            }}
                            renderInput={(params) => (
                              <TextField {...params}  sx={{ outline: 'none', width: '250px' }} />
                            )}
                          />
                            <HighlightOffIcon fontSize='medium' style={{ color: '#f45e29' }} onClick={()=>handleFieldCancel(setEndDate)}/>
                        </Box>
                    </Box>
					</LocalizationProvider>

					<Box className={classes.menuButtonsContainer}>
						<Box display="flex" marginBottom="20px" >
							{true ?
								<div className={classes.removeFilterBtn} onClick={handleRemoveAllFilter}> Remove All </div>
								: null}
						</Box>
						{true ?
							<Box display="flex">
								<div className={classes.saveBtn} onClick={handleClickApplyFilter}> Apply Filter</div>
								{/* <div className={classes.cancelBtn} onClick={applyFilters}> Cancel </div> */}
							</Box> : null
						}
					</Box>
				</div>
			</Menu >
		</>
	)
}

export default InvoiceFilter;
