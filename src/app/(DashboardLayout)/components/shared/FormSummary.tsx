import { Box, Typography, Alert } from '@mui/material';

type Props = {
  showTitle?: boolean;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string | string[];
};

export function FormSummary({ showTitle = true, type, message }: Props) {
  const messages = Array.isArray(message) ? message : [message];

  return (
      <Box mt={showTitle? 2: 0}>
        {showTitle &&
          <Typography variant="h6" gutterBottom>Summary</Typography>
        }
        {messages.map((msg, idx) => (
          <Alert 
            variant='outlined'
            key={idx} 
            severity={type} 
            sx={{
              borderWidth: 3,
            }}>
            {msg}
          </Alert>
        ))}
      </Box>
  );
}
