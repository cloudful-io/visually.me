"use client";
import { Box, Typography } from '@mui/material';
import Image from "next/image";
import Link from 'next/link';

type Props = {
  showTitle?: boolean;
  homeUrl?: string;
};

const Logo = ({ showTitle = false, homeUrl = "/" }: Props) => {
    return (
        <Box
            component={Link}
            href={homeUrl}
            sx={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none", 
                color: "inherit",       
            }}
        >
            <Image src="/images/logos/logo.png" width={48} height={48} alt="Visually.Me"/>
            <Typography 
                variant="h4" 
                color='primary'
                sx={{ 
                    ml: 1, 
                    fontWeight: 800, 
                    display: showTitle
                        ? "block"
                        : { xs: "none", sm: "none", md: "block" },
                }}>
                Visually.Me
            </Typography>
        </Box>
    );
}
export default Logo;