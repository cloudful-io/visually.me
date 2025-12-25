import { Stack, Divider, Avatar, Box, Typography, Button } from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";

export function OutgoingInviteCard({
  partnerEmail,
  onRevoke,
}: {
  partnerEmail: string;
  onRevoke: () => void;
}) {
  return (
    <Box
      mb={3}
      p={2}
      
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar sx={{ bgcolor: "grey.300", color: "grey.700" }}>
          <MailOutlineIcon />
        </Avatar>
        <Box>
          <Typography variant="subtitle1" fontWeight={600}>
            Invitation sent
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Waiting for {partnerEmail} to accept
          </Typography>
        </Box>
      </Stack>

      <Divider sx={{ my: 2 }} />

      <Typography variant="body2" sx={{ mb: 2 }}>
        We have sent an invitation to <strong>{partnerEmail}</strong>.
        Once they accept, you will both be able to view shared retirement income,
        investments, and real estate in one place.
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        If they do not see the email, ask them to check their spam folder.
        You can revoke this invitation at any time.
      </Typography>

      <Stack direction="row" spacing={2}>
        {/* Optional future feature */}
        {/* <Button variant="outlined">Resend Invite</Button> */}

        <Button variant="outlined" color="secondary" onClick={onRevoke}>
          Cancel Invitation
        </Button>
      </Stack>
    </Box>
  );
}
