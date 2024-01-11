import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button, Chip } from "@mui/material";
import EditIcon from "../../assets/icons/edit-icon.svg";
import DeleteIcon from "../../assets/icons/icon_trash.svg";
import moment from 'moment';

const BannersTable = (props) => {
  let { bannerList, openInPopup, deleteUserType, pageNo, itemsPerPage, deleteBanner, handleAddBanner, handleBannerStatus, activeBanners } = props

  return (
    <TableContainer className="table-container" component={Paper}>
      <div className='journey-list-heading'>
        <h4>Banner list ({activeBanners})</h4>
        {/* <p>Loremispum Loremispum Loremispum</p> */}
      </div>
      <Table
        aria-label="customized table"
        className="custom-table datasets-table"
      >
        <TableHead>
          <TableRow className="cm_table_head">
            <TableCell>Sr.No</TableCell>
            <TableCell>Banner Name</TableCell>
            <TableCell>App Image</TableCell>
            <TableCell>Web Image</TableCell>
            <TableCell>Priority</TableCell>
            <TableCell>Created by &amp; Date</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {bannerList.length ?
            bannerList?.map((row, i) => (
              <TableRow key={i}>
                <TableCell>{(i + 1) + ((pageNo - 1) * itemsPerPage)}</TableCell>
                <TableCell className="datasetname-cell table-text-correction"> {row.bannerName} </TableCell>
                <TableCell>
                  <img className="menu-table-icon" src={row?.appBanner?.bannerUrl} alt="table icon" />
                </TableCell>
                <TableCell>
                  <img className="menu-table-icon" src={row?.webBanner?.bannerUrl} alt="plus icon" />
                </TableCell>
                <TableCell>{row.priority}</TableCell>
                <TableCell>{row?.createdBy ?? '-'} <div>{moment(row?.createdAt).format('DD-MM-YY, hh:mm A')}</div></TableCell>

                <TableCell>
                  <span onClick={(e) => handleBannerStatus(e, row)} className={row.status === 1 ? "cm_active" : "cm_inactive"}>{row.status === 1 ? "Active" : "Inactive"}</span>
                </TableCell>

                <TableCell className="edit-cell action-cell">
                  <Button className='form_icon' onClick={() => handleAddBanner(row?._id)}><img src={EditIcon} alt='' /></Button>
                  <Button className='form_icon' onClick={() => deleteBanner(row)}><img src={DeleteIcon} alt='' /></Button>
                </TableCell>
              </TableRow>
            )) : <></>}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BannersTable;
