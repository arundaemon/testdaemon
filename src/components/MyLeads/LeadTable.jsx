import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { TableContainer, Table, TableCell, TableHead, TableRow, TableBody, Checkbox } from '@mui/material';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import UpArrow from '../../assets/image/arrowUp.svg'
import DownArrow from '../../assets/image/arrowDown.svg'
import LeadScore from './LeadScore';
import settings from '../../config/settings';
import LeadOwner from './LeadOwner';

export default function LeadTable(props) {
    let { list, getRowIds, pageNo, itemsPerPage, handleSort, sortObj } = props

    const [checkedList, setCheckedList] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const user = settings.ONLINE_LEADS;

    const handleChange = (e, data) => {
        if (!e.target.checked) {
            if (!selectAll) {
                let newFilteredArray = checkedList.filter((item) => (item['Leads.Id'] ? item['Leads.Id'] : item[`${user}.uuid`]) != (data['Leads.Id'] ? data['Leads.Id'] : data[`${user}.uuid`]));
                setCheckedList([...newFilteredArray])
                // setSelectAll(false)
            }
            if (selectAll) {
                // console.log("checked........... when select all true")
                // let newFilteredArray = checkedList.filter((item) => item['Leads.Id'] != data['Leads.Id']);
                let newFilteredArray = list.filter((item) => (item['Leads.Id'] ? item['Leads.Id'] : item[`${user}.uuid`]) != (data['Leads.Id'] ? data['Leads.Id'] : data[`${user}.uuid`]));
                setCheckedList([...newFilteredArray]);
                setSelectAll(false)
                // setSelectAll(false)
            }
        } else {
            setCheckedList([...checkedList, data])
        }
    };

    const handleChangeSelectAll = (e, data) => {
        if (e.target.checked) {
            setSelectAll(true)
            setCheckedList([...list])
        } else {
            setSelectAll(false)
            setCheckedList([])
        }
    }

    const getChecked = (data, index) => {
        // console.log(data, 'get checked data')
        let filterredArray = checkedList.filter((item, index) => (item['Leads.Id'] ? item['Leads.Id'] : item[`${user}.uuid`]) == (data['Leads.Id'] ? data['Leads.Id'] : data[`${user}.uuid`]));
        if (filterredArray.length == 0) {
            return false;
        } else {
            return true
        }
    }

    const handleSortIcons = (leadKey, userKey) => {
        return (
            <div className="arrowFilterDesign">
                <div className="upArrow" onClick={() => handleSort(leadKey, userKey)}>
                    {sortObj?.sortLeadKey !== leadKey || sortObj?.sortUserKey !== userKey || sortObj?.sortOrder === "desc" ? <img src={UpArrow} alt="" /> : null}
                </div>

                <div className="downArrow" onClick={() => handleSort(leadKey, userKey)}>
                    {sortObj?.sortLeadKey !== leadKey || sortObj?.sortUserKey !== userKey || sortObj?.sortOrder === "asc" ? <img src={DownArrow} alt="" /> : null}
                </div>
            </div>
        );
    }

    useEffect(() => {
        getRowIds(checkedList)
    }, [checkedList])

    // console.log(list,'........')

    return (
        <div>
            <TableContainer>
                <Table
                    aria-label="customized table"
                    className="custom-table datasets-table"
                >
                    <TableHead>
                        <TableRow className="cm_table_head">
                            <TableCell><div className='tableHeadCell'><Checkbox
                                className='inputCheckBox'
                                name='allSelect'
                                checked={selectAll ? selectAll : false}
                                onChange={handleChangeSelectAll}
                                sx={{
                                    color: "#85888A",
                                    '&.Mui-checked': {
                                        color: "#F45E29",
                                    },
                                }}
                            />Sr.No</div></TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Owner</TableCell>
                            <TableCell>Source</TableCell>
                            <TableCell>Sub Source</TableCell>
                            {/* <TableCell>Lead Score</TableCell> */}
                            <TableCell>City</TableCell>

                            {/* <TableCell>Engagement</TableCell> */}
                            <TableCell>
                                <div className="tableHeadCell">Created Date {handleSortIcons('Leads.createdAt', `${user}.createTime`)}</div>
                            </TableCell>
                            <TableCell>
                                <div className="tableHeadCell">Last Modified Date {handleSortIcons('Leads.updatedAt', `${user}.updatedOn`)}</div>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {list && list.length > 0 &&
                            list.map((row, i) => {
                                return <TableRow key={i}
                                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }} >
                                    <TableCell>
                                        <div className='tableHeadCell'>
                                            <Checkbox
                                                className='inputCheckBox'
                                                name={row["Leads.name"] ? row["Leads.name"] : row[`${user}.username`]}
                                                checked={selectAll ? selectAll : getChecked(row)}
                                                onChange={(e) => handleChange(e, row)}
                                                sx={{
                                                    color: "#85888A",
                                                    '&.Mui-checked': {
                                                        color: "#F45E29",
                                                    },
                                                }}
                                            /> {(i + 1) + ((pageNo - 1) * itemsPerPage)}</div></TableCell>
                                    <TableCell style={{
                                        color: '#488109', cursor: 'pointer',
                                        fontWeight: 'bold',
                                    }}>{<Link to={`/authorised/listing-details/${row?.["Leads.Id"] ? row?.["Leads.Id"] : row?.[`${user}.uuid`]}`}> {row?.["Leads.name"] ? row["Leads.name"] : row?.[`${user}.username`]} </Link>}
                                    </TableCell>
                                    <TableCell>{row?.["Leads.assignedToRoleName"]}</TableCell>
                                    {/* <TableCell>{<LeadOwner id={row?.[`${user}.uuid`] ? row?.[`${user}.uuid`] : row?.[`Leads.Id`]} />}</TableCell> */}

                                    <TableCell>{row?.["Leads.sourceName"]}</TableCell>
                                    <TableCell>{row?.["Leads.subSourceName"]}</TableCell>
                                    {/* <TableCell>{row?.["Leads.Id"] ? 'NA' : <LeadScore id={row?.[`${user}.uuid`]} />}</TableCell> */}
                                    <TableCell>{row?.["Leads.city"] ? row?.["Leads.city"] : row?.[`${user}.city`]}</TableCell>

                                    {/* <TableCell>{ }</TableCell> */}

                                    <TableCell>{row?.["Leads.createdAt"] ?
                                        moment.utc(row?.["Leads.createdAt"]).local().format('DD-MM-YYYY (hh:mm A)') :
                                        moment.utc(row?.[`${user}.createTime`]).local().format('DD-MM-YYYY (hh:mm A)')}
                                    </TableCell>

                                    <TableCell>{row?.["Leads.updatedAt"] ?
                                        moment.utc(row?.["Leads.updatedAt"]).local().format('DD-MM-YYYY (hh:mm A)') :
                                        Date(row?.[`${user}.updatedOn`]).toString() === 'Invalid Date' ? moment.utc(row?.[`${user}.updatedOn`]).local().format('DD-MM-YYYY (hh:mm A)') : 'NA'}

                                    </TableCell>

                                </TableRow>

                            })}
                    </TableBody>
                </Table>
            </TableContainer>
        </div >
    );
}
