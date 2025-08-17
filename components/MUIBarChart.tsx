import { Box, Typography } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { useTheme } from '@mui/material/styles';

type Props<T extends Record<string, any>> = {
  data: T[];
  dataKey: keyof T; // Y-axis
  xKey: keyof T;    // X-axis
  title: string;
  yLabel?: string;
  height?: number;
};

export function MUIBarChart<T extends Record<string, any>>({
  data,
  dataKey,
  xKey,
  title,
  yLabel,
  height = 300,
}: Props<T>) {
  const theme = useTheme();

  return (
    <Box mt={4} sx={{ width: '100%', height }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <BarChart
        xAxis={[
          {
            id: String(xKey),
            data: data.map((item) => String(item[xKey] ?? '')),
          },
        ]}
        yAxis={[
          {
            label: yLabel,
            width: 90, // allows large numbers to display
          },
        ]}
        series={[
          {
            data: data.map((item) =>
              typeof item[dataKey] === 'number' ? item[dataKey] : 0
            ),
          },
        ]}
        height={height}
        colors={[theme.palette.primary.main]}
      />
    </Box>
  );
}
