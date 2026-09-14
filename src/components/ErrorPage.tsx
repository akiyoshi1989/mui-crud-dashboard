import { Button, Container, Stack, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router';
import { appPaths } from '../app-paths';

type ErrorPageProps = {
  message: string;
};

export default function ErrorPage({ message }: ErrorPageProps) {
  const queryClient = useQueryClient();

  return (
    <Container maxWidth="md">
      <Stack spacing={2} sx={{ py: 8 }}>
        <Typography variant="h4" component="h1">
          {message}
        </Typography>
        <Button
          component={Link}
          to={appPaths.home}
          variant="contained"
          onClick={() => {
            queryClient.resetQueries();
          }}
        >
          トップ画面へ戻る
        </Button>
      </Stack>
    </Container>
  );
}
