import React, { useEffect, useState } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getRolesHierarchy, getRolesList } from '../../config/services/hrmServices';
import { getRulesByRole } from '../../config/services/rules';
import { multipleLeadTransfer } from '../../config/services/lead';
import _ from 'lodash';
import { CubeQuery } from '../../helper/CubeSocket';
import toast from 'react-hot-toast';
import CubeDataset from "../../config/interface";


export default function MultipleUserTable() {
    const [rolesList, setRoleslist] = useState([]);
    const [rulesList, setRulesList] = useState([]);
    const navigate = useNavigate()


    const fetchRolesList = async () => {
        let userData = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')) : {}
        let rolesListData = []

        getRolesHierarchy({ role_name: userData?.crm_role })
            .then(res => {
                if (res?.data?.response?.data?.childs) {
                    return res?.data?.response?.data?.childs
                }
                else {
                    console.error(res)
                    throw 'Error In Roles Hierarchy'
                }
            })
            .then(rolesData => {
                rolesListData = rolesData
                return getRulesByRole()
            })
            .then(async res => {
                if (res?.result) {
                    let rolesListDataCloned = _.cloneDeep(rolesListData ?? [])
                    let rulesListCloned = _.cloneDeep(res?.result ?? [])

                    rolesListDataCloned?.forEach(async rolesObj => {

                        let roleRulesPromise = rulesListCloned?.map(async ruleObj => {
                            let query = { "measures": [CubeDataset.Leads.count], "dimensions": [], "timezone": "UTC", "timeDimensions": [], "filters": [], "renewQuery": true }
                            let { filters } = ruleObj
                            let filtersCloned = _.cloneDeep(filters)
                            query?.filters?.push({ "member": CubeDataset.Leads.assignedToRoleName, "operator": "equals", "values": [rolesObj?.roleName] })

                            filtersCloned?.forEach(filterObj => {
                                let filterQuery = {}
                                filterQuery.member = `${filterObj?.dataset?.dataSetName}.${filterObj?.field?.fieldName}`
                                filterQuery.operator = `${filterObj?.operator?.operatorValue}`
                                filterQuery.values = [`${filterObj?.filterValue}`]
                                query?.filters?.push(filterQuery)
                            })

                            return CubeQuery({ query })
                                .then(resp => {
                                    let sum = 0
                                    // console.log(resp?.tablePivot(), "::resp?.tablePivot()");
                                    if (resp?.tablePivot()?.length) {
                                        resp?.tablePivot()?.map(obj => {
                                            sum = sum + obj[CubeDataset.Leads.count]
                                        })
                                    }

                                    ruleObj = { ...ruleObj, query, ruleUserResultCount: sum }
                                    return ruleObj
                                })
                        })

                        return Promise.all(roleRulesPromise)
                            .then(userLeads => {
                                rolesObj.rules = [...userLeads]
                            })
                    })

                    setRoleslist(rolesListDataCloned)


                    // [{"member":"Leads.isDeleted","operator":"equals","values":["0"]}]

                    let rulesPromise = rulesListCloned?.map(async ruleObj => {
                        let query = { "measures": [CubeDataset.Leads.count], "dimensions": [], "timezone": "UTC", "timeDimensions": [], "filters": [], "renewQuery": true }
                        let { filters } = ruleObj
                        let filtersCloned = _.cloneDeep(filters)

                        filtersCloned?.forEach(filterObj => {
                            let filterQuery = {}
                            filterQuery.member = `${filterObj?.dataset?.dataSetName}.${filterObj?.field?.fieldName}`
                            filterQuery.operator = `${filterObj?.operator?.operatorValue}`
                            filterQuery.values = [`${filterObj?.filterValue}`]
                            query?.filters?.push(filterQuery)
                        })

                        return CubeQuery({ query })
                            .then(resp => {
                                let sum = 0
                                if (resp?.tablePivot()?.length) {
                                    resp?.tablePivot()?.map(obj => {
                                        sum = sum + obj[CubeDataset.Leads.count]
                                    })
                                }
                                ruleObj.ruleResultCount = sum
                                return ruleObj
                            })
                    })

                    return Promise.all(rulesPromise)
                        .then(rulesMapped => {
                            setRulesList(rulesMapped)
                        })
                }
                else {
                    console.error(res)
                }
            })
            .catch(err => {
                console.error(err)
            })
    }

    let rolesCloned = Array.from(rolesList)

    const countLeads = (roleIndex, type) => {
        let triggeredRoleRules = rolesCloned?.[roleIndex]?.['rules'] ? Array.from(rolesCloned[roleIndex]['rules']) : []
        let sum = 0

        switch (type) {
            case 'SELECTED_LEADS':
                if (triggeredRoleRules.length) {
                    triggeredRoleRules?.map(obj => {
                        if (obj['inputValue'])
                            sum = sum + obj['inputValue']
                    })
                }
                return sum

            case 'OPEN_LEADS':
                if (triggeredRoleRules.length) {
                    triggeredRoleRules?.map(obj => {
                        if (obj['ruleUserResultCount'])
                            sum = sum + obj['ruleUserResultCount']
                    })
                }
                return sum
            case 'TOTAL_LEADS':
                if (triggeredRoleRules.length) {
                    triggeredRoleRules?.map(obj => {
                        if (obj['ruleUserResultCount'])
                            sum = sum + obj['ruleUserResultCount']
                        if (obj['inputValue'])
                            sum = sum + obj['inputValue']
                    })
                }
                return sum
            default:
                break;
        }

    }

    const handleCountInput = (e, roleObj, roleIndex, ruleObj, ruleIndex) => {
        let { value } = e?.target

        if (rolesCloned?.[roleIndex]?.['rules']?.[ruleIndex]) {
            rolesCloned[roleIndex]['rules'][ruleIndex] = { ...ruleObj, inputValue: Number(value) }
            setRoleslist(rolesCloned)
        }
    }

    const handleTransferLeads = () => {
        let params = {
            roles: rolesCloned
        }
        multipleLeadTransfer(params)
            .then(res => {
                if (res?.result) {
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


    useEffect(() => { fetchRolesList() }, [])

    return (
        <div className='multipleUserTablePage '>
            <div className='tableCardContainer'>
                <h3 style={{ marginLeft: '10px', marginTop: '15px', marginBottom: 20 }}>Multiple Lead Transfer</h3>
                <TableContainer component={Paper}>
                    <Table sx={{ border: "1px solid #DEDEDE" }} aria-label="simple table" className='multipleUserTable'>
                        <TableHead>
                            <TableRow>
                                <TableCell align="left" sx={{ borderRight: "1px solid #DEDEDE", borderBottom: "1px solid #DEDEDE" }}>User Name</TableCell>
                                {rulesList?.map((ruleObj, i) => (
                                    <TableCell key={i} align="left" sx={{ borderRight: "1px solid #DEDEDE", borderBottom: "1px solid #DEDEDE" }}>{ruleObj?.ruleName} ({ruleObj?.ruleResultCount}) </TableCell>
                                ))}
                                <TableCell align="left" sx={{ borderRight: "1px solid #DEDEDE", borderBottom: "1px solid #DEDEDE" }}>Selected leads</TableCell>
                                <TableCell align="left" sx={{ borderRight: "1px solid #DEDEDE", borderBottom: "1px solid #DEDEDE" }}>Existing Open Leads</TableCell>
                                <TableCell align="left" sx={{ borderRight: "1px solid #DEDEDE", borderBottom: "1px solid #DEDEDE" }}>Total</TableCell>
                            </TableRow>
                        </TableHead>


                        <TableBody>
                            {rolesList?.map((roleObj, roleIndex) => (
                                <TableRow key={roleIndex}>
                                    <TableCell sx={{ borderRight: "1px solid #DEDEDE" }}>
                                        {`${roleObj?.displayName} (${roleObj?.userName})`}
                                    </TableCell>
                                    {roleObj?.rules?.map((ruleObj, ruleIndex) => (
                                        <TableCell key={ruleIndex} sx={{ borderRight: "1px solid #DEDEDE" }}>
                                            <div className='tableDataContainer'>
                                                <span className='lebel'>{ruleObj?.ruleUserResultCount}</span>
                                                <input className='input' type="text" onChange={(e) => handleCountInput(e, roleObj, roleIndex, ruleObj, ruleIndex)} />
                                            </div>
                                        </TableCell>
                                    ))}
                                    <TableCell sx={{ borderRight: "1px solid #DEDEDE" }}>
                                        <div className='tableDataContainer'>
                                            <input disabled className='input redBorder' type="text" value={countLeads(roleIndex, 'SELECTED_LEADS')} />
                                        </div>
                                    </TableCell>
                                    <TableCell sx={{ borderRight: "1px solid #DEDEDE" }}> {countLeads(roleIndex, 'OPEN_LEADS')} </TableCell>
                                    <TableCell sx={{ borderRight: "1px solid #DEDEDE" }}> {countLeads(roleIndex, 'TOTAL_LEADS')} </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>


            <div className='btnContainer'>
                <Button className='cancelBtn' variant='outlined' onClick={() => navigate('/authorised/all-leads')} >Cancel</Button>
                <Button className='transferBtn' variant='contained' onClick={handleTransferLeads} >Transfer</Button>
            </div>
        </div>

    );
}
