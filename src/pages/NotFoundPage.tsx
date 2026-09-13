import { Button, Container, Stack, Typography } from '@mui/material';
import { Link } from 'react-router';
import { appPaths } from '../app-paths';

export default function NotFoundPage() {
  return (
    <Container maxWidth="md">
      <Stack spacing={2} sx={{ py: 8 }}>
        <Typography variant="h4" component="h1">
          ページが見つかりません
        </Typography>
        <Button component={Link} to={appPaths.home} variant="contained">
          ホームへ戻る
        </Button>
      </Stack>
    </Container>
  );
}
