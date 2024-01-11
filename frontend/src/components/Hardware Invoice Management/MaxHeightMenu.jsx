import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from "react-router-dom";

const options = [
  'Generate Voucher',
  'Update',
  'Cance'
];

const ITEM_HEIGHT = 48;

export default function MaxHeightMenu({ menuOptions, rowData, handleUpdateInvoice, handleCancel }) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelected = (value) => {
    if (value == "Update") {
      handleUpdateInvoice(rowData)
    }
    if (value == "Cancel") {
      handleCancel(rowData?.hw_invoice_auto_id ? rowData?.hw_invoice_auto_id : rowData?.hw_voucher_auto_id)
    }
    if (value === "View") {
      navigate("/authorised/hardware-voucher-details", {
        state: {
          data: rowData,
        },
      });
    }
    if (value === "update") {
      navigate("/authorised/hardware-voucher-update", {
        state: {
          data: rowData,
        },
      });
    }
    if (value === "Generate Voucher") {
      navigate("/authorised/hardware-voucher-form", {
        state: {
          data: rowData,
        },
      });
    }
  }

  return (
    <div>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: '20ch',
          },
        }}
      >
        {menuOptions.map((option) => (
          <MenuItem key={option} selected={option === 'Pyxis'} onClick={() => handleSelected(option)}>
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
