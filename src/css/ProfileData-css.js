import { makeStyles } from '@mui/styles';

export const useStyles = makeStyles((theme) => ({
    root: {
        boxShadow: 'none'
    },
    stapper: {
        "& .Mui-disabled .MuiStepIcon-root": { color: "#dedede" }
    },
    bullet: {
        display: "inline-block",
        margin: "0 2px",
        transform: "scale(0.8)",
    },
    title: {
        fontSize: 14,
    },
    gridContainer: {
        paddingLeft: "10px",
        paddingRight: "10px",
    },
    buttonW: {
        width: "100px",
        height: "30px"
    },
    headerContainer: {
        [theme.breakpoints.up('md')]: {
            display: 'none'
        },
        width: "100%",
        display: 'flex',
        boxShadow: '0px 1px 4px #20212429',
        padding: '20px',
        position: 'fixed',
        top: '0',
        left: '0',
        zIndex: '1000',
        background: 'white'
    },
    headerTitle: {
        fontSize: '18px',
        fontWeight: '600',
        marginLeft: '10px'

    }, breadcrumbsClass: {
        textAlign: 'left',
        fontSize: '14px',

    },
    breadcrumbsBar: {
        [theme.breakpoints.down('md')]: {
            display: 'none',
        }
    }
    ,
    listingGrid: {
        marginBottom: 20,
        [theme.breakpoints.down('md')]: {
            height: '100%',
            marginTop: '90px',
            marginBottom: 0,
        }
    },
    alternativeLabelClass: {
        [theme.breakpoints.down('md')]: {
            '& .MuiStepLabel-alternativeLabel': {
                marginTop: '0px'
            },
            '& .listing-step-label-date': {
                fontSize: '12px'
            }
        }
    },
    stapperBox: {
        width: '100%',
        paddingBottom: '20px',
        [theme.breakpoints.down('md')]: {
            paddingBottom: "10px"
        }
    },
    listingStudentAvtar: {
        [theme.breakpoints.down('md')]: {
            height: '50px',
            width: "50px",
        }
    },
    stpper2Class: {
        [theme.breakpoints.down('md')]: {
            overflowX: 'auto',
            scrollbarWidth: 'none',
        }
    }, stpper2ClassInner: {
        [theme.breakpoints.down('md')]: {
            width: '750px',
        }

    }, step2lebel: {
        [theme.breakpoints.down('md')]: {
            '& span': {
                fontSize: '12px',
                lineHeight: "19px"
            }
        }

    },
    lastContainer: {
        marginBottom: '30px',
    },
    inputStyle: {
        fontSize: "14px",
        padding: "8.8px",
        width: "100%",
        height: '38px',
        borderRadius: "4px",
        border: "1px solid #DEDEDE",
    },
    inputStyle2: {
        fontSize: "14px",
        padding: "8.8px",
        width: "50%",
        height: '38px',
        borderRadius: "4px",
        border: "1px solid #DEDEDE",
    },
    iconStyle: {
        display: "block",
        marginLeft: "auto",
        marginRight: "auto",
    },
    registerBtn: {
        display: "flex",
        width: "40%",
        justifyContent: "end"
    },
    registerCreate: {
        border: "1px solid #f45e29",
        color: "#f45e29",
        padding: "5px 15px",
        borderRadius: "4px",
        cursor: 'pointer'
    },
    cold: {
        color: "#4481fb"
    },
    warm: {
        color: "#FA9E2D"
    },
    popupHeaderTitle: {
        fontSize: 18,
        fontWeight: 600,
        marginBottom: 25,
    },
    callDetailContainer: {
        display: 'flex',
        alignItems: 'center',
        cursor:'pointer'
    },
    userHeaderTitle: {
        fontSize: 14,
        fontWeight: 600,
        width: 160,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    userHeaderSubTitle: {
        fontSize: 12,
        fontWeight: 400,
    },
    userDetailContainer: {
        marginLeft: 10,
        textAlign: 'left',
    },
    mainCallPopupContainer: {
        display: 'grid',
        gridTemplateColumns: 'auto auto',
        gridGap: 30,
        [theme.breakpoints.down('md')]: {
            gridTemplateColumns: 'auto',
        }
    }
}));

export const ModalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    maxWidth: "calc(100% - 16px)",
    bgcolor: "background.paper",
    border: "2px solid #fff",
    boxShadow: "0px 0px 4px #0000001A",
    padding: '20px 40px',
    borderRadius: "8px",
};

export const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

export const modalUseStyles = makeStyles((theme) => ({
    heading: {
        fontSize: 18,
        fontWeight: 600,
        lineHeight: '24px',
        textAlign: 'center'
    },
    contentText: {
        fontSize: '14px',
        lineHeight: '38px',
        fontWeight: '600',
        color: '#202124',
        marginRight: '15px'
    },

}))
