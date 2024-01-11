import PropTypes from 'prop-types';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
// material
import { alpha, styled } from '@mui/material/styles';
import { Box } from '@mui/material';

// ----------------------------------------------------------------------
const RootStyle = styled('div')({
  flexGrow: 1,
  height: '100%',
  overflow: 'hidden'
});

const SimpleBarStyle = styled(SimpleBar)(({ theme }) => ({
  maxHeight: '95vh',
  '& .simplebar-scrollbar': {
    '&:before': {
      backgroundColor: '#dadada'
    },
    '&.simplebar-visible:before': {
      opacity: 1
    }
  },
  '& .simplebar-track.simplebar-vertical': {
    width: 8
  },
  '& .simplebar-track.simplebar-horizontal .simplebar-scrollbar': {
    height: 6
  },
  '& .simplebar-mask': {
    zIndex: 'inherit'
  }
}));

// ----------------------------------------------------------------------

Scrollbar.propTypes = {
  children: PropTypes.node.isRequired,
  sx: PropTypes.object
};

export default function Scrollbar({ children, sx, ...other }) {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

  if (isMobile) {
    return (
      <Box sx={{ overflowX: 'auto', ...sx }} {...other}>
        {children}
      </Box>
    );
  }

  return (
    <RootStyle>
      <SimpleBarStyle 
        forceVisible="y"
        //timeout={500} clickOnTrack={false} sx={sx} 
        {...other}>
        {children}
      </SimpleBarStyle>
    </RootStyle>
  );
}
