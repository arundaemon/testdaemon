import { useEffect, useMemo, useState } from "react";
import {
    Box,
    LinearProgress,
    Typography,
} from "@mui/material";
import { getClaimNumber, getClaimNumberFromUserClaim, statusWiseClaimReport } from "../../helper/DataSetFunction";
import CubeDataset from "../../config/interface";
import moment from "moment";
import { getUserData } from "../../helper/randomFunction/localStorage";


export const DashboardClaimsMobile = ({ filterValue }) => {

    const [claimsList, setClaimsList] = useState([]);
    const [claimLoader, setClaimLoader] = useState(true)
    const [claimNotRaisedState, setClaimNotRaisedState] = useState({
        error: null,
        loading: true,
        data: []
    })
    const [startDate, setStartDate] = useState(
        moment(new Date()).add(-3, "days").format("YYYY-MM-DD 00:00:00")
    );
    const [endDate, setEndDate] = useState(
        moment(new Date()).format("YYYY-MM-DD 23:59:59")
    );

    let data = getUserData("userData")
    let roleName = data?.crm_role


    const reportClaimsTemplate = [
        { label: 'TOTAL CLAIM AMOUNT', value: 'Total Claim Amount' },
        { label: 'PENDING AT BUH', value: 'Pending at BUH' },
        { label: 'PENDING AT CBO', value: 'Pending at CBO' },
        { label: 'PENDING AT FINANCE', value: 'Pending at Finance' },
        { label: 'APPROVED', value: 'Approved Claim Amount' },
        { label: 'REJECTED', value: 'Rejected Claim Amount' },
    ]

    useEffect(() => {
        setClaimLoader(true)
        statusWiseClaimReport(filterValue)
            .then((res) => {
                let totalClaimAmount = 0;
                const data = res?.rawData()
                data?.forEach(item => {
                    if (item[CubeDataset.UserClaim.claimStatus] !== "PENDING AT L1") {
                        totalClaimAmount += item[CubeDataset.UserClaim.TotalClaimAmount];
                    }
                    const templateMatch = reportClaimsTemplate.find(obj => obj.label === item[CubeDataset.UserClaim.claimStatus])
                    if (templateMatch) {
                        item[CubeDataset.UserClaim.claimStatus] = templateMatch.value;
                        return true;
                    }
                })
                const totalClaimObject = {
                    [CubeDataset.UserClaim.claimStatus]: "Total Claim Amount",
                    [CubeDataset.UserClaim.TotalClaimAmount]: totalClaimAmount
                };
                data?.push(totalClaimObject)
                const index = data.findIndex(item => item[CubeDataset.UserClaim.claimStatus] === "PENDING AT L1");
                if (index !== -1) {
                    data.splice(index, 1);
                }
                setClaimsList(data)
                setClaimLoader(false)
            })
            .catch(
                err => [
                    console.log(err)
                ]
            )

    }, [filterValue]);


    const getClaimData = async (startDate, endDate, roleName) => {
        try {

            let res = await getClaimNumber(startDate, endDate, roleName);
            res = res?.loadResponses?.[0]?.data;
            return res
        } catch (err) {
            console.error(err?.response);
        }
    };


    const getFinalClaimCount = async (startDate, endDate, roleName) => {
        try {
            let res = await getClaimNumberFromUserClaim(startDate, endDate, roleName);
            res = res?.loadResponses?.[0]?.data;
            return res
        } catch (err) {
            console.error(err?.response);
        }
    };



    async function getFinalClaimData() {
        try {

            // setClaimNotRaisedState(prevState => ({
            //     ...prevState,
            //     data: [],
            //     loading: true,
            //     error: null
            // })
            // )

            let bdeActivitydata = await getClaimData(startDate, endDate, roleName)
            let userClaimData = await getFinalClaimCount(startDate, endDate, roleName)
            if (bdeActivitydata?.length > 0 && userClaimData?.length > 0) {
                const result = filterMatchingObjects(bdeActivitydata, userClaimData);
                const startDateTimeToRemove = result?.map(item => item["Bdeactivities.startDateTime"]);
                let filteredActivitydata = bdeActivitydata?.filter(item => !startDateTimeToRemove?.includes(item["Bdeactivities.startDateTime"]));
                if (filteredActivitydata?.length > 0) {
                    setClaimNotRaisedState(prevState => ({
                        ...prevState,
                        data: filteredActivitydata,
                        loading: false
                    })
                    )
                }
            }

        }
        catch (err) {
            console.log(err, '........err')
            setClaimNotRaisedState(prevState => ({
                ...prevState,
                data: [],
                loading: true,
                error: err
            })
            )

        }
        finally {
            if (claimNotRaisedState?.loading) {
                setClaimNotRaisedState(prevState => ({
                    ...prevState,
                    loading: false,

                })
                )
            }
        }

    }

    useEffect(() => {
        getFinalClaimData()
    }, []);


    //function to find whose claim is raised with timestamp comparision.
    function filterMatchingObjects(bdeActivityArray, userClaimArray) {
        const visitDates = userClaimArray?.map((obj) => obj["Userclaims.visitDate"]);
        const matchingObjects = bdeActivityArray?.filter((obj) =>
            visitDates.includes(obj["Bdeactivities.startDateTime"])
        );
        return matchingObjects;
    }


    //function to extract date from timestamp
    const getFormattedDate = (timestamp) => {
        const date = new Date(timestamp);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };


    // get date without timestamp for today , yesterday...
    const today = getFormattedDate(new Date());
    const yesterday = getFormattedDate(new Date(new Date().setDate(new Date().getDate() - 1)));
    const twoDaysBefore = getFormattedDate(new Date(new Date().setDate(new Date().getDate() - 2)));


    // now filter objects by 3 days function
    const filterObjectsByDate = (objects, targetDate) => {
        return objects?.filter(obj => getFormattedDate(obj["Bdeactivities.startDateTime"]) === targetDate);
    };


    const counts = useMemo(() => {
        const todayCount = filterObjectsByDate(claimNotRaisedState?.data, today)?.length || 0;
        const yesterdayCount = filterObjectsByDate(claimNotRaisedState?.data, yesterday)?.length || 0;
        const twoDaysBeforeCount = filterObjectsByDate(claimNotRaisedState?.data, twoDaysBefore)?.length || 0;
        return {
            todayCount,
            yesterdayCount,
            twoDaysBeforeCount,
        };
    }, [claimNotRaisedState]);


    return (
        <>
            <Box className="crm-sd-heading">
                <Typography component="h2">Report Claims</Typography>
                <Typography component="p">Status of claims raised</Typography>

            </Box>



            {claimNotRaisedState?.loading ? (
                <LinearProgress />
            ) : (
                <Box className="crm-sd-report-claims-wrapper" sx={{ marginBottom: "10px" }}>
                    <Box className="crm-sd-report-claims-list">
                        <Box className="crm-sd-report-claims-listitemNew">
                            <Box className="crm-sd-report-claims-listitem-containerNew">
                                <Typography component="h3" sx={{ fontWeight: 600 }}>
                                    Unraised claims that require immediate attention
                                </Typography>

                                <Box
                                    className="crm-sd-report-claims-listitemNew-info"
                                    // sx={{
                                    //     display: 'flex',
                                    //     justifyContent: 'space-between',
                                    //     flexWrap: 'wrap',
                                        
                                    // }}
                                >
                                    <Box className="crm-sd-report-claims-listitemNew-info-content">
                                        <Typography component={"p"} >
                                            For Today: <span> {counts?.todayCount } </span>
                                        </Typography>
                                        <Typography component={"p"} >
                                            For Tomorrow: <span> {counts?.yesterdayCount}</span>
                                        </Typography>
                                    </Box>
                                    <Typography component={"p"} >
                                        For Day After Tomorrow: <span> {counts?.twoDaysBeforeCount }</span>
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            )}

            {claimLoader && <LinearProgress />
            }
            <Box className="crm-sd-report-claims-wrapper">
                <Box className="crm-sd-report-claims-list">
                    {
                        claimsList?.length > 0 && claimsList.map((item, i) => (
                            <Box className="crm-sd-report-claims-listitem" key={i}>
                                <Box className="crm-sd-report-claims-listitem-container">
                                    <Typography component="h2">{item[CubeDataset.UserClaim.claimStatus]}</Typography>
                                    <Typography component="p">₹{item[CubeDataset.UserClaim.TotalClaimAmount]}/-</Typography>
                                </Box>
                            </Box>
                        ))
                    }
                </Box>
            </Box>

        </>
    )
}