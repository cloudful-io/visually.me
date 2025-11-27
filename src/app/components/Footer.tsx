import { Box, Stack, Alert } from '@mui/material';
import Link from 'next/link';

interface Props {
  sidebarWidth?: number;
}

export default function Footer({ sidebarWidth = 0 }: Props) {
  return (
    <Box
      sx={{
        position: { xs: "static", lg: "fixed" },
        bottom: 0,
        left: { lg: `${sidebarWidth}px`, xs: 0 },
        width: { lg: `calc(100% - ${sidebarWidth}px)`, xs: '100%' },
        bgcolor: "background.paper",
        boxShadow: "0 -2px 6px rgba(0,0,0,0.1)",
        justifyContent: "center",
        alignItems: "center",
        py: 1,
        zIndex: 1200, 
      }}
    >
      <Stack 
        direction="column"
        alignItems="center" 
        width="100%" 
        spacing={1} 
      >
        <Alert severity='warning'>
            <strong>Disclaimer:</strong> The financial calculators and content on this website are for informational and educational purposes only. They are not intended as financial, tax, or investment advice. All results are estimates based on the data you provide and assumptions made by the model. Actual outcomes may vary significantly. Please consult a licensed financial advisor before making any financial decisions.
            <Link 
              href="/privacy" 
              style={{ color: "inherit", marginLeft: '20px', marginRight: '8px', textDecoration: 'underline' }}
            >
                Privacy Policy
            </Link>
            | 
            <Link 
              href="/terms" 
              style={{ color: "inherit", marginLeft: '8px', textDecoration: 'underline' }}
            >
                Terms of Use
            </Link>
        </Alert>
      </Stack>
    </Box>
  )
}