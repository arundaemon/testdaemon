import { Box, Typography } from "@mui/material";
import Page from "../../components/Page";
import { useStyles } from "../../css/Collection-css";
import { Notification } from "../../components/Collection Process/Notification";

const CollectionNotification = () => {
  const classes = useStyles();
  return (
    <>
      <Page
        title="Extramarks | Collection List"
        className="main-container myLeadPage datasets_container"
      >
        <Box className={classes.cusCard}>
          <Box sx={{ paddingBottom: 4 }}>
            <Typography className={classes.heading} >Alert</Typography>
          </Box>
          <Notification />
        </Box>
      </Page>
    </>
  );
};

export default CollectionNotification;
