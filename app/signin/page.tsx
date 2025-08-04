'use client';

import { useEffect, useState } from 'react';
import { signIn, getProviders } from 'next-auth/react';

import {
  Container,
  Box,
  Typography,
  Button,
  CircularProgress,
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import AppleIcon from '@mui/icons-material/Apple';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import LockIcon from '@mui/icons-material/Lock';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import SecurityIcon from '@mui/icons-material/Security';
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';

const providerIcons: Record<string, React.ReactNode> = {
  google: <GoogleIcon />,
  github: <GitHubIcon />,
  facebook: <FacebookIcon />,
  twitter: <TwitterIcon />,
  linkedin: <LinkedInIcon />,
  email: <EmailIcon />,
  apple: <AppleIcon />,
  discord: <ChatBubbleIcon />,
  slack: <ChatBubbleIcon />,
  auth0: <LockIcon />,
  'azure-ad': <CloudQueueIcon />,
  cognito: <CloudQueueIcon />,
  okta: <SecurityIcon />,
  twitch: <VideogameAssetIcon />,
  // Add custom SVG or image-based icons for these:
  notion: null,
  spotify: null,
  reddit: null,
  stripe: null,
};

export default function SignInPage() {
  const [providers, setProviders] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    getProviders().then(setProviders);
  }, []);

  if (!providers) {
    return (
      <Box
        minHeight="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <CircularProgress />
      </Box>
    );
  }

  const callbackUrl = typeof window !== 'undefined' ? (window.location.pathname + window.location.search): '/';
  //const callbackUrl = "http://localhost:3000/calculators/fers-pension";

  return (
    <Container maxWidth="xs">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        textAlign="center"
      >
        <Box mb={3}>
          <img src="/images/logo.png" alt="Logo" />
        </Box>

        <Typography variant="h5" gutterBottom>
          Sign in to your account
        </Typography>

        <Box mt={4} width="100%">
          {Object.values(providers).map((provider) => (
            <Button
              key={provider.name}
              startIcon={providerIcons[provider.id] ?? null}
              onClick={() => signIn(provider.id, { callbackUrl: callbackUrl.toString() })}
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mb: 2 }}
            >
              Sign in with {provider.name}
            </Button>
          ))}
        </Box>
      </Box>
    </Container>
  );
}
