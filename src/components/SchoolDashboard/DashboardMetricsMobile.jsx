import { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    LinearProgress,
  } from "@mui/material";
  import useMediaQuery from "@mui/material/useMediaQuery";
  import { ReactComponent as IconDropdown } from "./../../assets/icons/icon-dashboard-mobile-performance-dropdown.svg";
import { expectedConversions, schoolVisited, schoolsConverted, totalBaseSchool } from "../../helper/DataSetFunction";
import CubeDataset from "../../config/interface";
  


  export const DashboardMetricsMobile = ({filterValue}) => {

    const [schoolsCount, setSchoolsCount] = useState(null);
    const [schoolsVisited, setSchoolsVisited] = useState(null);
    const [plannedTargets, setPlannedTargets] = useState([]);
    const [achievedTargets, setAchievedTargets] = useState([]); 
    const [baseSchoolLoader,setBaseSchoolLoader] = useState(true)
    const [visitedLoader,setVisitedLoader] = useState(true)
    const [convertedLoader,setConvertedLoader] = useState(true)
    const [expectedConversionLoader,setExpectedConversionLoader] = useState(true)
    const [activeAccordion, setActiveAccordion] = useState(null)
    const expectedConversionTemplate = [
        {  label: 'esc_plus', value: 'ESC+' },
        {  label: 'sip', value: 'SIP' },
        {  label: 'la', value: 'LA' },
        {  label: 'teaching_app', value: 'TA' },
        {  label: 'toa', value: 'TOA' },
        {  label: 'assement_centre', value: 'AC' },
    ]
    const schoolsConvertedTemplate = [
        {  label: 'esc_plus', value: 'ESC+' },
        {  label: 'sip', value: 'SIP' },
        {  label: 'la', value: 'LA' },
        {  label: 'teaching_app', value: 'TA' },
        {  label: 'assement_centre', value: 'AC' },
        {  label: 'toa', value: 'TOA' },
    ]

    useEffect(() => {
        setConvertedLoader(prevState => true)
        setExpectedConversionLoader(prevState => true)
        setVisitedLoader(prevState => true)
        setConvertedLoader(prevState => true)
        totalBaseSchool(filterValue)
            .then((res)=> 
            {
                const data = res.rawData()?.[0] ?? 0
                //console.log(data)
                setBaseSchoolLoader(false)
                setSchoolsCount(data[CubeDataset.Bdeactivities.UniqueSchools]);
            })
        schoolVisited(filterValue)
            .then((res)=> {
                const data = res.rawData()?.[0] ?? 0                
                setVisitedLoader(false)
                setSchoolsVisited(data[CubeDataset.Bdeactivities.UniqueSchools]);
            })
        expectedConversions(filterValue)
            .then((res)=>{
                const response = res.rawData()
                setExpectedConversionLoader(false)
                const modifiedResponse = response.filter(item => item[CubeDataset.Bdeactivities.name]!=='' && item[CubeDataset.Bdeactivities.name]!==null && item[CubeDataset.Bdeactivities.name]!==undefined)
                const formattedResponse = modifiedResponse.map(item => {
                    const formattedTotalCV = item[CubeDataset.Bdeactivities.TotalCV].toLocaleString('en-IN', {
                      style: 'currency',
                      currency: 'INR',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    });
                    return {
                      ...item,
                      [CubeDataset.Bdeactivities.TotalCV]: formattedTotalCV,
                    };
                  });
                setPlannedTargets(formattedResponse);
            })
        
        schoolsConverted(filterValue)
            .then((res)=>{
                //console.log(res)
                const response = res.rawData()
                setConvertedLoader(false)
                const modifiedResponse = response.filter(item => item[CubeDataset.Quotations.productName]!=='' && item[CubeDataset.Quotations.productName]!==null && item[CubeDataset.Quotations.productName]!==undefined)
                const formattedResponse = modifiedResponse.map(item => {
                    const formattedTotalCV = item[CubeDataset.Quotations.TotalSalePrice].toLocaleString('en-IN', {
                      style: 'currency',
                      currency: 'INR',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    });
                    return {
                      ...item,
                      [CubeDataset.Quotations.TotalSalePrice]: formattedTotalCV,
                    };
                  });
                setAchievedTargets(formattedResponse);
            })
        
    }, [filterValue]);

    const handleActiveAccordionState = (state) => {
        if(activeAccordion) {
            if(activeAccordion === state) {
                setActiveAccordion(null)
            } else {
                setActiveAccordion(state)
            }
        } else {
            setActiveAccordion(state)
        }
    }

    return (
        <>
            <Box className="crm-sd-heading">
                <Typography component="h2">Performance</Typography>
                <Typography component="p">Inputs and metrics</Typography>
            </Box>

            <Box className="crm-sd-metrics-wrapper">
                <Box className="crm-sd-metrics-list">
                    <Box className="crm-sd-metrics-item">
                        <Box className="crm-sd-metrics-item-container">
                            <Box className="crm-sd-metrics-item-label">No. Of Base Schools</Box>
                            <Box className="crm-sd-metrics-item-value">{!baseSchoolLoader ? schoolsCount : <CircularProgress size={20}/>}</Box>
                        </Box>
                    </Box>
                    <Box className="crm-sd-metrics-item">
                        <Box className="crm-sd-metrics-item-container">
                            <Box className="crm-sd-metrics-item-label">Schools Visited</Box>
                            <Box className="crm-sd-metrics-item-value">{!visitedLoader ? schoolsVisited : <CircularProgress size={20}/>}</Box>
                        </Box>
                    </Box>

                    <Box className="crm-sd-metrics-item" onClick={() => handleActiveAccordionState('target')}>
                        <Box className={`crm-sd-metrics-item-container crm-sd-metrics-item-accordion ` + ((activeAccordion === 'target') ? `opened` : ``)}>
                            <Box className="crm-sd-metrics-item-accordion-header">
                                <Box className="crm-sd-metrics-item-label">Expected Conversions</Box>
                                <Box className={`crm-sd-metrics-item-icon ` }><IconDropdown /></Box>
                            </Box>
                            <Box className="crm-sd-metrics-item-list">
                                <TableContainer >
                                    <Table aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Product</TableCell>
                                                <TableCell >Count</TableCell>
                                                <TableCell align="right">Net CV</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                        {expectedConversionLoader && <LinearProgress />}
                                        {plannedTargets?.length>0 && plannedTargets.map((row, i) => (
                                            <TableRow
                                                key={i}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row">
                                                    {row[CubeDataset.Bdeactivities.name]}
                                                </TableCell>
                                                <TableCell className="crm-tablecell-value" >{row[CubeDataset.Bdeactivities.totalRecords]}</TableCell>
                                                <TableCell className="crm-tablecell-value" align="right">{row[CubeDataset.Bdeactivities.TotalCV]}/-</TableCell>
                                            </TableRow>
                                        ))}
                                        {
                                           plannedTargets?.length == 0 && (
                                            <TableRow
                                                key={'converted-no-record'}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell rowSpan={3} className="crm-tablecell-value">
                                                    {'No Records found'}
                                                </TableCell>
                                            </TableRow>
                                           ) 
                                        }
                                        </TableBody>
                                    </Table>
                                    </TableContainer>
                                
                            </Box>
                            
                            
                        </Box>
                    </Box>

                    <Box className="crm-sd-metrics-item"  onClick={() => handleActiveAccordionState('achievement')}>
                        <Box className={`crm-sd-metrics-item-container crm-sd-metrics-item-accordion ` + ((activeAccordion === 'achievement') ? `opened` : ``)}>
                            <Box className="crm-sd-metrics-item-accordion-header">
                                <Box className="crm-sd-metrics-item-label">Schools Converted</Box>
                                <Box className={`crm-sd-metrics-item-icon ` }><IconDropdown /></Box>
                            </Box>
                            <Box className="crm-sd-metrics-item-list">
                                <TableContainer >
                                    <Table aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Product</TableCell>
                                                <TableCell >Count</TableCell>
                                                <TableCell align="right">Net CV</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                        {convertedLoader && <LinearProgress />}
                                        {achievedTargets?.length>0 && achievedTargets.map((row, i) => (
                                            <TableRow
                                                key={i}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row">
                                                    {row[CubeDataset.Quotations.productName]}
                                                </TableCell>
                                                <TableCell className="crm-tablecell-value" >{row[CubeDataset.Purchaseorders.totalRecords]}</TableCell>
                                                <TableCell className="crm-tablecell-value" align="right">{row[CubeDataset.Quotations.TotalSalePrice]}/-</TableCell>
                                            </TableRow>
                                        ))}
                                        {
                                           achievedTargets?.length == 0 && (
                                            <TableRow
                                                key={'converted-no-record'}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell rowSpan={3} className="crm-tablecell-value">
                                                    {'No Records found'}
                                                </TableCell>
                                            </TableRow>
                                           ) 
                                        }
                                        </TableBody>
                                    </Table>
                                    </TableContainer>
                                
                            </Box>
                            
                            
                        </Box>
                    </Box>

                </Box>
            </Box>
        
        </>
    )
  }