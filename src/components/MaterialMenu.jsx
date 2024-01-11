import React, { useState } from 'react';
import { Fade, IconButton, Menu, MenuItem } from '@mui/material';

export default function MaterialMenu(props) {
    const { icon, onClose, options } = props
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        onClose();
        setAnchorEl(null);
    };

    const handleOnMenuClick = (func) => {
        setAnchorEl(null);
        func()
    }

    return (
        <div>
            <IconButton className="form_icon" size="small" onClick={handleClick}> {icon} </IconButton>
            <Menu
                id="long-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                TransitionComponent={Fade}
                MenuListProps={{
                    'aria-labelledby': 'reports-filter-more',
                    'onMouseLeave': handleClose,
                }}
                PaperProps={{
                    style: { minWidth: 100 }
                }}
            >
                {options.map((option,i) => (
                    <MenuItem className='menu-item' key={i} onClick={() => handleOnMenuClick(option.func)}>
                        {option.label}
                    </MenuItem>
                ))}
            </Menu>
        </div>
    );
}
