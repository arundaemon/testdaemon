import { makeStyles } from '@mui/styles';

export const revenueAndSliderCss = makeStyles((theme) => ({
    cusCard: {
        padding: "2px",
        boxShadow: "0px 0px 8px #00000029",
        borderRadius: "8px",
    },
    RevenueCard: {
        padding: "0px",
        overflow: "hidden",
    },
    submitBtn: {
        fontWeight: "400 !important",
        backgroundColor: "#f45e29",
        border: "1px solid #f45e29",
        borderRadius: "4px !important",
        color: "#ffffff !important",
        padding: "6px 16px !important",
        marginLeft: "10px",
        "&:hover": {
            color: "#f45e29 !important",
        },
        [theme.breakpoints.down('md')]: {
            display: "none"
        },
    },
    cusSelect: {
        width: "100%",
        fontSize: "14px",
        marginLeft: "1rem",
        borderRadius: "4px",
        [theme.breakpoints.up('md')]: {
            display: "none"
        },
    },
    mbForMob: {
        [theme.breakpoints.down('md')]: {
            marginBottom: "1rem",
        }
    },
    filterSection: {
        display: "flex",
        alignItems: "center",
    },
}));