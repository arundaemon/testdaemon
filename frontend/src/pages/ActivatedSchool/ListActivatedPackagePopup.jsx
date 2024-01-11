import React, { useEffect, useState } from "react";
import Page from "../../components/Page";
import {
    Button,
    Box
} from "@mui/material";
import {
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
} from "@mui/material";

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { getBoardList, getChildList } from "../../config/services/lead";

const ListActivatedPackagePopup = ({ open, setOpen, packageDetail }) => {

    const tableHeading = ["S.No.", "Package Name", "Duration", "Board", "Class"]

    const [packageDetails, setPackageDetails] = useState([])


    const fetchPackageDetail = async (packageDetail) => {
        let packageDetailsArr = []
        let params = { params: { boardStage: 1, sapVisibility: 1 } };
        console.log(packageDetail, "MMMMMMMMMMMMMMMMMMMMM")
        await getBoardList(params).then((res) => {
            for (let i = 0; i < packageDetail?.length; i++) {
                res?.data?.data.map((board) => {
                    if (packageDetail[i]?.board_id === board.board_id) {
                        packageDetail[i].board_name = board.name
                        packageDetailsArr.push(packageDetail[i])
                    }
                })
            }
        }).catch((e) => console.log(e))
        setPackageDetails(packageDetailsArr)
    }

    useEffect(async () => {
        // let params = { params: { boardId: 180, syllabusId: 180 } };
        // getChildList(params).then((res) => {
        console.log('res')
        // }).catch((e) => console.log("EEROOROR", e))
        await fetchPackageDetail(packageDetail)
    }, [])
    return (
        <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle style={{ textAlign: 'center', textDecoration: 'underline' }}>SUMMARY</DialogTitle>

            <DialogContent>
                {packageDetails?.length ?
                    <Table>
                        <TableHead>
                            <TableRow>
                                {tableHeading?.map((obj) => (
                                    <TableCell>{obj}</TableCell>
                                ))}
                            </TableRow>

                        </TableHead>
                        <TableBody>
                            {
                                packageDetails?.map((item, index) => (
                                    <TableRow key={index} sx={{ height: '80px', '& td': { fontSize: '16px' }, cursor: item.status === "Filled" ? 'not-allowed' : 'pointer' }}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{item?.package_name}</TableCell>
                                        <TableCell>{`${item?.package_valid_from.slice(0, 4)}-${item?.package_valid_from.slice(0, 4)}`}</TableCell>
                                        <TableCell>{item?.board_name}</TableCell>
                                        <TableCell>{item?.class_id}</TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table> :
                    <Box sx={{ fontSize: "20px", fontWeight: "600", padding: "16px 10px", width: "100% !important" }}>{"No Data is present"}</Box>
                }
            </DialogContent>

            <DialogActions style={{ textAlign: 'center', display: 'block', marginBottom: "10px" }}>
                <Button onClick={() => setOpen(false)} variant="contained" sx={{ borderRadius: "4px" }}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ListActivatedPackagePopup