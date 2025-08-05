import * as React from 'react';
import { Box, Typography, Button, Stack, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Footer from '@/components/Footer'

import { signIn } from "@/auth"

export default function HomePage() {
  
  return (    
    <Box
      sx={{
        px: 4,
        py: 0,
        maxWidth: 960,
        mx: 'auto',
        textAlign: 'center',
      }}
    >
      <Box component="img" src="/images/logo512.png" alt="Visually.Me" sx={{ height: 240 }} />

      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Plan Smarter. Live Better. Visually Me.
      </Typography>

      <Typography variant="h6" color="text.secondary">
        Take control of your financial future with our all-in-one planning platform. Whether you are preparing for retirement, estimating Social Security income, mapping out college savings, or managing housing and living expenses — our interactive calculators and intuitive charts make it easy to visualize your goals and stay on track.
      </Typography>

      <List sx={{ mt: 4, mb: 4, textAlign: 'left' }}>
        {[
          'Model your retirement savings and see how your income grows',
          'Forecast Social Security and pension benefits with ease',
          'Plan for major life expenses like college tuition, home ownership, and more',
          'Explore what-if scenarios and make informed decisions',
          'Stay organized with clear visualizations, projections, and personalized insights',
        ].map((text, index) => (
          <ListItem key={index} disableGutters>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <CheckCircleIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary={<Typography variant="body1"><strong>{text}</strong></Typography>}
            />
          </ListItem>
        ))}
      </List>

      <Typography variant="h6" color="text.primary" fontWeight="medium" mb={3}>
        Start building a brighter financial future—<strong>your plan, your pace, your priorities.</strong>
      </Typography>
    </Box>

  );
}
