import { Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

type Props = {
  title: string;
};

export function FormTitle({ title }: Props) {
  const theme = useTheme();
  return (
    <Typography variant="h5" gutterBottom>
      {title}
    </Typography>
  );
}
