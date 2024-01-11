import { Container, LinearProgress } from '@mui/material';
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------
export default function Loader(props) {
    return (
        <Container {...props} >
                <LinearProgress />
        </Container>
    );
}