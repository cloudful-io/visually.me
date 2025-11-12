import { Box, Typography, Alert } from '@mui/material';

type Props = {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
};

export function FormSummary({ type, message }: Props) {
  return (
    <>
      <Box mt={2}>
        <Typography variant="h6" gutterBottom>Summary</Typography>
        <Alert severity={type}>{message}</Alert>
      </Box>
    </>
  );
}
