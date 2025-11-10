import * as React from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText, Typography, Link } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { auth } from "@/auth"
import { redirect } from "next/navigation";
import { getOrCreateOrUpdateUser } from '@/lib/user';


export default async function HomePage() {
  const session = await auth()
  if (session) 
  {
    const user = await getOrCreateOrUpdateUser({email: session.user?.email!, fullName: session.user?.name!});
    
    if (user && !user.onboarding_complete) {
      redirect("/new"); // this will immediately redirect
    }
  }

  const features = [
  {
    segments: [
      { text: 'Model your ' },
      { text: 'retirement savings', link: '/calculators/retirement-savings' },
      { text: ' and see how your income grows' },
    ],
  },
  {
    segments: [
      { text: 'Forecast ' },
      { text: 'social security', link: '/calculators/social-security' },
      { text: ' and ' },
      { text: 'pension benefits', link: '/calculators/fers-pension' },
      { text: ' with ease' },
    ],
  },
  {
    segments: [
      { text: 'Plan for major life expenses like ' },
      { text: 'college tuition', link: '/calculators/college-tuition' },
      { text: ', ' },
      { text: 'home ownership', link: '/calculators/mortgage' },
      { text: ', and more' },
    ],
  },
  {
    segments: [
      { text: 'Explore what-if scenarios and make informed decisions' },
    ],
  },
  {
    segments: [
      { text: 'Stay organized with clear visualizations, projections, and personalized insights' },
    ],
  },
  ];

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
      <Box component="img" src="/images/logos/logo512.png" alt="Visually.Me" sx={{ height: 180 }} />

      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Plan Smarter. Live Better. Visually Me.
      </Typography>

      <Typography variant="h6" color="text.secondary">
        Take control of your financial future with our all-in-one planning platform. Whether you are preparing for retirement, estimating Social Security income, mapping out college savings, or managing housing and living expenses — our interactive calculators and intuitive charts make it easy to visualize your goals and stay on track.
      </Typography>

      <List sx={{ mt: 4, mb: 4, textAlign: 'left' }}>
        {features.map((feature, index) => (
          <ListItem key={index} disableGutters>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <CheckCircleIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography variant="body1" fontWeight="bold">
                  {feature.segments.map((segment, i) =>
                    segment.link ? (
                      <Link
                        key={i}
                        href={segment.link}
                        rel="noopener"
                        underline="hover"
                      >
                        {segment.text}
                      </Link>
                    ) : (
                      <span key={i}>{segment.text}</span>
                    )
                  )}
                </Typography>
              }
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
