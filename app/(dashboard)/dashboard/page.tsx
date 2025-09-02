import * as React from 'react';
import { Box } from '@mui/material';
import { auth } from "@/auth"
import { redirect } from "next/navigation";


export default async function Dashboard() {
  /*const session = await auth()
  if (!session) 
    redirect("/signin"); // this will immediately redirect
*/
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
      Dashboard
    </Box>

  );
}
