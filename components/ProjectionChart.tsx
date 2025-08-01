import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from 'recharts';
import { Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

type Props = {
  data: any[];
  dataKey: string;
  title: string;
};

export function ProjectionChart({ data, dataKey, title }: Props) {
  const theme = useTheme();
  return (
    <Box mt={4}>
      <Typography variant="h6" gutterBottom>{title}</Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
          <Bar dataKey={dataKey} fill={theme.palette.primary.main} />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}
