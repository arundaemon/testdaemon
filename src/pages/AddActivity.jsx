import React,{useEffect,useState} from 'react';
import { 
    Container, 
    Link, 
    Breadcrumbs, 
    Typography, 
    Card, 
    TableContainer, 
    Paper, 
    Table, 
    TableHead, 
    TableRow, 
    TableCell, 
    TableBody, 
    Button, 
    TextField, 
    Box 
} from "@mui/material";
import toast from 'react-hot-toast';
import { useParams,useNavigate,useLocation} from 'react-router-dom';
import _ from 'lodash';

import Page from "../components/Page";
import { getTrueActivity } from "../config/services/activities";
import { addActivity, attendanceDetails } from '../config/services/attendance';
import { 
    getRoleBasedAttendanceMatrixById,
    updateRoleBasedAttendanceMatrixById 
} from '../config/services/roleBasedAttendanceMatrix';
import BreadcrumbArrow from  '../assets/image/bredArrow.svg';
import EditIcon from "../assets/icons/edit-icon.svg";

const AddActivity = (props) => {
    const [activityList, setActivityList] = useState([]);
    const [savedActivityList, setSavedActivityList] = useState([]);
    const [selectedRoleBasedAttendanceMatrix, setSelectedRoleBasedAttendanceMatrix] = useState([]);
    const { id } = useParams();
    const { manageMatrixData } = useLocation().state;

    const navigate = useNavigate();
    let selectedList;

    const handleSaveActivity = () =>{
        updateRoleBasedAttendanceMatrixById([...selectedRoleBasedAttendanceMatrix])
        .then((res) => {
            if (res?.result) {
                toast.success(res?.message)
                navigate('/authorised/matrix-management');
            }
            else if (res?.data?.statusCode === 0) {
                let { errorMessage } = res?.data?.error
                console.log(res?.data?.error)
                toast.error(errorMessage)
            }
            else {
                console.error(res);
            }
        })
        .catch(err => console.error(err))
    }

    const handleTargetValue = (e, index) => {
           let { value,name } = e?.target;
           let activityListCloned = _.cloneDeep(activityList)
           activityListCloned[index][name] = value
           setActivityList(activityListCloned)   
    }

    const handleTargetBlur = (e,data) => {
        let { value,name } = e?.target;
        if(value){
            selectedRoleBasedAttendanceMatrix?.forEach((item) =>{
                if(item.id === data._id){
                    item[name] = value;
                    item.status = 1;
                }
            })
            return
        }

        selectedRoleBasedAttendanceMatrix.forEach((item) =>{
            if(item.id === data._id){
                 item.status = 0;
            }
        })
    }

    const handleActivityStatusInMatrix = (e, rowData, index) => {
        const { active } = rowData;
 
        if(validateFields(rowData)){
            let activityListCloned = _.cloneDeep(activityList)
            let newStatus = active ? 0 : 1
            activityListCloned[index]['active'] = newStatus
            handleSelectedData(rowData,newStatus)
            setActivityList(activityListCloned)
        }
    }

    const validateFields = (fieldsData) =>{
        const {dailyTarget, weeklyTarget, monthlyTarget} = fieldsData;
        if(dailyTarget === undefined || dailyTarget === ''){
                toast.error("Add Daily  Target!")
                return false
        }

        if(weeklyTarget === undefined || weeklyTarget === ''){
                toast.error("Add Weekly  Target!")
                return false
        }

        if(monthlyTarget === undefined || monthlyTarget === ''){
                toast.error("Add Monthly  Target!")
                return false
        }

        return true;
    }

    const handleSelectedData = (rowData, status) =>{
        let data = createRoleBasedData({...rowData},status);
        let filteredData = selectedRoleBasedAttendanceMatrix?.filter((item) =>item.id !== data.id);
        let finalData = [...filteredData,data];
        setSelectedRoleBasedAttendanceMatrix([...finalData])
    }

    const createRoleBasedData = (rowData,status) =>{
        let data = {};

        if(manageMatrixData.attendanceMatrixType === "ROLE"){
            data.role_id = manageMatrixData?.role_id
            data.role_code = manageMatrixData?.role_code
            data.role_name = manageMatrixData?.role_name
        }else{
            data.profile_id = manageMatrixData?.profile_id
            data.profile_code = manageMatrixData?.profile_code
            data.profile_name = manageMatrixData?.profile_name
        }

        data.ID = manageMatrixData?._id;
        data.activityId = rowData?.ID;
        data.id = rowData?._id
        data.activityName = rowData?.activityName;
        data.dailyTarget = rowData?.dailyTarget;
        data.weeklyTarget = rowData?.weeklyTarget;
        data.monthlyTarget = rowData?.monthlyTarget;
        data.status = status;
        // console.log("create role data before return",data)
        return data
    }

    const editParameter = (parameterData) => {
        if (id)
            navigate('/authorised/update-activity', { state: { ...parameterData, attendanceMatrixId: id } })
    }

    const getMatrixDetails = async () => {
        attendanceDetails(id)
          .then(res => {
              if (res?.result) {
                  // console.log("fetch matrix details",res.result)
                  res?.result?.activities?.map((res) => {
                      res.statusInMatrix = res?.status;
                      return res
                  })
                  setSavedActivityList(res?.result?.activities ?? [])
              }
              else if (res?.data?.statusCode === 0) {
                  let { errorMessage } = res?.data?.error
                  toast.error(errorMessage)
              }
              else {
                  console.error(res);
              }
          })
          .catch((err) => {
            console.log(err, '...error')
          })
    }

    const fetchTrueActivityList = async() => {
        try {
            let params = {ID: manageMatrixData._id}
            const response = await getTrueActivity();
            // console.log("getTrueActivity",response.result)
            const selectedResult = await getRoleBasedAttendanceMatrixById(params);
            // console.log("getRoleBasedAttendanceMatrixById",selectedResult.result)
            selectedList = [...selectedResult.result];
            let resultActivity = response?.result.map(activityObj => {
                                    let updatedActivityItem = updateItem({...activityObj})
                                    updatedActivityItem['statusInMatrix'] = 1
                                    return updatedActivityItem
                                })
            setSelectedRoleBasedAttendanceMatrix(selectedList);
            setActivityList(resultActivity)
        } catch (error) {
            console.error(error)
        }
    }

    const updateItem = (data) =>{
        // console.log("data inside update function",data)
        let arr = selectedList?.filter((item) =>data.ID === item.activityId);
        if(arr.length === 0){
            return {...data,manageMatrixData,active:0}
        }

        let { dailyTarget,weeklyTarget,monthlyTarget } = arr[0];
        return {...data,
                 active:1,
                 dailyTarget,
                 weeklyTarget,
                 monthlyTarget,
                 manageMatrixData,
                }
    }

    useEffect(() => 
      fetchTrueActivityList(), []
    )

    useEffect(() =>{
        getMatrixDetails()
    },[])

    return (
     <>
      <Page title="Extramarks | AddActivity(Profile / Role)" className="main-container datasets_container">
        <Container>
            <Breadcrumbs className='create-journey-heading' separator={<img src={BreadcrumbArrow} alt="Arrow"/>} aria-label="breadcrumb">
            <Link underline="hover" key="1" color="inherit" onClick={() => navigate('/authorised/matrix-management')}>
                Manage Matrix
            </Link>
            <Typography key="2" color="text.primary">
                Add Activities (Profile / Role)
            </Typography>
         </Breadcrumbs>

         <Card >
            <Container style={{ marginTop: '20px', marginBottom: '20px' }}>
                <h3>Add Activity</h3>
            </Container>

            <TableContainer className='table-container' component={Paper}>
                <Table aria-label="customized table" className="custom-table datasets-table">
                    <TableHead>
                        <TableRow className="cm_table_head">
                            <TableCell>S.No.</TableCell>
                            <TableCell>Parameters</TableCell>
                            <TableCell>Daily Target</TableCell>
                            <TableCell>Weekly Target</TableCell>
                            <TableCell>Monthly Target</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            activityList?.map((row, i) => (
                                <TableRow key={i}>
                                    <TableCell>{i + 1}</TableCell>
                                    <TableCell className="datasetname-cell"> {row.activityName} </TableCell>
                                    <TableCell>
                                        <TextField 
                                            type='number'
                                            name='dailyTarget'
                                            onChange={(e) => handleTargetValue(e, i, 'dailyTarget')} 
                                            value={row?.dailyTarget} 
                                            onBlur={(e) => handleTargetBlur(e, row)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField 
                                            type='number' 
                                            name="weeklyTarget"
                                            onChange={(e) => handleTargetValue(e, i, row)} 
                                            value={row?.weeklyTarget} 
                                            onBlur={(e) => handleTargetBlur(e,row)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField 
                                            type='number' 
                                            name="monthlyTarget"
                                            onChange={(e) => handleTargetValue(e, i, row)} 
                                            value={row?.monthlyTarget} 
                                            onBlur={(e) => handleTargetBlur(e,row)}
                                        />
                                    </TableCell>
                                    {/* <TableCell>
                                        <TextField 
                                            type='number' 
                                            onChange={(e) => handleTargetValue(e, i, row)} 
                                            value={row?.minTarget} 
                                            onBlur={(e) => handleTargetBlur(e, i, row)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField 
                                            type='number' 
                                            onChange={(e) => handleTargetValue(e, i, row)} 
                                            value={row?.minTarget} 
                                            onBlur={(e) => handleTargetBlur(e, i, row)}
                                        />
                                    </TableCell> */}

                                    <TableCell onClick={(e) => handleActivityStatusInMatrix(e, row, i)} >
                                        <span className={row.active ? "cm_active" : "cm_inactive"}>{row.active ? "Active" : "Inactive"}</span>
                                    </TableCell>
                                    <TableCell className="edit-cell action-cell">
                                        <Button className='form_icon' onClick={() => editParameter(row)} ><img src={EditIcon} alt='' /></Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
         </Card>
         <Box className='employ-btn-group' mt={2}>
            <Button variant='contained' onClick={handleSaveActivity}>Save</Button>
            <Button variant='outlined' onClick={() => navigate('/authorised/matrix-management')}>Cancel</Button>
         </Box>
        </Container>
      </Page>
     </>
    )
}

export default AddActivity