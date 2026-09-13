import { Box, Chip, Container, Stack, Typography } from '@mui/material';

export default function HomePage() {
  return (
    <Container maxWidth="md">
      <Box sx={{ py: 8 }}>
        <Stack spacing={2}>
          <Typography variant="h4" component="h1">
            MUI CRUD Dashboard
          </Typography>
          <Typography color="text.secondary">
            React + Vite + MUI + Biome + React Router の土台です。
          </Typography>
          <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
            <Chip label="React" />
            <Chip label="Vite" />
            <Chip label="MUI" color="primary" />
            <Chip label="Biome" />
            <Chip label="React Router" />
          </Stack>
        </Stack>
      </Box>
    </Container>
  );
}
