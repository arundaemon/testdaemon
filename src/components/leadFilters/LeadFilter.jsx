import { useEffect, useState } from 'react'
import {
	Divider, Paper, Menu, MenuItem, MenuList, ListItemText, InputLabel, Box, IconButton, Stack, Typography, Button
} from "@mui/material";
import CancelButton from "../../assets/icons/icon-cancel.svg";
import DeleteIcon from "../../assets/icons/icon_trash.svg";
import LeadFilterMenu from "./LeadFilterMenu";
import { makeStyles } from '@mui/styles';
import { border, color, width } from '@mui/system';

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
const LeadFilter = (props) => {
	const classes = useStyles()
	const [filterMenuAnchor, setFilterMenuAnchor] = useState(null);
	const [selectedFilterIndex, setSelectedFilterIndex] = useState(null);
	const [filledData, setFilledData] = useState(null)
	let { filterAnchor, setFilterAnchor, addFilter, filters, removeAllFilters, removeFilter, setFilters, applyFilters, role } = props

	const handleFilterMenu = (e, filterIndex, filterObj) => {
		setFilledData(filterObj)
		setFilterMenuAnchor(e.currentTarget)
		setSelectedFilterIndex(filterIndex)
	}

	const generateString = (data) => {
		if (Array.isArray(data)) {
			let str = data?.join(' , ');
			return str;
		}
		return data
	}
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

					{!filters?.length ?
						<Box className={classes.noFilterBox}>
							<Typography className="report-form-label font-weight-normal" variant="subtitle1" display="block">No Filter Selected</Typography>
						</Box>
						: null}

					<MenuList dense className={classes.listItemContainer}>
						{filters?.map((filterObj, i) => (
							<div style={{ display: 'flex', width: '100%', height: '100%', alignItems: 'center' }}>

								<div style={{ width: '90%', pointerEvents: filterObj?.label != 'Select Filter' && 'none' }}>
									<MenuItem onClick={e => { filterObj?.label == 'Select Filter' && handleFilterMenu(e, i, filterObj) }}>
										<Box className={classes.filterBox} style={{ background: filterObj?.label != 'Select Filter' && '#eaeaea', boxShadow: 'none' }}>
											<Stack direction="row" width="100%" justifyContent='space-between' alignItems='center' >
												<Typography className="report-form-label font-weight-normal" variant="subtitle1" display="block">{filterObj?.dataset?.displayName ?? filterObj?.dataset?.dataSetName ?? filterObj?.label}</Typography>
											</Stack>
											<p className="report-form-label font-weight-normal" variant="subtitle1"> {filterObj?.field?.displayName || filterObj?.field?.name} </p>
											<p className="report-form-label font-weight-normal" variant="subtitle1"> {filterObj?.operator?.label} </p>
											<p style={{ whiteSpace: "break-spaces" }} className="report-form-label font-weight-normal" variant="subtitle1"> {generateString(filterObj?.filterValue)} </p>
										</Box>
									</MenuItem>
								</div>
								<div style={{ width: '10%', cursor: 'pointer' }}>
									<img onClick={() => removeFilter(i)} src={DeleteIcon} alt='DeleteIcon' />
								</div>
							</div>
						))}
					</MenuList>
					<Box className={classes.menuButtonsContainer}>
						<Box display="flex" marginBottom="20px" >
							<div className={classes.addFilterBtn} onClick={addFilter}> Add Filter </div>
							{filters?.length ?
								<div className={classes.removeFilterBtn} onClick={removeAllFilters}> Remove All </div>
								: null}
						</Box>
						{filters?.length ?
							<Box display="flex">
								<div className={classes.saveBtn} onClick={applyFilters}> Apply Filter</div>
								{/* <div className={classes.cancelBtn} onClick={applyFilters}> Cancel </div> */}
							</Box> : null
						}
					</Box>
				</div>
			</Menu >
			<LeadFilterMenu filterMenuAnchor={filterMenuAnchor} setFilterMenuAnchor={setFilterMenuAnchor} selectedFilterIndex={selectedFilterIndex} setFilters={setFilters} filters={filters} filledData={filledData} role={role} />
		</>
	)
}

export default LeadFilter;
