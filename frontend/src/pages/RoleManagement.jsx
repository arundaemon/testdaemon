import { useState, useEffect } from 'react';
import { Container, Grid } from "@mui/material";
import toast from 'react-hot-toast';
import Page from "../components/Page";
import Controls from '../components/controls/Controls';
import { getAllMenus, saveRoleMenuMapping } from '../config/services/menus';
import _ from 'lodash';
import { ROLES_LIST } from '../constants/RolesConfig';
import { getRolesList } from '../config/services/hrmServices';
import ReactSelect from 'react-select';
import { DataGrid } from '@mui/x-data-grid';


const columns = [
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'parentMenu', headerName: 'Parent Menu', width: 200, valueGetter: ({ value }) => value?.name ?? "-" },
    {
        field: 'iconUrl', headerName: 'Icon', width: 200,
        renderCell: (params) => <img className='menu-table-icon' src={params?.value} alt='menu icon' />,
    }
];


export default function MenuManagement() {
    const [roleObj, setRoleObj] = useState({});
    const [allMenusList, setAllMenusList] = useState([])
    const [selectedRowIds, setSelectedRowIds] = useState([])
    const [rolesList, setRoleslist] = useState([]);

    const fetchAllMenusList = () => {
        if (!roleObj?.profile_name)
            return

        getAllMenus()
            .then((res) => {
                if (res?.result) {
                    let selectedRows = []

                    res?.result?.map(menuObj => {
                        menuObj.label = menuObj?.name
                        menuObj.value = menuObj._id

                        if (roleObj?.profile_name && menuObj?.rolesAllowed.find(ele => ele === roleObj?.profile_name)) {
                            selectedRows.push(menuObj._id)
                        }
                        return menuObj
                    })

                    setSelectedRowIds(selectedRows)
                    setAllMenusList(res?.result)
                }
            })
            .catch(err => console.error(err))
    }


    const handleSelectRole = (newSelectValue) => {
        setSelectedRowIds([])
        setRoleObj(newSelectValue)
    }

    const onRowSelection = (selectedRows) => {
        if (!roleObj?.profile_name) {
            return toast.error('Please Select Role First')
        }
        let allMenusListCloned = _.cloneDeep(allMenusList) ?? []

        let updatedMenus = allMenusListCloned?.map(menuObj => {
            let findMenuIndex = _.indexOf(selectedRows, menuObj?._id)
            let roleExistInAllowedRoles = _.indexOf(menuObj?.rolesAllowed, roleObj?.profile_name)

            if (findMenuIndex > -1) {
                if (roleExistInAllowedRoles < 0)
                    menuObj?.rolesAllowed?.push(roleObj?.profile_name)
            }
            else {
                if (roleExistInAllowedRoles >= 0)
                    menuObj?.rolesAllowed?.splice(roleExistInAllowedRoles, 1)
            }

            return menuObj
        })


        return Promise.all(updatedMenus)
            .then(updatedMenusResolved => {
                setSelectedRowIds(selectedRows)
                setAllMenusList(updatedMenusResolved)
            })
    }

    const handleSavePermissions = () => {
        if (!roleObj?.profile_name) {
            toast.error('Please Select Role First')
        }
        else {
            let params = {
                roleId: roleObj.profile_name,
                menus: allMenusList
            }

            saveRoleMenuMapping(params)
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
                .catch(err => console.error(err))

        }
    }

    const fetchRolesList = () => {
        let params = { action: "profile" }
        getRolesList(params)
            .then(res => {
                if (res?.data?.response?.data) {
                    res?.data?.response?.data?.map(roleObj=>{
                        roleObj.label = roleObj?.profile_name
                        roleObj.value = roleObj.profile_name
                    })

                    setRoleslist(res?.data?.response?.data);
                }
                else {
                    console.error(res)
                }
            })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => fetchAllMenusList(), [roleObj])
    useEffect(() => fetchRolesList(), []);


    return (
        <>
            <Page title="Extramarks | User Management" className="main-container datasets_container">
                <Container className='table_max_width'>
                    <Grid container alignItems="left" justifyContent="flex-start" mb={2} spacing={2.5} >
                        <Grid item xs={12} sm={6} md={6} lg={6} className="datasets_header" >
                            <ReactSelect
                                classNamePrefix="select"
                                // options={ROLES_LIST}
                                options={rolesList}
                                // getOptionLabel={(option) => option.profile_name}
                                // getOptionValue={(option) => option.role_code}
                                value={roleObj?.profile_name ? roleObj : null}
                                // value={roleObj}
                                onChange={handleSelectRole}
                                placeholder='Select Role'
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={6} lg={6} >
                            <Grid container justifyContent="flex-end" spacing={2.5}>
                                <Grid item xs={6} sm={6} md={6} lg={4} display="flex" justifyContent="flex-end" >
                                    <Controls.Button
                                        text="Save Permissions"
                                        variant="contained"
                                        className="cm_ui_button"
                                        onClick={() => handleSavePermissions()}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                    {/* {roleObj?.value ? <FormGroup>
                        {allMenusList?.map((menu, i) => (
                            <FormControlLabel key={i} control={<Checkbox checked={menu?.rolesAllowed?.find(role => role === roleObj?.value)} onChange={(e) => handleSelectMenu(e, menu)} />} label={menu?.label} />
                        ))}
                    </FormGroup> : null} */}

                    <div style={{ height: 400, width: '100%' }}>
                        <DataGrid
                            rows={allMenusList}
                            columns={columns}
                            pageSize={5}
                            rowsPerPageOptions={[5]}
                            checkboxSelection
                            getRowId={(row) => row._id}
                            onSelectionModelChange={onRowSelection}
                            selectionModel={selectedRowIds}
                        />
                    </div>
                </Container>
            </Page>
        </>
    )
}
