import PropTypes from "prop-types";
import { alpha, styled } from "@mui/material/styles";
import { Box, Stack, AppBar, Toolbar } from "@mui/material";
// components
// import AccountPopover from "./AccountPopover";
// import Notification from "../assets/icons/icon_notification.svg";
// import Search from "../assets/icons/icon_search_header.svg";
// import Headerlogo from "../assets/img/header-logo.jpg";
import Headerlogo from "../assets/logo/extramarks-smart-classes-500x500.svg";

// ----------------------------------------------------------------------

// const DRAWER_WIDTH = 182;
const APPBAR_MOBILE = 64;
const APPBAR_DESKTOP = 80;

const RootStyle = styled(AppBar)(({ theme }) => ({
    boxShadow: "none",
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)", // Fix on Mobile
    backgroundColor: alpha(theme.palette.background.default, 0.72),
    //   [theme.breakpoints.up("lg")]: {
    //     width: `calc(100% - ${DRAWER_WIDTH + 1}px)`,
    //   },
}));

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
    minHeight: APPBAR_MOBILE,
    [theme.breakpoints.up("lg")]: {
        minHeight: APPBAR_DESKTOP,
        // padding: theme.spacing(0, 5),
    },
}));

// ----------------------------------------------------------------------

DashboardNavbar.propTypes = {
    onOpenSidebar: PropTypes.func,
};

export default function DashboardNavbar({ onOpenSidebar }) {
    return (
        <RootStyle>
            <ToolbarStyle className="main-header">
                <Stack direction="row" alignItems="center">
                    <div className="appHeader_left">
                        <img src={Headerlogo} alt="logo" className="img-fluid" />
                    </div>
                </Stack>
                <Box sx={{ flexGrow: 1 }} />
            </ToolbarStyle>
        </RootStyle>
    );
}
