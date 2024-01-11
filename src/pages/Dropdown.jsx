import React from 'react';
import { useState } from 'react';
import Select from 'react-select'
import ConditionalRendering from './ConditionalRendering';
import { Container, TextField, Button, Grid, Typography } from "@mui/material";

const options = [
    { value: 'ROLE', label: 'Role' },
    { value: 'PROFILE', label: 'Profile' }

]

function Dropdown() {
    const [value, setValue] = React.useState("");
    const handleChange = (e) => {
        setValue(e.value);
    };

    return (
        <div>
            <div style={{ width: '200px' }}>
                <Select options={options} onChange={handleChange} />
            </div>

            <Typography variant='h6'>{value}</Typography>
            <ConditionalRendering value={value} />
        </div>
    )
}

export default Dropdown;





