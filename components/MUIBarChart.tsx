import { Box, Typography } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { useTheme } from '@mui/material/styles';

type DataItem = {
  year: string | number;
  [key: string]: number | string;
};

type Props = {
  data: DataItem[];
  dataKey: string;
  title: string;
  yLabel?: string;
  height?: number;
};

export function MUIBarChart({ data, dataKey, title, yLabel, height = 300 }: Props) {
  const theme = useTheme();

  return (
    <Box mt={4} sx={{ width: '100%', height }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <BarChart
        xAxis={[
          {
            id: 'year',
            data: data.map((item) => String(item.year)),
          },
        ]}
        yAxis={[
          {
            label: yLabel,
            width: 90, // This will allow a 7-digit number to display without truncation
          }  
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
