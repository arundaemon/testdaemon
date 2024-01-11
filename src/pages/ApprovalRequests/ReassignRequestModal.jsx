import { useState, useEffect } from 'react';
import { Container, TextField, Alert, Pagination, Grid, Modal, Divider, Typography, InputAdornment, Box, Tabs, Tab, Button } from "@mui/material";
import _ from 'lodash';
import ReactSelect from 'react-select';
import Page from "../../components/Page";
import Loader from "../Loader";
import { makeStyles } from "@mui/styles";
import { getRequestList } from '../../config/services/approvalRequest';
import SearchIcon from '../../assets/icons/icon_search.svg';
import { RequestTable } from '../../components/approvalRequestManagement';
import { getAllParentRoles } from '../../config/services/hrmServices';
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { reassignRequest } from '../../config/services/approvalRequest';
import { getMappingInfo } from '../../config/services/approvalMapping';
import CubeDataset from '../../config/interface';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '1px solid #fff',
    boxShadow: '0px 0px 4px #0000001A',
    p: 4,
    borderRadius: '4px',
};

export default function ReassignRequestModal(props) {
    let { reassignModal, checkedLeads, handleReassignCancel, changeReassignState, fetchRequestList, handleSubmitReassign, selectedUser, handleFilterByRole } = props;
    const [parentsList, setParentsList] = useState([]);
    // const [selectedUser, setSelectedUser] = useState();

    const [roleName] = useState(JSON.parse(localStorage.getItem('userData'))?.crm_role);


    const allParentsList = (object, parentsArr) => {
        let newObj = {
            displayName: object?.displayName,
            roleName: object?.roleName,
            profileName: object?.profileName,
            roleID: object?.roleID,
            userName: object?.userName,
            profileName: object?.profileName
        }
        parentsArr.push(newObj);
        if (object?.parents) {
            return allParentsList(object?.parents, parentsArr)
        }
        else {
            return parentsArr;
        }
    }

    const fetchAllParentRoles = async () => {

        getAllParentRoles({ role_name: roleName })
            .then(res => {
                let allParents = res?.data?.response?.data?.parents;
                if (allParents) {
                    let allData = allParentsList(allParents, []);
                    if (allData?.length > 0) {
                        setParentsList([...allData]);
                    }
                }
            })
            .catch(err => {
                console.log(err, ":: error inside catch");
            })
    }

    // const handleFilterByRole = (value) => {
    //     setSelectedUser(value)
    // }

    const getReassignData = () => {
        let requestList = []
        if (!selectedUser?.roleName) {
            toast.error('Please Select User');
            return;
        }
        if (checkedLeads && (checkedLeads.length > 0)) {
            checkedLeads?.map(item => {
                let obj = {
                    _id: item?._id || item?.[CubeDataset.ApprovalRequest._id],
                    requestNumber: item?.requestNumber || item?.[CubeDataset.ApprovalRequest.requestNumber],
                    approver_empCode: selectedUser?.userName,
                    approver_roleId: selectedUser?.roleID,
                    approver_roleName: selectedUser?.roleName,
                    approver_name: selectedUser?.displayName,
                    approver_profileName: selectedUser?.profileName
                }
                requestList.push(obj);
            })
        }
        return requestList;
    }

    const handleReassignRequest = async () => {
        const requestList = getReassignData();
        let params = { requestList };
        console.log(requestList, '.....................req list inside modal reassign');
        reassignRequest(params)
            .then(res => {
                if (res?.result) {
                    toast.success(`Request is reassigned successfully`);
                    handleSubmitReassign();
                    fetchRequestList('NEW');
                    localStorage.removeItem("approverRequest");
                    changeReassignState();
                }
            })
            .catch(err => {
                console.log(err, '....error inside catch');
            })
    }

    useEffect(() => {
        fetchAllParentRoles();
    }, [])

    return (
        <>
            {reassignModal && (
                <Modal
                    open={true}
                    aria-labelledby="modal-modal-title"
                    sx={{ mt: 10 }}
                >
                    <Box sx={style}>
                        <Typography align="center" id="modal-modal-title">
                            <div style={{ fontWeight: 600, fontSize: 18 }}>
                                {" "}
                                Select User{" "}
                            </div>
                        </Typography>
                        <Typography
                            id="modal-modal-description"
                            align="center"
                            sx={{ mt: 2 }}
                        >
                            <Grid
                                item
                                xs={6}
                                sm={6}
                                md={6}
                                lg={12}
                                justifyContent="flex-end"
                            >
                                <ReactSelect
                                    sx={{ fontSize: "20px" }}
                                    classNamePrefix="select"
                                    options={parentsList}
                                    getOptionLabel={(option) => (option.displayName + ' (' + option.roleName + ')')}
                                    getOptionValue={(option) => option}
                                    onChange={handleFilterByRole}
                                    placeholder="Filter By Role"
                                    className="width-100 font-14"
                                    value={selectedUser}
                                />
                            </Grid>
                        </Typography>
                        <Typography
                            id="modal-modal-description"
                            align="center"
                            sx={{ mt: 2 }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    marginTop: 25,
                                }}
                            >
                                <Button
                                    style={{ marginRight: "20px", borderRadius: 4 }}
                                    onClick={handleReassignCancel}
                                    variant="outlined"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    style={{ borderRadius: 4 }}
                                    onClick={handleReassignRequest}
                                    variant="contained"
                                >
                                    Reassign
                                </Button>
                            </div>
                        </Typography>
                    </Box>
                </Modal>
            )}
        </>
    )
}