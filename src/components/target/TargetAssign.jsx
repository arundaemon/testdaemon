import React, { useEffect, useState } from 'react'
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button, TextField, TableSortLabel } from '@mui/material';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import Page from "../Page";
import { assignTargets, getRoleNameProducts, updateTargetDetails } from "../../config/services/target";
import CrossIcon from "../../assets/image/crossIcn.svg"
import { toast } from 'react-hot-toast';
import { makeStyles } from '@mui/styles';
import { getUserHotsPipeline } from '../../config/services/leadInterest';
import { getAllProductList } from '../../config/services/packageBundle';
import { getUserData } from '../../helper/randomFunction/localStorage';

const useStyles = makeStyles(() => ({
  assignBtn: {
    fontWeight: "600",
    fontSize: "16px",
    lineHeight: "15px",
    cursor: "pointer",
    borderRadius: "4px",
    color: "white",
    border: "1px solid #F45E29",
    padding: "12px 24px",
    background: "#F45E29",
    marginLeft: "95px",
    marginTop: '10px',
    width: "max-content",
    float: 'right',
  }
}))

const TargetAssign = () => {
  const [totalRoleNameTarget, setTotalRoleNameTarget] = useState(0)
  const location = useLocation()
  const [targetData] = useState(location.state.data)
  const [targetAssignList, setTargetAssignList] = useState([])
  const [textFieldValueArray, setTextFieldValueArray] = useState([])
  const [createdBy] = useState(JSON.parse(localStorage.getItem('userData'))?.name);
  const [modifiedBy] = useState(JSON.parse(localStorage.getItem('userData'))?.name);
  const [createdBy_Uuid] = useState(JSON.parse(localStorage.getItem('loginData'))?.uuid);
  const [modifiedBy_Uuid] = useState(JSON.parse(localStorage.getItem('loginData'))?.uuid);
  const loginData = getUserData('loginData')
  const uuid = loginData?.uuid
  const navigate = useNavigate()
  const classes = useStyles();
  let { roleName, range } = useParams()

  const getHotsPipeLineValues = async () => {
    let params = { roleName };
    try {
      const res = await getUserHotsPipeline(params);
      if (res?.result) {
        return res.result;
      }
    } catch (err) {
      console.log(err, 'Error while getting hots pipeline values');
      throw err;
    }
  };

  const getProductList = async () => {
    try {
      let params = {
        status: [1],
        master_data_type: "package_products",
        uuid:uuid
      }
      const res = await getAllProductList(params);
      let data = res?.data?.master_data_list;
      let objectArray = data?.map(item => {
        return { ...targetData, productName: item?.name };
      });

      let totalAmount = objectArray?.reduce((sum, obj) => {
        if (typeof obj.targetAmount === 'number') {
          return sum + obj.targetAmount;
        }
        return sum;
      }, 0);

      let hotsPipelineArray = await getHotsPipeLineValues(roleName);

      //merge ObjectArray and hotsPipelineArray
      let mergeArrays = await mergeHotsPipleLineValues(objectArray, hotsPipelineArray);
      let shiftedArray = handleShiftedArray(mergeArrays)

      setTotalRoleNameTarget(totalAmount);
      setTargetAssignList(shiftedArray);
    } catch (err) {
      setTotalRoleNameTarget(0);
      console.error('Error while fetching product list', err);
    }
  };

  const handleShiftedArray = (list) => {
    let shiftedArray = [
      {}, ...list?.map((obj) => ({ ...obj, targetUnit: obj?.hotsValue?.unit + obj?.pipelineValue?.unit }))
    ]
    return shiftedArray
  }

  const mergeHotsPipleLineValues = (productArray, hotsPipelineArray) => {

    for (let i = 0; i < productArray?.length; i++) {
      let roleNameProduct = productArray?.[i]
      let productName = productArray?.[i]?._id;
      let matchingObject = hotsPipelineArray?.find(obj => obj?._id === productName)
      if (matchingObject) {
        roleNameProduct.hotsValue = matchingObject?.hotsValue
        roleNameProduct.pipelineValue = matchingObject?.pipelineValue
      }
      else {
        roleNameProduct.hotsValue = { unit: 0, value: 0 }
        roleNameProduct.pipelineValue = { unit: 0, value: 0 }
      }
    }
    return productArray
  }


  const handleTotalTarget = (e, index) => {
    let updatedArray = [...textFieldValueArray]
    updatedArray[index] = e.target.value
    setTextFieldValueArray(updatedArray)
  }

  const handleAssignTargets = () => {
    targetAssignList?.splice(0, 1)
    let totalTarget = 0
    for (let i = 0; i < targetAssignList?.length; i++) {
      if (textFieldValueArray?.[i + 1] == null) {
        toast.dismiss()
        toast.error('Fill all Total Targets')
        return
      }

      if (textFieldValueArray?.[i + 1] !== null) {
        let targetAmount = parseInt(textFieldValueArray[i + 1])
        totalTarget += targetAmount
        if (targetAmount < 0) {
          toast.dismiss()
          toast.error('Invalid Target Value')
          return
        }
        targetAssignList[i].targetAmount = targetAmount;
      }
      if (!targetAssignList[i].hasOwnProperty("createdBy")) {
        targetAssignList[i].createdBy = createdBy;
      }
      targetAssignList[i].modifiedBy = modifiedBy;
      targetAssignList[i].createdBy_Uuid = createdBy_Uuid;
      targetAssignList[i].modifiedBy_Uuid = modifiedBy_Uuid;

    }

    if (totalTarget === 0) {
      toast.dismiss()
      toast.error('Atleast 1 product should have non-zero value')
      return
    }

    let data = targetAssignList?.map(obj => {
      let { displayName, userName, productName, profileName, roleName, targetAmount, createdBy, createdBy_Uuid, modifiedBy, modifiedBy_Uuid, targetUnit } = obj;
      return { displayName, userName, productName, profileName, roleName, targetAmount, createdBy, createdBy_Uuid, modifiedBy, modifiedBy_Uuid, targetUnit };
    });

    addMultipleTargets(data);
  };


  const addMultipleTargets = async (data) => {
    let params = { data, range }
    assignTargets(params)
      .then(res => {
        if (res?.result) {
          toast.success(res?.message)
          navigate('/authorised/target-management')
        }
        if (res?.data) {
          let error = res?.data.error
          let { errorMessage } = error
          toast.dismiss()
          toast.error(errorMessage)
        }
      })
      .catch(err => {
        console.log(err, 'Error while assigning target')
      })
  }

  useEffect(() => {
    getProductList()
  }, [])

  return (
    <Page title="Extramarks | Target Detail">
      <div className='tableCardContainer'>
        <h3>Target</h3>

        <div style={{ display: 'flex', alignItems: 'center', marginTop: '5px' }}>
          <p style={{ marginRight: 'auto' }}>Total Target Assigned to me: <b>{totalRoleNameTarget}/-</b></p>
          <button
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'black',
              marginTop: '-50px'
            }}
            onClick={() => navigate('/authorised/target-management')}
          >
            <img className='crossIcon' src={CrossIcon} alt="" />
          </button>
        </div>

        <TableContainer component={Paper} sx={{
          marginTop: '20px'
        }}>
          <Table aria-label="simple table" className="custom-table datasets-table" >
            <TableHead>
              <TableRow className="cm_table_head">
                <TableCell sx={{ width: '20%' }}> <div className='tableHeadCell'> Owner </div></TableCell>
                <TableCell sx={{ width: '20%' }}> <div className='tableHeadCell'> Product </div></TableCell>
                <TableCell>
                  <div className='tableHeadCell'> Hots Value </div>
                </TableCell>
                <TableCell>
                  <div className='tableHeadCell'> Pipeline Value</div>
                </TableCell>
                <TableCell>
                  <div className='tableHeadCell'> Total Value</div>
                </TableCell>
                <TableCell> <div className='tableHeadCell'> Total Targets </div></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {targetAssignList && targetAssignList?.length > 0 &&
                targetAssignList.map((row, i) => (
                  <TableRow
                    key={i}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>{(i === 1 ? row?.displayName : '')}</TableCell>
                    <TableCell>{row?.productName}</TableCell>
                    <TableCell>
                      {i == 0 ?
                        <div style={{ display: 'flex', fontWeight: '600' }}>
                          <div style={{ marginRight: '10px' }}>Units</div>
                          <div>Value</div>
                        </div>
                        :
                        <div style={{ display: 'flex' }}>
                          <div style={{ marginRight: '50px' }}>{row?.hotsValue?.unit}</div>
                          <div>{row?.hotsValue?.value}</div>
                        </div>
                      }
                    </TableCell>
                    <TableCell>
                      {i == 0 ?
                        <div style={{ display: 'flex', fontWeight: '600' }}>
                          <div style={{ marginRight: '10px' }}>Units</div>
                          <div>Value</div>
                        </div>
                        :
                        <div style={{ display: 'flex' }}>
                          <div style={{ marginRight: '50px' }}>{row?.pipelineValue?.unit}</div>
                          <div>{row?.pipelineValue?.value}</div>
                        </div>
                      }
                    </TableCell>
                    <TableCell>
                      {i == 0 ?
                        <div style={{ display: 'flex', fontWeight: '600' }}>
                          <div style={{ marginRight: '10px' }}>Units</div>
                          <div>Value</div>
                        </div>
                        :
                        <div style={{ display: 'flex' }}>
                          <div style={{ marginRight: '50px' }}>{row?.hotsValue?.unit + row?.pipelineValue?.unit}</div>
                          <div>{row?.hotsValue?.value + row?.pipelineValue?.value}</div>
                        </div>
                      }
                    </TableCell>
                    <TableCell>
                      {i > 0 ?
                        <TextField type='number' value={textFieldValueArray[i]} onChange={(e) => handleTotalTarget(e, i)} sx={{ width: '50%' }} />
                        :
                        null
                      }
                    </TableCell>

                  </TableRow>

                ))}
            </TableBody>


          </Table>
          <button className={classes.assignBtn} onClick={handleAssignTargets} >Assign</button>
        </TableContainer >

      </div>
    </Page>
  );
}

export default TargetAssign