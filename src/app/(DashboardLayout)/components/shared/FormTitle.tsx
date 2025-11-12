import { Typography } from '@mui/material';

type Props = {
  title: string;
};

export function FormTitle({ title }: Props) {
  return (
    <Typography variant="h5" gutterBottom>
      {title}
    </Typography>
  );
}
