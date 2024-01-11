import { useState, useEffect } from 'react';
import { Typography, TextField, Box, Button, Grid, Breadcrumbs, Link } from '@mui/material';
import { styled } from '@mui/styles';
import { useNavigate, useLocation } from 'react-router-dom';
import { getRolesList } from '../../config/services/hrmServices';
import { updateRule } from '../../config/services/rules';
import toast from 'react-hot-toast';
import BreadcrumbArrow from '../../assets/image/bredArrow.svg';
import DropdownTreeSelect from "react-dropdown-tree-select";
import { findIndex, find, unionBy } from 'lodash';
import 'react-dropdown-tree-select/dist/styles.css'

const RootStyle = styled('div')(({ theme }) => ({
    [theme.breakpoints.up('lg')]: {
        flexShrink: 0,
    },
}))


const MainStyleWrapper = styled('div')(({ }) => ({
    height: '100%',
    width: '100%'
}))

const assignObjectPaths = (obj, stack) => {
    Object.keys(obj).forEach(k => {
        const node = obj[k];
        if (typeof node === "object") {
            node.path = stack ? `${stack}.${k}` : k;
            assignObjectPaths(node, node.path);
        }
    });
};


export default function CreateRule(props) {
    const [rolesList, setRoleslist] = useState([]);
    const [formattedList, setFormattedList] = useState([]);
    const [modifiedBy] = useState(JSON.parse(localStorage.getItem('userData'))?.name);
    const [modifiedBy_Uuid] = useState(JSON.parse(localStorage.getItem('userData'))?.uuid);
    const navigate = useNavigate();
    const location = useLocation();
    let stateData = location?.state ?? {}

    useEffect(() => fetchRolesList(), []);

    const childFormatter = (childData) => {
        let format = []
        childData?.map((data) => (
            format.push({ label: data.role_name, value: data.role_code, checked: find(unionBy(stateData?.rolesLinked, 'role_code'), ['role_code', data.role_code]) ? true : false })
        ))
        return format;
    }

    const rolesListFormatHandler = (listData) => {
        let format = {}
        let formattedList = []
        listData?.forEach(val => {
            if (format.hasOwnProperty(val.profile_name)) {
                format[val.profile_name].push(val)
            } else {
                format[val.profile_name] = [val]
            }
        })
        Object.keys(format).forEach(function (key, index) {
            formattedList.push({
                label: key,
                value: childFormatter(format[key]),
                children: childFormatter(format[key]),
            })
        });
        setFormattedList(formattedList)
        assignObjectPaths(formattedList);
    }

    const fetchRolesList = () => {
        let params = { action: "role" }
        getRolesList(params)
            .then(res => {
                if (res?.data?.response?.data) {
                    rolesListFormatHandler(res?.data?.response?.data)
                    setRoleslist(res?.data?.response?.data);
                }
                else {
                    console.error(res)
                }
            })
    }

    const roleIndexFinder = (value) => {
        return findIndex(rolesList, ['role_code', value])
    }

    let finalRoleData = [];
    const treeSelectHandler = (currentNode, selectedNodes) => {
        let roleIndex = null;
        finalRoleData = [];
        if (selectedNodes && selectedNodes.length > 0) {
            selectedNodes.map((d1, i) => {
                if (d1.value && Array.isArray(d1.value)) {
                    d1.value.map((data) => {
                        roleIndex = roleIndexFinder(data.value)
                        finalRoleData.push(rolesList[roleIndex])
                    })
                } else {
                    roleIndex = roleIndexFinder(selectedNodes[i].value)
                    finalRoleData.push(rolesList[roleIndex])
                }
            })
        }
    };

    const saveRolesMapped = async () => {
        if (!finalRoleData.length && !stateData?.rolesLinked?.length) {
            return toast.error('Please Select at least One Role.')
        }

        if (!finalRoleData.length && stateData?.rolesLinked?.length) {
            return toast.error('Please Select at least One Role.')
        }

        let params = {
            ruleId: stateData._id,
            rolesLinked: finalRoleData.length > 0 ?
                unionBy(finalRoleData, 'role_code')
                :
                unionBy(stateData?.rolesLinked, 'role_code')
        }

        return updateRule(params)
            .then(res => {
                if (res?.result) {
                    toast.success(res?.message)
                    navigate('/authorised/rule-management');
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

    return (
        <RootStyle>
            <MainStyleWrapper className="report-new-wrapper">
                <Grid container spacing={2} className="report-new-content">
                    <Breadcrumbs className='create-journey-heading' separator={<img src={BreadcrumbArrow} alt="Arrow" />} aria-label="breadcrumb">
                        <Link className='box-col-pointer' color="inherit" onClick={() => navigate('/authorised/rule-management')}>
                            Manage Rule
                        </Link>

                        <Typography key="2" color="text.primary">
                            Role Mapping
                        </Typography>
                    </Breadcrumbs>

                    <Grid item xs={12} md={12}>
                        <Box>
                            <Typography className='journey-name' variant='h5'>Roles</Typography>
                            <DropdownTreeSelect
                                data={formattedList}
                                onChange={treeSelectHandler}
                                className="cusTreeSelect"
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={12} className="report-new-main-fields" sx={{ display: 'block' }} alignItems="stretch"  >
                        <Box>
                            <Button color="primary" onClick={() => navigate('/authorised/rule-management')} className="mr-1">Skip</Button>
                            <Button color="primary" onClick={saveRolesMapped} className="report_form_ui_btn font-bold" variant="contained" >Submit</Button>
                        </Box>
                    </Grid>
                </Grid>
            </MainStyleWrapper>
        </RootStyle>
    )
}
