import LogoImage from '../assets/logo/header-logo-colored.svg';
import { Box } from '@mui/material';
// ----------------------------------------------------------------------

export default function Logo({ sx }) {
  return <Box component="img" src={LogoImage} sx={{ width: 220, height: 120, ...sx }} />;
}
