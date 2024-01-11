import { RotatingLines } from  'react-loader-spinner'
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import {Box,CircularProgress} from '@mui/material';

export const DisplayLoader = () => {
  return(
    <Stack spacing={1}>
      <Skeleton variant="text" width={300}/>
      <Skeleton variant="text" width={200}/>
      <Skeleton variant="text" width={100}/>
    </Stack>
  )
}

export const ActivityFormLoader = () =>{
    return(
      <Box sx={{
        width: "100%", 
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        backgroundColor: "#fff 0.1",
        zIndex:10
      }}>
        <CircularProgress />
      </Box>
    )
}