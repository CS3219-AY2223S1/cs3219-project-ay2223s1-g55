import { Button, Grid, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <Grid>
      <Typography mb={5} variant="h3">
        404 Page Not Found
      </Typography>
      <Button component={Link} to="/" variant="contained">
        Back to Home Page
      </Button>
    </Grid>
  );
}

export default NotFoundPage;
