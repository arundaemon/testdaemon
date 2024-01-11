//#region module
import React from 'react'
import { Button as EButton } from "@mui/material";
import { makeStyles } from '@mui/styles'
//#endregion

const useStyles = makeStyles(theme => ({
    root: {
        margin: theme.spacing(0.5),
        borderRadius:'4px',
    },
    label: {
        textTransform: 'none'
    }
}))

export default function Button(props) {
    const { text, size, color, variant, onClick, className, ...other } = props
    const classes = useStyles();

    return (
        <EButton
            variant={variant || "contained"}
            size={size || "large"}
            color={color || "primary"}
            onClick={onClick}
            {...other}
            classes={{ root: classes.root, label: classes.label }}
            className={className}>
            {text}
        </EButton>
    )
}
