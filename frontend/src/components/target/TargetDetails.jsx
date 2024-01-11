import React, { useEffect, useState } from 'react'
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button, TextField } from '@mui/material';
import moment from 'moment'
import EditIcon from "../../assets/icons/edit-icon.svg";
import { Link, useNavigate, useParams } from 'react-router-dom'
import Page from "../Page";
import { getRoleNameProducts, updateTargetDetails } from "../../config/services/target";
import CrossIcon from "../../assets/image/crossIcn.svg"
import { toast } from 'react-hot-toast';
import { makeStyles } from '@mui/styles';
import { getUserHotsPipeline } from '../../config/services/leadInterest';
import { values } from 'lodash';
import TargetDetailTable from './TargetDetailTable';
import { DisplayLoader } from '../../helper/Loader';

const useStyles = makeStyles(() => ({
  saveBtn: {
    fontWeight: "600",
    fontSize: "16px",
    lineHeight: "15px",
    cursor: "pointer",
    borderRadius: "4px",
    color: "rgb(244, 94, 41)",
    border: "1px solid #F45E29",
    padding: "12px 24px",
    background: 'white',
    marginLeft: "95px",
    marginTop: '10px',
    width: "max-content",
    float: 'right',
  },
  editBtn: {
    fontWeight: "600",
    fontSize: "16px",
    lineHeight: "15px",
    cursor: "pointer",
    borderRadius: "4px",
    color: "rgb(244, 94, 41)",
    border: "1px solid #F45E29",
    padding: "12px 24px",
    background: 'white',
    marginLeft: "95px",
    marginTop: '10px',
    width: "max-content",
    float: 'right',
  },
  noData: {
    height: "15vh",
    width: "90vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: 600,
    fontSize: 18
  },
  loader: {
    height: "50vh",
    width: "90vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  viewDetail: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'black',
    marginTop: '-50px'
  }
}))

const TargetDetails = () => {
  const [totalRoleNameTarget, setTotalRoleNameTarget] = useState(0.0)
  const [roleNameProducts, setRoleNameProducts] = useState([])
  const [booleanArray, setBooleanArray] = useState([])
  const [textFieldValue, setTextFieldValue] = useState(0.0)
  const [modifiedBy] = useState(JSON.parse(localStorage.getItem('userData'))?.name);
  const [modifiedBy_Uuid] = useState(JSON.parse(localStorage.getItem('loginData'))?.uuid);
  const [loader, setLoader] = useState(false)
  const { roleName, range } = useParams()
  const url = window.location.href
  const check = url.includes('targetDetails')
  const classes = useStyles();
  const navigate = useNavigate()

  const getHotsPipeLineValues = async (roleName) => {
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

  const allRoleNameProducts = async () => {
    let params = { roleName, range };
    setLoader(true)
    try {
      const res = await getRoleNameProducts(params);
      let list = res?.result;

      let hotsPipelineArray = await getHotsPipeLineValues(roleName);
      let totalAmount = list?.reduce((sum, obj) => {
        if (typeof obj.targetAmount === 'number') {
          return sum + obj.targetAmount;
        }
        return sum;
      }, 0);

      let mergeHotsPipeline = await mergeHotsPipleLineValues(list, hotsPipelineArray);
      let sortedData = await handleSort(mergeHotsPipeline)
      setTotalRoleNameTarget(totalAmount);
      let shiftedArray = handleShiftedArray(sortedData);

      //Boolean Array for textFields
      let booleanArray = Array(shiftedArray?.length).fill(false);
      setRoleNameProducts(shiftedArray);
      setBooleanArray(booleanArray);
      setLoader(false)
    } catch (err) {
      console.error(err, `Error while fetching all products for ${roleName}`);
      setLoader(false)
    }
  };


  const mergeHotsPipleLineValues = (roleNameProductArray, hotsPipelineArray) => {

    for (let i = 0; i < roleNameProductArray?.length; i++) {
      let roleNameProduct = roleNameProductArray?.[i]
      let productName = roleNameProductArray?.[i]?._id;
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
    return roleNameProductArray
  }

  const handleSort = (data) => {
    data?.sort((a, b) => {
      const dateA = b?.firstRecord?.updatedAt ? new Date(b?.firstRecord?.updatedAt) : new Date(0);
      const dateB = a?.firstRecord?.updatedAt ? new Date(a?.firstRecord?.updatedAt) : new Date(0);
      return dateA - dateB;
    });
    data?.sort((a, b) => a?.firstRecord?.productName.localeCompare(b?.firstRecord?.productName));
    return data
  }

  const handleShiftedArray = (list) => {
    const shiftedArray = [
      {},
      ...list.map((obj) => ({ ...obj }))
    ];
    return shiftedArray
  }

  useEffect(() => {
    allRoleNameProducts()
  }, [])

  return (
    <Page title="Extramarks | Target Detail">
      <div className='tableCardContainer'>
        <h3>Target</h3>

        <div style={{ display: 'flex', alignItems: 'center', marginTop: '5px' }}>
          <p style={{ marginRight: 'auto' }}>Total Target Assigned to me: <b>{totalRoleNameTarget}/-</b></p>
          <button className={classes.viewDetail} onClick={() => navigate('/authorised/target-management')} >
            <img className='crossIcon' src={CrossIcon} alt="" />
          </button>
        </div>
        {loader ?
          <div className={classes.loader}>
            {DisplayLoader()}
          </div>
          :
          <>
            {roleNameProducts?.length > 1 ?
              <TargetDetailTable list={roleNameProducts} booleanArray={booleanArray} setBooleanArray={setBooleanArray} />
              :
              <div className={classes.noData}>
                <p>No Data Available</p>
              </div>
            }
          </>
        }
      </div>
    </Page>
  );
}

export default TargetDetails