import { Box, Typography, Container } from '@mui/material';
// ----------------------------------------------------------------------


export default function NotAuthorised() {
  return (
      <Container>
          <Box mt={5} sx={{ maxWidth: 480, margin: 'auto', textAlign: 'center' }}>
              <Typography variant="h3" paragraph>
                Not Authorised!
              </Typography>
            
            <Typography sx={{ color: 'text.secondary' }}>
              Sorry, you don't have permission to access this page. Contact admin for access..
            </Typography>
          </Box>
      </Container>
  );
}