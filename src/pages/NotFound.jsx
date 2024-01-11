import { Box, Typography, Container } from '@mui/material';
// ----------------------------------------------------------------------


export default function NotFound() {
  return (
      <Container>
          <Box mt={5} sx={{ maxWidth: 480, margin: 'auto', textAlign: 'center' }}>
              <Typography variant="h3" paragraph>
                Sorry, page not found!
              </Typography>
            
            <Typography sx={{ color: 'text.secondary' }}>
              Sorry, we couldn’t find the page you’re looking for. Perhaps you’ve mistyped the URL?
              Be sure to check your spelling.
            </Typography>
          </Box>
      </Container>
  );
}