import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'
import moment from 'moment';
import { useEffect, useState } from 'react';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Checkbox, Button, Switch } from '@mui/material';
import EditIcon from "../../assets/icons/edit-icon.svg";
import DeleteIcon from "../../assets/icons/icon_trash.svg";
import Chip from '@mui/material/Chip';
import UpArrow from '../../assets/image/arrowUp.svg'
import DownArrow from '../../assets/image/arrowDown.svg'
import toast from 'react-hot-toast';
import CubeDataset from '../../config/interface';
import data from '@iconify/icons-eva/hash-fill';

export default function RequestTable({ reqStatus, requestedBy, flag, list, sortObj, getRequestData, handleSort, pageNo, itemsPerPage, request = false, approve = false, requestPage = false, ...other }) {
  const [requestList, setRequestList] = useState(list);
  const [checkedRows, setCheckedRows] = useState([]);
  const [selectedType, setSelectedType] = useState();
  const [selectAll, setSelectAll] = useState(false);

  const isSelectAllChecked = () => {
    return (list?.length > 0 && list.length === checkedRows.length);
  };


  const handleSelectAll = (event) => {
    if (event.target.checked) {
      let currentType = list?.[0]?.requestType ?? list?.[0]?.[CubeDataset.ApprovalRequest.requestType];
      let shouldContinue = true;

      for (let i = 0; i < list.length; i++) {
        const item = list[i];
        if (item?.requestType === currentType || item?.[CubeDataset.ApprovalRequest.requestType] === currentType) continue
        else {
          shouldContinue = false;
          toast.error('Selected requests must be of the same type');
          break;
        }
      }

      if (shouldContinue) {
        setSelectedType(currentType);
        setCheckedRows([...list]);
        setSelectAll(true);
      } else {
        setCheckedRows([]);
        setSelectAll(false);
        setSelectedType();
      }
    } else {
      setCheckedRows([]);
      setSelectAll(false);
      setSelectedType();
    }
  };


  // const getMetaInfoDetails = (data) => {
  //   const elements = [];
  //   for (const [key, value] of Object.entries(data)) {
  //     elements.push(
  //       <p>
  //         {key}: <b style={{ fontWeight: '600' }}>{data[key]}</b>
  //       </p>
  //     )
  //   }
  //   return elements;
  // }

  const getMetaInfoDetails = (data, field) => {
    const elements = [];
    Object.keys(data).map((key) => {
      // if (key === 'Visit_Date') {
      //   return (
      //     <p>{key}: {data[key]}</p>
      //   );
      // } else if (key === 'Visit_Time_In' || key === 'Visit_Time_Out') {
      //   return (
      //     <p>{key}: {data[key]}</p>
      //   );
      // } 
      if (key === 'Unit' && data['unitLabel'] && Number(data[key]) !== 0) {
        elements.push(
          <p><b style={{ fontWeight: '600' }}>{data['unitLabel']}</b>: {data[key]}</p>
        )
      }
      else if (field) {
        elements.push(
          <p><b style={{ fontWeight: '600' }}>{field?.label}</b>: {field?.value}</p>
        )
      }

      else if (key === 'unitLabel') {
        elements.push(
          ''
        )
      }
      else {
        if (key && data[key]) {
          elements.push(
            !((key === 'Unit' && Number(data[key])) === 0) ?
              <p><b style={{ fontWeight: '600' }}>{key}</b>: {data[key]}</p>
              : ''
          );
        }


      }
    })
    return elements;
  }

  const handleRowCheck = (event, row) => {
    if (event.target.checked) {
      if (checkedRows.length === 0) {
        setSelectedType(row?.requestType ?? row?.[CubeDataset.ApprovalRequest.requestType]);
        setCheckedRows([...checkedRows, row]);
      }
      else {
        if (selectedType === row?.requestType || selectedType === row?.[CubeDataset.ApprovalRequest.requestType]) {
          setCheckedRows([...checkedRows, row]);
        }
        else {
          toast.error('Request must be of same type');
          return;
        }
      }
    } else {

      let newArray = checkedRows.filter((checkedRow) => {
        if (checkedRow && checkedRow._id !== row?._id) {
          return true;
        }
        else if (checkedRow && checkedRow?.[CubeDataset.ApprovalRequest._id] !== row?.[CubeDataset.ApprovalRequest._id]) {
          return true
        }
        return false
      })
      setCheckedRows(newArray);
    }
  };

  const isChecked = (id) => {
    let idArray = checkedRows?.map(obj => {
      if (obj?._id) return obj?._id
      else if (obj?.[CubeDataset.ApprovalRequest._id]) return obj?.[CubeDataset.ApprovalRequest._id]
      return null
    }
    )
    if (idArray.includes(id)) return true
    else return false
  };

  useEffect(() => {
    setCheckedRows([]);
    setRequestList([...list])
  }, [list]);

  useEffect(() => {
    if (flag) {
      setCheckedRows([]);
    }
  }, [flag]);

  useEffect(() => {
    if (!requestPage) {
      getRequestData(checkedRows)

    }
  }, [checkedRows])

  // console.log(list, 'this is the report')

  return (
    <TableContainer component={Paper} {...other}>
      <div className='journey-list-heading'>
        <h4>Request List</h4>
        {/* <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p> */}
      </div>
      {requestList && requestList.length > 0 && (<Table aria-label="customized table" className="custom-table datasets-table">
        <TableHead >
          <TableRow className='cm_table_head'>
            {/* <TableCell >S.No</TableCell> */}
            {reqStatus === 'NEW' ? <TableCell style={{ width: 'max-content' }}>
              <Checkbox
                checked={isSelectAllChecked()}
                // checked={selectAll ? selectAll : false}

                onChange={handleSelectAll}
              />
            </TableCell> : <TableCell >S.No</TableCell>}

            <TableCell ><div className='tableHeadCell'>Request Number</div></TableCell>
            <TableCell ><div className='tableHeadCell'>Request ID</div></TableCell>
            <TableCell ><div className='tableHeadCell'>{approve ? 'Request By' : 'Request To'}</div></TableCell>
            <TableCell ><div className='tableHeadCell'>Request Type</div></TableCell>
            <TableCell ><div className='tableHeadCell'>Details</div></TableCell>
            <TableCell ><div className='tableHeadCell'>Raised Date</div></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {requestList.map((row, i) => (
            <TableRow key={i}>
              {/* <TableCell>{(i + 1) + ((pageNo - 1) * itemsPerPage)}.</TableCell> */}
              {reqStatus === 'NEW' ? <TableCell>
                <Checkbox
                  checked={isChecked(row?._id ?? row?.[CubeDataset.ApprovalRequest._id])}
                  onChange={(event) => handleRowCheck(event, row)}
                />
              </TableCell> : <TableCell>{(i + 1) + ((pageNo - 1) * itemsPerPage)}.</TableCell>}

              <TableCell>
                {requestedBy ? <Link style={{ color: "#4482FF" }} to={{ pathname: `/authorised/request-details/${row?._id ?? row?.[CubeDataset.ApprovalRequest._id]}/${requestedBy}` }}>
                  {row?.requestNumber ?? row?.[CubeDataset.ApprovalRequest.requestNumber]}</Link> :
                  <Link style={{ color: "#4482FF" }} to={{ pathname: `/authorised/request-details/${row?._id ?? row?.[CubeDataset.ApprovalRequest._id]}` }}>
                    {row?.requestNumber ?? row?.[CubeDataset.ApprovalRequest.requestNumber]}</Link>}
                {/* <Link style={{ color: "#4482FF" }} to={{ pathname: `/authorised/request-details/${row?._id ?? row?.[CubeDataset.ApprovalRequest._id]}` }}>
                  {row?.requestNumber ?? row?.[CubeDataset.ApprovalRequest.requestNumber]}</Link> */}

              </TableCell>
              <TableCell>{row?.requestId ?? row?.[CubeDataset.ApprovalRequest.requestId] ?? '-'}</TableCell>
              {approve ?
                <TableCell>{`${row?.requestBy_name ?? row?.[CubeDataset.ApprovalRequest.requestByName]}(${row?.requestBy_empCode ?? row?.[CubeDataset.ApprovalRequest.requestByEmpCode]})` ?? '-'}</TableCell>
                :
                <TableCell>{`${row?.approver_name ?? row?.[CubeDataset.ApprovalRequest.approverName]}(${row?.approver_empCode ?? row?.[CubeDataset.ApprovalRequest.requestByEmpCode]})` ?? '-'}</TableCell>
              }

              <TableCell >{row?.requestType ?? row?.[CubeDataset.ApprovalRequest.requestType] ?? '-'}</TableCell>
              <TableCell >
                <div>
                  {row?.shortDescription && getMetaInfoDetails(row?.shortDescription)}
                  {row?.[CubeDataset.ApprovalRequest.shortDescription] && getMetaInfoDetails((JSON.parse(row?.[CubeDataset.ApprovalRequest.shortDescription])))}

                </div>
              </TableCell>
              <TableCell><div>{row?.createdAt ? moment(row?.createdAt).format('DD/MM/YY, (HH:mm A)') : moment.utc(row?.[CubeDataset.ApprovalRequest.createdAt]).local().format('DD/MM/YY, (HH:mm A)')}</div></TableCell>


            </TableRow>))}
        </TableBody>
      </Table>)}
    </TableContainer>
  )
}

RequestTable.propTypes = {
  list: PropTypes.array.isRequired
}