import PropTypes from 'prop-types';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button, Switch } from '@mui/material';
import EditIcon from "../../assets/icons/edit-icon.svg";
import DeleteIcon from "../../assets/icons/icon_trash.svg";
import Chip from '@mui/material/Chip';
import UpArrow from '../../assets/image/arrowUp.svg'
import DownArrow from '../../assets/image/arrowDown.svg'
import CubeDataset from "../../config/interface";


export default function InterestTransactionalTable({ list, sortObj, pageNo, itemsPerPage,  }) {
    const dataSetIndex =  CubeDataset.Leadinterests

    const [interestList, setInterestList] = useState(list);


    // const handleSortIcons = (key) => {

    //     return (
    //         <div className="arrowFilterDesign">
    //             <div className="upArrow" onClick={() => handleSort(key)}>
    //                 {sortObj?.sortKey !== key || sortObj?.sortOrder === "-1" ? <img src={UpArrow} alt="" /> : null}
    //             </div>
    //             <div className="downArrow" onClick={() => handleSort(key)}>
    //                 {sortObj?.sortKey !== key || sortObj?.sortOrder === "1" ? <img src={DownArrow} alt="" /> : null}
    //             </div>
    //         </div>
    //     );
    // }

    useEffect(() => setInterestList([...list]), [list])

    console.log(list,'.............list')

    return (
        <TableContainer  >
            
            {interestList && interestList.length > 0 && (<Table aria-label="customized table" className="custom-table datasets-table">
                <TableHead >
                    <TableRow className='cm_table_head'>
                        <TableCell >S.No</TableCell>
                        <TableCell ><div className='tableHeadCell'>Interest Name</div></TableCell>
                        <TableCell ><div className='tableHeadCell'> Board</div></TableCell>
                        <TableCell ><div className='tableHeadCell'> Class</div></TableCell>
                        <TableCell ><div className='tableHeadCell'> Source</div></TableCell>
                        <TableCell ><div className='tableHeadCell'> Sub Source</div></TableCell>
                        <TableCell ><div className='tableHeadCell'> Campaign Name</div></TableCell>
                        <TableCell ><div className='tableHeadCell'>Created At</div></TableCell>
                        <TableCell ><div className='tableHeadCell'>Updated At</div> </TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {interestList.map((row, i) => (
                        <TableRow key={i}>
                            <TableCell>{(i + 1) + ((pageNo - 1) * itemsPerPage)}.</TableCell>
                            <TableCell>{row?.[dataSetIndex.learningProfile]}</TableCell>
                            <TableCell>{row?.[dataSetIndex.board] ?? '-'}</TableCell>
                            <TableCell>{row?.[dataSetIndex.class] ?? '-'}</TableCell>
                            <TableCell>{row?.[dataSetIndex.sourceName] ?? '-'}</TableCell>
                            <TableCell>{row?.[dataSetIndex.subSourceName] ?? '-'}</TableCell>
                            <TableCell>{row?.[dataSetIndex.campaignName] ?? '-'}</TableCell>
                            <TableCell>{moment(row?.[dataSetIndex.createdAt]).format('DD-MM-YY (HH:mm A)')}</TableCell>
                            <TableCell>{moment(row?.[dataSetIndex.createdAt]).format('DD-MM-YY (HH:mm A)')}</TableCell>                              
                        </TableRow>))}
                </TableBody>
            </Table>)}
        </TableContainer>
    )
}

InterestTransactionalTable.propTypes = {
    list: PropTypes.array.isRequired
}