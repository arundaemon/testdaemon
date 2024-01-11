import React, { useEffect, useState } from 'react'
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import { updateTargetDetails } from '../../config/services/target';
import { toast } from 'react-hot-toast';

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
  inputDiv: {
    display: 'inline-flex',
    alignItems: 'center',
    border: '1px solid rgba(0, 0, 0, 0.23)',
    borderRadius: 4,
    padding: '8px 12px',
    backgroundColor: '#FFFFFF',
    transition: 'border-color 0.2s ease-in-out',
    '&:hover': {
      borderColor: '#3f51b5',
    },
    '&:focus-within': {
      borderColor: '#3f51b5',
      boxShadow: '0 0 0 2px #3f51b54D',
    },
  }

}))

const TargetDetailTable = ({ list, booleanArray, setBooleanArray }) => {
  const url = window.location.href
  const [textFieldValue, setTextFieldValue] = useState()
  const [maxTargetLength, setMaxTargetLength] = useState(0)
  const classes = useStyles();
  const check = url.includes('targetDetails')

  const handleBooleanArray = (index) => {
    let updatedBooleanArray = [...booleanArray]
    updatedBooleanArray[index] = !updatedBooleanArray[index]
    setBooleanArray(updatedBooleanArray)
  }

  const handleTotalTargets = (e) => {
    setTextFieldValue(e.target.value)
  }

  const updatedTotalTarget = (data) => {
    let params = { _id: data?._id, targetAmount: textFieldValue }
    updateTargetDetails(params)
      .then(res => {
        let { message } = res
        toast.success(message)
        window.location.reload()
      })
      .catch(err => {
        console.log(err, 'Error while updating target')
      })
  }

  const handleMaxTarget = (list) => {
    let maxLength = 0;
    list?.forEach((item) => {
      const targetAmountStr = item?.targetAmount?.toString();
      if (targetAmountStr?.length > maxLength) {
        maxLength = targetAmountStr.length;
      }
    });
    setMaxTargetLength(maxLength)

  }

  useEffect(() => {
    handleMaxTarget(list)
  }, [])

  return (
    <TableContainer component={Paper} sx={{
      marginTop: '20px'
    }}>
      <Table aria-label="simple table" className="custom-table datasets-table" >
        <TableHead>
          <TableRow className="cm_table_head">
            <TableCell sx={{ width: '20%' }}> <div className='tableHeadCell'> Owner </div></TableCell>

            <TableCell> <div className='tableHeadCell'> Product </div></TableCell>

            <TableCell><div className='tableHeadCell'> Hots Value </div></TableCell>
            <TableCell>
              <div className='tableHeadCell'> Pipeline Value</div>
            </TableCell>
            <TableCell>
              <div className='tableHeadCell'> Total Value</div>
            </TableCell>
            <TableCell> <div className='tableHeadCell'> Total Targets </div></TableCell>
            <TableCell> <div className='tableHeadCell'> </div></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {list && list?.length > 0 &&
            list.map((row, i) => (
              <TableRow
                key={i}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >

                <TableCell>{(i === 1 ? row?.firstRecord?.displayName : '')}</TableCell>
                <TableCell sx={{ width: '15%' }}>{row?.firstRecord?.productName}</TableCell>
                <TableCell sx={{ height: '10px' }}>
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
                {check ?
                  <TableCell>
                    {
                      i > 0 ?
                        <>
                          {booleanArray?.[i] == true ?
                            <TextField type='number' value={textFieldValue} onChange={handleTotalTargets} sx={{ width: '100px' }} />
                            :
                            <div className={classes.inputDiv} style={{ marginLeft: '10px', width: `${(maxTargetLength * 10) + 20}px`, minWidth: '50px' }}>{row?.targetAmount}</div>
                          }
                        </>
                        :
                        null
                    }
                  </TableCell>
                  :
                  <TableCell>
                    {i == 0 ?
                      <div style={{ display: 'flex', fontWeight: '600' }}>
                        <div style={{ marginRight: '30px' }}>Units</div>
                        <div>Value</div>
                      </div>
                      :
                      <div style={{ display: 'flex' }}>
                        <div style={{ marginRight: '50px' }}>{row?.firstRecord?.targetUnit}</div>
                        <div style={{ marginLeft: '10px' }}>{row?.targetAmount}</div>
                      </div>
                    }
                  </TableCell>
                }
                <TableCell />
                {/* {check &&
                  <TableCell>
                    {i > 0 &&
                      <>
                        {booleanArray?.[i] ?
                          <button className={classes.saveBtn} onClick={() => {
                            updatedTotalTarget(row);
                            handleBooleanArray(i)
                          }} >Save</button>
                          :
                          <button className={classes.editBtn} onClick={() => handleBooleanArray(i)}>Edit</button>
                        }
                      </>
                    }
                  </TableCell>
                } */}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer >
  )
}

export default TargetDetailTable