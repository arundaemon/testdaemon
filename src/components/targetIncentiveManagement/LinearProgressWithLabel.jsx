import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import toast from 'react-hot-toast';


function LinearProgressWithLabel(props) {
  const style = {
    height: 8,
    border: "1px solid #F45E29",
    borderRadius: 1,

  };
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress sx={style} variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 38 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

LinearProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate and buffer variants.
   * Value between 0 and 100.
   */
  value: PropTypes.number.isRequired,
};
let progressInterval = null;


export default function LinearWithValueLabel({ uploadMessage }) {
  const [progress, setProgress] = React.useState(0);

  useEffect(() => {
    progressInterval = setInterval(() => {
      setProgress(prev => prev + 10);
    }, 400);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      clearInterval(progressInterval);
      if (uploadMessage)
        toast.success(uploadMessage)
    }
  }, [progress]);

  return (
    <Box sx={{ width: '100%' }}>
      <LinearProgressWithLabel value={progress} />
    </Box>
  );
}
